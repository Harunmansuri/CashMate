import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Request Interceptor — attaches the JWT saved at login/signup
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Server responded with an error status
        if (error.response) {
            if (error.response.status === 401) {
                // token missing/expired/invalid — clear the stale session and
                // send the user back to login instead of leaving them stuck
                localStorage.removeItem("token");
                localStorage.removeItem("cashmate_user");
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
            } else if (error.response.status === 500) {
                console.error("Server error. Please try again later.");
            }
        } else if (error.code === "ECONNABORTED") {
            console.error("Request timeout. Please try again.");
        } else {
            // network error / server unreachable (e.g. backend not running)
            console.error("Network error. Is the API server running?");
        }
        // Always propagate the error so callers can show a toast, etc.
        // (the original version silently returned `undefined` here for
        // non-response errors, which broke every .catch() downstream)
        return Promise.reject(error);
    }
);

export default axiosInstance;
