import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// Attach JWT for protected routes
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle expired / invalid token globally
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Token expired or invalid — clear storage and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default API;