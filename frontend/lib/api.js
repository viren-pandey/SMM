import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
    withCredentials: true,
});

// Interceptor to handle tokens if needed (already handled by cookies in backend)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors e.g. 401
        if (error.response?.status === 401) {
            // Handle logout/redirect
        }
        return Promise.reject(error);
    }
);

export default api;
