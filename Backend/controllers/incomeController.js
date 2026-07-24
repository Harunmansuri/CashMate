import Income from "../models/Income.js";
import User from "../models/User.js";
import XLSX from "xlsx";
export const addIncome = async (req, res) => {
  const user = await User.findById(req.user._id);
  try {
    const { icon, source, amount, date } = req.body;

    //validation
    if (!source || !amount || !date) {
      return res
        .status(400)
        .json({ message: "Source, Amount and Date are required" });
    }
    const newIncome = new Income({
      userId: user._id,
      icon,
      source,
      amount,
      date: new Date(date),
    });
    const savedIncome = await newIncome.save();
    res.status(201).json(savedIncome);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const getAllIncome = async (req, res) => {
  const userId = req.user._id;

  try {
    const income = await Income.find({ userId: userId }).sort({ date: -1 });
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
import XLSX from "xlsx";
import Income from "../models/Income.js";

export const downloadIncomesExcel = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch incomes of logged-in user
    const incomes = await Income.find({ userId }).sort({ date: -1 });

    // Convert data into Excel format
    const data = incomes.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Income");

    // Convert workbook into buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    // Set response headers
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="income.xlsx"'
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Send file
    res.send(excelBuffer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to download Excel file",
    });
  }
};
/*
Client Clicks Download
        │
        ▼
GET /download-income
        │
        ▼
JWT Middleware
        │
        ▼
req.user._id
        │
        ▼
MongoDB
Income.find({ userId })
        │
        ▼
Array of Incomes
        │
        ▼
map()
        │
        ▼
JSON Data
        │
        ▼
json_to_sheet()
        │
        ▼
Worksheet
        │
        ▼
Workbook
        │
        ▼
write()
        │
        ▼
Excel Buffer
        │
        ▼
res.send()
        │
        ▼
income.xlsx Download
*/
