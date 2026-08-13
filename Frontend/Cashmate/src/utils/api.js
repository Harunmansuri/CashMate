// Central API service layer — every real network call to the Express/Mongo
// backend lives here, so pages just call these functions and stay simple.
import axiosInstance from "./axiosInstance";
import { API_PATHS } from "./apiPaths";

/* --------------------------------- Auth --------------------------------- */

export const registerUser = async ({ fullName, email, password, profileImageUrl }) => {
  const { data } = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
    fullName,
    email,
    password,
    profileImageUrl,
  });
  return data;
};

export const loginUser = async ({ email, password }) => {
  const { data } = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
  return data;
};

export const fetchCurrentUser = async () => {
  const { data } = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
  return data;
};

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await axiosInstance.post(API_PATHS.AUTH.UPLOAD_IMAGE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.imageUrl;
};

/* ------------------------------- Dashboard ------------------------------- */

export const fetchDashboardData = async () => {
  const { data } = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
  return data;
};

/* -------------------------------- Income --------------------------------- */
// Backend doc: { _id, userId, icon, source, amount, date, createdAt }
// Normalized to `id` so existing components (TransactionList, DeleteAlert)
// that expect `item.id` keep working unchanged.
const normalizeIncome = (doc) => ({ ...doc, id: doc._id });

export const fetchIncome = async () => {
  const { data } = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
  return data.map(normalizeIncome);
};

export const createIncome = async ({ icon, source, amount, date }) => {
  const { data } = await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
    icon,
    source,
    amount,
    date,
  });
  return normalizeIncome(data);
};

export const removeIncome = async (id) => {
  const { data } = await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
  return data;
};

// The backend has no PUT/PATCH route for income, so "edit" is simulated as
// delete-then-recreate. Good enough for a single-user local dashboard; if a
// real edit endpoint gets added later this is the only place to change.
export const editIncome = async (id, payload) => {
  await removeIncome(id);
  return createIncome(payload);
};

export const downloadIncomeExcel = async () => {
  const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME, {
    responseType: "blob",
  });
  return response.data;
};

/* -------------------------------- Expense --------------------------------- */
// Backend doc: { _id, userId, icon, category, amount, date, createdAt }
const normalizeExpense = (doc) => ({ ...doc, id: doc._id });

export const fetchExpense = async () => {
  const { data } = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
  return data.map(normalizeExpense);
};

export const createExpense = async ({ icon, category, amount, date }) => {
  const { data } = await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
    icon,
    category,
    amount,
    date,
  });
  return normalizeExpense(data);
};

export const removeExpense = async (id) => {
  const { data } = await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
  return data;
};

export const editExpense = async (id, payload) => {
  await removeExpense(id);
  return createExpense(payload);
};

export const downloadExpenseExcel = async () => {
  const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
    responseType: "blob",
  });
  return response.data;
};
