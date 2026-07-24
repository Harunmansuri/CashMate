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
export const downloadIncomesExcel = async (req, res) => {
  const userId = req.user._id;
  try {
    const income = (await Income.find({ userId })).sort({ date: -1 });
    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Income");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });
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
  }

  catch {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to download Excel file",
    });
  }
};

