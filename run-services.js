const { spawn } = require('child_process');
const path = require('path');

// Start the main backend
const mainBackend = spawn('node', ['src/server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// Start the style service
const styleService = spawn('python', ['main.py'], {
  cwd: path.join(__dirname, 'backend/style-service'),
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  mainBackend.kill();
  styleService.kill();
  process.exit();
});

console.log('Both services are running:');
console.log('- Main backend: http://localhost:5000');
console.log('- Style service: http://localhost:5001'); 