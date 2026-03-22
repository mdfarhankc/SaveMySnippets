import axios from "axios";
import { BACKEND_URL } from "./constants";
import { useAuthStore } from "@/store";


const api = axios.create({
    baseURL: BACKEND_URL,
});

api.interceptors.request.use((config) => {
    const access = useAuthStore.getState().access;
    if (access) {
        config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        // Prevent infinite loop
        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const { refresh, login, logout } = useAuthStore.getState();

            // No refresh token — force logout
            if (!refresh) {
                logout();
                return Promise.reject(error);
            }

            try {
                const res = await axios.post(`${api.defaults.baseURL}/auth/token/refresh/`, {
                    refresh,
                });

                const { access } = res.data;
                const user = useAuthStore.getState().authUser;

                login({ access, refresh, authUser: user! });

                // Update Authorization header and retry request
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, force logout
                logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
