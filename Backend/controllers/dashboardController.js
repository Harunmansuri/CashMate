import Income from "../models/Income.js";
import Expense from "../models/Expense.js";

/**
 * Sums the `amount` field across an array of transaction documents.
 * Kept as a plain reduce instead of a second DB round-trip — we already
 * have the documents in memory from the range queries below, so there's
 * no reason to ask MongoDB to aggregate the same data again.
 */
const sumAmount = (transactions) =>
    transactions.reduce((total, txn) => total + txn.amount, 0);

// @route   GET /api/dashboard
// @access  Private
export const getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        // Every read below is independent of the others, so we fire them all
        // in parallel with Promise.all instead of awaiting one at a time.
        // On a dashboard endpoint (hit on every page load) this is the single
        // biggest performance win you can make.
        const [
            totalIncomeAgg,
            totalExpenseAgg,
            last30DaysIncome,
            last30DaysExpense,
            last60DaysIncome,
            last60DaysExpense,
            last5Income,
            last5Expense,
        ] = await Promise.all([
            Income.aggregate([
                { $match: { userId } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]),
            Expense.aggregate([
                { $match: { userId } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]),
            Income.find({ userId, date: { $gte: thirtyDaysAgo } }).sort({ date: -1 }),
            Expense.find({ userId, date: { $gte: thirtyDaysAgo } }).sort({ date: -1 }),
            Income.find({ userId, date: { $gte: sixtyDaysAgo } }).sort({ date: -1 }),
            Expense.find({ userId, date: { $gte: sixtyDaysAgo } }).sort({ date: -1 }),
            Income.find({ userId }).sort({ date: -1 }).limit(5),
            Expense.find({ userId }).sort({ date: -1 }).limit(5),
        ]);

        const totalIncome = totalIncomeAgg[0]?.total || 0;
        const totalExpense = totalExpenseAgg[0]?.total || 0;

        res.status(200).json({
            totalIncome,
            totalExpense,
            totalBalance: totalIncome - totalExpense,

            last30Days: {
                income: {
                    total: sumAmount(last30DaysIncome),
                    transactions: last30DaysIncome,
                },
                expense: {
                    total: sumAmount(last30DaysExpense),
                    transactions: last30DaysExpense,
                },
            },

            last60Days: {
                income: {
                    total: sumAmount(last60DaysIncome),
                    transactions: last60DaysIncome,
                },
                expense: {
                    total: sumAmount(last60DaysExpense),
                    transactions: last60DaysExpense,
                },
            },

            recentTransactions: {
                income: last5Income,
                expense: last5Expense,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
};
