export const BASE_URL = "http://localhost:3000";

export const API_PATHS = {
    AUTH: {
        LOGIN: "/api/auth/login",
        REGISTER: "/api/auth/register",
        GET_USER_INFO: "/api/auth/getUSER",
    },
    DASHBOARD: {
        GET_DATA: "/api/dashboard",
    },
    INCOME: {
        ADD_INCOME: "api/income/add",
        GET_ALL_INCOME: "/api/income/get",
        DELETE_INCOME: (incomeId) => `/api/income/${incomeId}`,
        DOWNLOAD_INCOME: `/api/income/downloadexcel`,

    },
    EXPENSE: {
        ADD_EXPENSE: "api/expense/add",
        GET_ALL_EXPENSE: "/api/expense/get",
        DELETE_EXPENSE: (expenseId) => `/api/expense/${expenseId}`,
        DOWNLOAD_EXPENSE: `/api/expense/downloadexcel`,
    },
    IMAGE: {
        UPLOAD_IMAGE: "/uploads/upload-image",
    }
}