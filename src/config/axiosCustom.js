import { Mutex } from "async-mutex";
import axiosClient from "axios";

const instance = axiosClient.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true
});

const mutex = new Mutex();
const NO_RETRY_HEADER = "x-no-retry";

const handleRefreshToken = async () => {
    return await mutex.runExclusive(async () => {
        const res = await instance.get("/auth/refresh");
        if (res && res.data) return res.data.access_token;
        return null;
    });
};

instance.interceptors.request.use((config) => {
    const token = window.localStorage.getItem("access_token");

    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }

    if (!config.headers.Accept && config.headers["Content-Type"]) {
        config.headers.Accept = "application/json";
        config.headers["Content-Type"] = "application/json; charset=utf-8";
    }

    return config;
});

instance.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        if (
            error.config && error.response &&
            error.response.status === 401 &&
            error.config.url !== "/auth/login" &&
            !error.config.headers[NO_RETRY_HEADER]
        ) {
            const access_token = await handleRefreshToken();
            error.config.headers[NO_RETRY_HEADER] = "true";
            if (access_token) {
                error.config.headers["Authorization"] = `Bearer ${access_token}`;
                localStorage.setItem("access_token", access_token);
                return instance.request(error.config);
            }
        }

        if (
            error.config && error.response &&
            error.response.status === 400 &&
            error.config.url === "/auth/refresh" &&
            window.location.pathname.startsWith("/admin")
        ) {
            // Xử lý refresh token thất bại
            localStorage.removeItem("access_token");
            window.location.href = '/login';
        }

        // Trả về error.response.data nếu có, nếu không thì reject error
        return Promise.reject(error.response?.data || error);
    }
);

export default instance;