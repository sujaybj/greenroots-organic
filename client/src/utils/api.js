import axios from 'axios';
import toast from 'react-hot-toast';

// ── Auto-detect backend URL ───────────────────────────────────
// In development: proxy via package.json ("proxy": "http://localhost:5000")
// In production: direct URL to Render backend
const BACKEND = window.location.hostname === 'localhost'
  ? ''   // empty = use proxy from package.json
  : 'https://greenroots-backend.onrender.com';

const API = axios.create({
  baseURL:         `${BACKEND}/api`,
  withCredentials: true,
  headers:         { 'Content-Type': 'application/json' },
  timeout:         30000,  // 30s timeout
});

// ── Request: attach Bearer token ─────────────────────────────
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response: handle 401 with silent token refresh ───────────
let isRefreshing = false;
let failedQueue  = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token));
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Token expired — try refresh
    if (error.response?.status === 401 &&
        error.response?.data?.code === 'TOKEN_EXPIRED' &&
        !original._retry) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          original.headers.Authorization = `Bearer ${token}`;
          return API(original);
        });
      }

      original._retry = true;
      isRefreshing    = true;

      try {
        const { data } = await API.post('/auth/refresh-token');
        localStorage.setItem('accessToken', data.accessToken);
        processQueue(null, data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return API(original);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Show toast for non-auth errors
    const msg = error.response?.data?.message;
    if (msg && error.response?.status !== 401) toast.error(msg);

    return Promise.reject(error);
  }
);

export default API;
