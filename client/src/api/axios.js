
import axios from "axios";

const api = axios.create({
  baseURL: "https://fresh-cart-learning-hub-6ahj-2rw33bpc3-hm19.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the saved JWT to requests that need authentication.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("freshcart_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
