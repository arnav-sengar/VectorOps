import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// attach token to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('to_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// centralize error shape + force logout on 401
client.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message || error?.message || 'Something went wrong';

    if (status === 401) {
      localStorage.removeItem('to_token');
      localStorage.removeItem('to_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject({ status, message, raw: error });
  }
);

export default client;
