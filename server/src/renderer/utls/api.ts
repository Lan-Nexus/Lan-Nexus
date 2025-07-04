import axios from 'axios';

// Optionally, get token from localStorage or a Pinia store
function getAuthToken() {
  return localStorage.getItem('token');
}

const api = axios.create({
  baseURL: '/',
});


api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (
            error.response &&
            error.response.status === 403 &&
            window.location.pathname !== '/login'
        ) {
            // Redirect to login page
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
