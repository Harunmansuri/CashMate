import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { formatCurrency } from "../../utils/helper";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-100 px-3 py-2 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      <p className="font-semibold" style={{ color: payload[0].color }}>
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
};

// Alternating light/dark purple bars, matching the reference dashboard's
// "Last 30 Days Expenses" chart.
const BarTrendChart = ({ data = [], color = "#7c3aed" }) => {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-[260px] text-sm text-slate-400">
        No data yet
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
          minTickGap={20}
        />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={44} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f5f3ff" }} />
        {/* minPointSize keeps very small (but non-zero) amounts visible as a
            thin sliver instead of disappearing entirely next to a much
            bigger bar in the same chart. */}
        <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={36} minPointSize={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={color} fillOpacity={i % 2 === 0 ? 1 : 0.45} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarTrendChart;
