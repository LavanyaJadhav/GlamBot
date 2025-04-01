import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    gender?: string;
    fashion_preference?: string;
  }) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
};

// Image APIs
export const images = {
  upload: async (formData: FormData) => {
    const response = await api.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getUserImages: async (userId: number) => {
    const response = await api.get(`/images/user/${userId}`);
    return response.data;
  },
  deleteImage: async (imageId: number) => {
    const response = await api.delete(`/images/${imageId}`);
    return response.data;
  },
};

// Products APIs
export const products = {
  getAll: async () => {
    const response = await api.get('/products');
    return response.data;
  },
  getById: async (productId: number) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },
};

// Recommendations APIs
export const recommendations = {
  getUserRecommendations: async (userId: number) => {
    const response = await api.get(`/recommendations/user/${userId}`);
    return response.data;
  },
};

export default api; 