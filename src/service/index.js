import axios from 'axios';

const API_INSTANCE = axios.create({
    baseURL: import.meta.env.VITE_API_HOST,
    withCredentials: true,
});

const getCookie = (key) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${key}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
};

API_INSTANCE.interceptors.request.use(
    (config) => {
        // Try localStorage first (from login), then cookie as fallback
        const token = localStorage.getItem('token') || getCookie("token");
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        }
        return config;
    },
    (error) => Promise.reject(error),
);

API_INSTANCE.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const { status } = error.response;

            if (status === 401) {
                // Unauthorized - token invalid or expired
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                // Only redirect if not already on login page
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            } else if (status === 403) {
                // Forbidden - insufficient permissions
                window.location.href = '/unauthorized';
            }
        }

        return Promise.reject(error);
    }
);


export default API_INSTANCE;