import Expense from "../models/Expense.js";

// @route   POST /api/expense/add
// @access  Private
export const addExpense = async (req, res) => {
    try {
        const { icon, category, amount, date } = req.body;

        // validation
        if (!category || !amount || !date) {
            return res
                .status(400)
                .json({ message: "Category, Amount and Date are required" });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: "Amount must be greater than 0" });
        }

        const newExpense = await Expense.create({
            userId: req.user._id,
            icon,
            category,
            amount,
            date: new Date(date),
        });

        res.status(201).json(newExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @route   GET /api/expense/get
// @access  Private
export const getAllExpense = async (req, res) => {
    try {
        const userId = req.user._id;

        // NOTE: never name a local variable the same as the imported model
        // ("const Expense = await Expense.find(...)") — that shadows the
        // import inside its own initializer and throws a ReferenceError
        // ("Cannot access 'Expense' before initialization").
        const expenses = await Expense.find({ userId }).sort({ date: -1 });

        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   DELETE /api/expense/:id
// @access  Private
export const deleteExpense = async (req, res) => {
    try {
        // scope the delete to the logged-in user — findByIdAndDelete alone
        // lets any authenticated user delete *anyone's* expense by guessing
        // an ID. Always match userId too.
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   GET /api/expense/downloadexcel
// @access  Private
export const downloadExpenseExcel = async (req, res) => {
    try {
        const userId = req.user._id;

        // lazy-load xlsx — keeps it out of the main bundle/cold-start path
        // for requests that never hit this route
        const XLSX = (await import("xlsx")).default;

        const expenses = await Expense.find({ userId }).sort({ date: -1 });

        const data = expenses.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date.toISOString().split("T")[0],
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
        res.send(excelBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to download Excel file",
        });
    }
};
