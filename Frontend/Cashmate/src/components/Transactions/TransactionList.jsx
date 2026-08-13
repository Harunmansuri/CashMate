import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { formatCurrency, formatDate } from "../../utils/helper";

// type: "income" | "expense" — controls the label field, color and sign.
// Renders as a 2-column grid of cards (matches "Income Sources" / "All
// Expenses" panels), each with its own icon badge, name/date and amount.
const TransactionList = ({ items, type, labelKey, onEdit, onDelete }) => {
  const isIncome = type === "income";

  if (!items.length) {
    return (
      <div className="text-center py-14">
        <p className="text-4xl mb-2">{isIncome ? "💸" : "🧾"}</p>
        <p className="text-sm font-medium text-slate-500">
          No {isIncome ? "income" : "expense"} entries yet
        </p>
        <p className="text-xs text-slate-400 mt-1">Add your first one to see it here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <AnimatePresence initial={false}>
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.25, delay: i * 0.02 }}
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition group"
          >
            <div
              className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-xl ${
                isIncome ? "bg-emerald-50" : "bg-rose-50"
              }`}
            >
              {item.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800 truncate">{item[labelKey]}</p>
              <p className="text-xs text-slate-400">{formatDate(item.date)}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <p className={`text-sm font-bold whitespace-nowrap ${isIncome ? "text-emerald-600" : "text-rose-600"}`}>
                {isIncome ? "+" : "-"} {formatCurrency(item.amount)}
              </p>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition">
                <button
                  onClick={() => onEdit(item)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition"
                  aria-label="Edit"
                >
                  <LuPencil size={13} />
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  aria-label="Delete"
                >
                  <LuTrash2 size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TransactionList;
