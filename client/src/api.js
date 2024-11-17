import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Access-Control-Allow-Origin': null
  }
});

export const setAuthToken = token => {
  api.defaults.headers.common['Authorization'] = token;
};

