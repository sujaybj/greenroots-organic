import axios from 'axios';
import toast from 'react-hot-toast';

const explicitApiUrl = process.env.REACT_APP_API_URL;
const host = window.location.hostname;
const isLocalHost = host === 'localhost' || host === '127.0.0.1';
const explicitIsLocalhost = explicitApiUrl?.includes('localhost') || explicitApiUrl?.includes('127.0.0.1');

// Never use localhost API URLs when frontend is hosted publicly.
const API_BASE = !isLocalHost && explicitIsLocalhost
  ? 'https://greenroots-backend.onrender.com/api'
  : (explicitApiUrl || (isLocalHost ? '/api' : 'https://greenroots-backend.onrender.com/api'));

const API = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.code === 'TOKEN_EXPIRED' &&
      !original._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return API(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

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

    const msg = error.response?.data?.message;
    if (msg && error.response?.status !== 401) toast.error(msg);

    return Promise.reject(error);
  }
);

export default API;
