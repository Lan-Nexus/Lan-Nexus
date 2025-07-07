import axios from 'axios';
import router from '../router';

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
            router.currentRoute.value.path !== '/login'
        ) {
            const currentPath = router.currentRoute.value.fullPath;
            router.push({ path: '/login', query: { redirect: currentPath } });
        }
        return Promise.reject(error);
    }
);

export default api;
