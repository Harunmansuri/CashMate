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
            index: true, // dashboard filters/sorts by date range constantly
        },
    },
    {
        timestamps: true,
    }
);

const Expense = mongoose.model("Expense", ExpenseSchema);
export default Expense;
