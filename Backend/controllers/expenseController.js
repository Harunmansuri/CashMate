import Expense from "../models/Expense.js";
import User from "../models/User.js";
import XLSX from "xlsx";

export const addExpense = async (req, res) => {
    const user = await User.findById(req.user._id);
    try {
        const { icon, source, amount, date } = req.body;

        //validation
        if (!source || !amount || !date) {
            return res
                .status(400)
                .json({ message: "Source, Amount and Date are required" });
        }
        const newExpense = new Expense({
            userId: user._id,
            icon,
            source,
            amount,
            date: new Date(date),
        });
        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const getAllExpense = async (req, res) => {
    const userId = req.user._id;

    try {
        const Expense = await Expense.find({ userId: userId }).sort({ date: -1 });
        res.status(200).json(Expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const deleteExpense = async (req, res) => {
    try {
        const Expense = await Expense.findByIdAndDelete(req.params.id);
        if (!Expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const downloadExpenseExcel = async (req, res) => {
    const userId = req.user._id;
    try {
        const Expense = (await Expense.find({ userId })).sort({ date: -1 });
        const data = Expense.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Expense");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "buffer",
        });
        res.setHeader(
            "Content-Disposition",
            'attachment; filename="expense.xlsx"'
        );

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        // Send file
        res.send(excelBuffer);
    }

    catch {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to download Excel file",
        });
    }
};

