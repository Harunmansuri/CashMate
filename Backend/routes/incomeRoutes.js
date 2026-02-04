import express from "express";
import { addIncome } from "../controllers/incomeController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/add", protect, addIncome);
//router.get('/get', protect, getAllIncomes);
//router.delete('/:id', protect, deleteIncome);
//router.get('/downloadexcel', protect, downloadIncomesExcel);

export default router;
