import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "../../utils/helper";

// Animates the displayed amount counting up from 0 whenever `value` changes.
const useCountUp = (value, duration = 700) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const from = 0;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (value - from) * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return display;
};

const VARIANTS = {
  purple: { bg: "bg-purple-100", text: "text-purple-600", ring: "ring-purple-50" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-600", ring: "ring-emerald-50" },
  rose: { bg: "bg-rose-100", text: "text-rose-600", ring: "ring-rose-50" },
  orange: { bg: "bg-orange-100", text: "text-orange-600", ring: "ring-orange-50" },
};

const InfoCard = ({ icon, label, value, variant = "purple", delay = 0 }) => {
  const v = VARIANTS[variant] || VARIANTS.purple;
  const animated = useCountUp(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4"
    >
      <div className={`w-12 h-12 shrink-0 rounded-xl ${v.bg} ${v.text} flex items-center justify-center text-xl ring-4 ${v.ring}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400 truncate">{label}</p>
        <p className="text-xl font-bold text-slate-800 truncate">{formatCurrency(animated)}</p>
      </div>
    </motion.div>
  );
};

export default InfoCard;
