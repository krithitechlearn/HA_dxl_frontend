import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    config.headers['X-Trace-Id'] = crypto.randomUUID();
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Handle token refresh logic
            try {
                const refreshResponse = await axios.post('/api/v1/auth/refresh', null, {
                    withCredentials: true,
                });
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${refreshResponse.data.token}`;
                return apiClient.request(error.config);
            } catch (refreshError) {
                // Redirect to login
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;