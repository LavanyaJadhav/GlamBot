require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Import routes
const recommendationsRouter = require('./routes/recommendations');
const uploadsRouter = require('./routes/uploads');
const chatbotRouter = require('./routes/chatbot');
const chatHistoryRouter = require('./routes/chat-history');
const styleProfileRouter = require('./routes/style-profile');

// Basic middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Accept', 'Origin', 'Authorization'],
  credentials: true,
  exposedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add CORS preflight
app.options('*', cors());

// Request logging middleware
app.use((req, res, next) => {
  console.log('\n=== New Request ===');
  console.log('Time:', new Date().toISOString());
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Body:', req.body);
  console.log('==================');
  next();
});

// Simple test routes
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    cors: {
      origin: req.headers.origin,
      method: req.method
    }
  });
});

app.post('/test', (req, res) => {
  console.log('Test POST received:', req.body);
  res.json({ 
    received: req.body,
    message: 'Test endpoint working'
  });
});

// Mount routers
app.use('/api/chat', (req, res, next) => {
  console.log('Chatbot request:', {
    method: req.method,
    path: req.path,
    body: req.body
  });
  next();
}, chatbotRouter);
app.use('/api', uploadsRouter);
app.use('/api', recommendationsRouter);
app.use('/api/chat-history', chatHistoryRouter);
app.use('/api', styleProfileRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error('\n=== Error ===');
  console.error(err);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`\n=== Server Status ===`);
  console.log(`Server running on: http://localhost:${PORT}`);
  console.log(`CORS enabled for: http://localhost:3000`);
  console.log(`Database host: ${process.env.DB_HOST}`);
  console.log(`===================\n`);
  
  // Log all registered routes
  console.log('\nRegistered Routes:');
  app._router.stack.forEach((middleware) => {
    if (middleware.route) { // routes registered directly on the app
      console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
    } else if (middleware.name === 'router') { // router middleware
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const path = handler.route.path;
          const methods = Object.keys(handler.route.methods);
          console.log(`${methods} ${middleware.regexp} ${path}`);
        }
      });
    }
  });
}); 