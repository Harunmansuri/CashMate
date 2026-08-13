import React from "react";
import { formatCurrency, formatDate } from "../../utils/helper";

// Compact, read-only version of TransactionList used inside dashboard
// preview cards (Recent Transactions / Expenses / Income) — no edit/delete,
// just icon + label/date + signed amount, matching the reference layout.
const MiniTransactionList = ({ items, sign, labelKey }) => {
  if (!items.length) {
    return <p className="text-sm text-slate-400 py-8 text-center">Nothing here yet.</p>;
  }

  const isPositive = sign === "+";

  return (
    <ul className="divide-y divide-slate-100">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-3 py-3">
          <div className="w-10 h-10 shrink-0 rounded-full bg-slate-50 flex items-center justify-center text-lg">
            {item.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800 truncate">{item[labelKey]}</p>
            <p className="text-xs text-slate-400">{formatDate(item.date)}</p>
          </div>
          <p className={`text-sm font-bold whitespace-nowrap ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
            {sign} {formatCurrency(item.amount)}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default MiniTransactionList;
