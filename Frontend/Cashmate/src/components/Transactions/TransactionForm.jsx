import React, { useState } from "react";
import EmojiPickerPopup from "../EmojiPickerPopup";
import { todayISO } from "../../utils/helper";

// type: "income" | "expense". `initial` pre-fills the form when editing.
const TransactionForm = ({ type, initial, onSubmit, submitLabel }) => {
  const isIncome = type === "income";
  const labelField = isIncome ? "source" : "category";

  const [form, setForm] = useState({
    [labelField]: initial?.[labelField] || "",
    amount: initial?.amount ?? "",
    date: initial?.date || todayISO(),
    icon: initial?.icon || (isIncome ? "💰" : "🧾"),
    notes: initial?.notes || "",
  });
  const [error, setError] = useState("");

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form[labelField].trim()) {
      setError(`Please enter a ${isIncome ? "source" : "category"}.`);
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }
    if (!form.date) {
      setError("Please pick a date.");
      return;
    }
    setError("");
    onSubmit({ ...form, amount: Number(form.amount) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <EmojiPickerPopup icon={form.icon} onSelect={(emoji) => setForm((f) => ({ ...f, icon: emoji }))} />

      <div className="mb-5">
        <label className="block text-slate-700 text-sm font-semibold mb-2">
          {isIncome ? "Income Source" : "Category"}
        </label>
        <input
          value={form[labelField]}
          onChange={update(labelField)}
          placeholder={isIncome ? "e.g. Freelance Project" : "e.g. Groceries"}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-slate-700 text-sm font-semibold mb-2">Amount</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={update("amount")}
            placeholder="0.00"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>
        <div>
          <label className="block text-slate-700 text-sm font-semibold mb-2">Date</label>
          <input
            type="date"
            value={form.date}
            max={todayISO()}
            onChange={update("date")}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-slate-700 text-sm font-semibold mb-2">Notes (optional)</label>
        <textarea
          value={form.notes}
          onChange={update("notes")}
          placeholder="Add any details..."
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
        />
      </div>

      {error && <p className="text-rose-500 text-sm mb-4">{error}</p>}

      <button
        type="submit"
        className={`w-full py-2.5 rounded-lg text-white font-medium transition ${
          isIncome ? "bg-emerald-600 hover:bg-emerald-700" : "bg-purple-600 hover:bg-purple-700"
        }`}
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default TransactionForm;
