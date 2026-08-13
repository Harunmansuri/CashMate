import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true, // every dashboard/list query filters by userId — index it
        },
        icon: {
            type: String,
            default: "",
        },
        // Was `source` before (copy-pasted from the Income schema) — an
        // expense doesn't have a "source", it has a category (Groceries,
        // Rent, Travel, etc). Renamed to match what the frontend actually
        // sends and displays.
        category: {
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
            index: true, // dashboard filters/sorts by date range constantly
        },
    },
    {
        timestamps: true,
    }
);

const Expense = mongoose.model("Expense", ExpenseSchema);
export default Expense;
