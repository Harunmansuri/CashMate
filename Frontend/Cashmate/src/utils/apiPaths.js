// Points at the Express server (server.js -> app.listen(process.env.PORT || 5000)).
// Override with a .env file at the project root: VITE_API_BASE_URL=http://localhost:5000
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_PATHS = {
    AUTH: {
        LOGIN: "/api/auth/login",
        REGISTER: "/api/auth/register",
        GET_USER_INFO: "/api/auth/getUser",
        // authRoutes.js registers this directly on the router, so with
        // app.use("/api/auth", authRoutes) the real path is /api/auth/upload-image
        UPLOAD_IMAGE: "/api/auth/upload-image",
    },
    DASHBOARD: {
        GET_DATA: "/api/dashboard",
    },
    INCOME: {
        ADD_INCOME: "/api/income/add",
        GET_ALL_INCOME: "/api/income/get",
        DELETE_INCOME: (incomeId) => `/api/income/${incomeId}`,
        DOWNLOAD_INCOME: "/api/income/downloadexcel",
    },
    EXPENSE: {
        ADD_EXPENSE: "/api/expense/add",
        GET_ALL_EXPENSE: "/api/expense/get",
        DELETE_EXPENSE: (expenseId) => `/api/expense/${expenseId}`,
        DOWNLOAD_EXPENSE: "/api/expense/downloadexcel",
    },
};
