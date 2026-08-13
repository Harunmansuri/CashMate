import React from "react";
import { motion } from "framer-motion";

const OPTIONS = [
  { label: "30 Days", value: 30 },
  { label: "60 Days", value: 60 },
  { label: "All Time", value: null },
];

const RangeToggle = ({ value, onChange }) => {
  return (
    <div className="inline-flex bg-slate-100 rounded-lg p-1 relative">
      {OPTIONS.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.label}
            onClick={() => onChange(opt.value)}
            className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition z-10 ${
              active ? "text-purple-700" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {active && (
              <motion.span
                layoutId="range-toggle-pill"
                className="absolute inset-0 bg-white rounded-md shadow-sm -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

export default RangeToggle;
