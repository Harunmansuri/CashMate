import mongoose from "mongoose";

const IncomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    icon: {
      type: String,
      default: "",
    },
    // Income has a SOURCE (Salary, Freelance, Interest, ...) — this must
    // stay `source`, not `category`. addIncome/editIncome in
    // incomeController.js, incomeRoutes.js, and the frontend (api.js,
    // Income.jsx, TransactionForm) all read/write `source`. If this field
    // is renamed to `category` again, every "Add Income" will fail with
    // a Mongoose validation error ("category is required") because
    // nothing in the stack actually sends a `category` field for income.
    source: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Income = mongoose.model("Income", IncomeSchema);
export default Income;
