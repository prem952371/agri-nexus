import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Orders
export const getOrders = (params) => api.get('/orders', { params });
export const getOrder = (id) => api.get(`/orders/${id}`);
export const createOrder = (data) => api.post('/orders', data);
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });

// Forecast
export const getForecast = (params) => api.get('/forecast', { params });

// Routes
export const optimizeRoutes = (data) => api.post('/routes/optimize', data);
export const getDeliveries = () => api.get('/routes/deliveries');

// Analytics
export const getAnalyticsOverview = () => api.get('/analytics/overview');
export const getImpactData = () => api.get('/analytics/impact');

// Users
export const getUsers = (params) => api.get('/users', { params });
export const getUser = (id) => api.get(`/users/${id}`);
export const getUserStats = (id) => api.get(`/users/${id}/stats`);
export const createUser = (data) => api.post('/users', data);

export default api;
