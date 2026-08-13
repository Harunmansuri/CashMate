import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { formatCurrency } from "../../utils/helper";

const DEFAULT_COLORS = ["#7c3aed", "#10b981", "#f43f5e", "#f59e0b", "#0ea5e9", "#ec4899", "#84cc16", "#6366f1"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-100 px-3 py-2 text-xs">
      <p className="font-semibold" style={{ color: item.payload.fill }}>
        {item.name}
      </p>
      <p className="text-slate-500">{formatCurrency(item.value)}</p>
    </div>
  );
};

const CustomPieChart = ({ data, colors = DEFAULT_COLORS, height = 280, innerRadius = 70, outerRadius = 100, centerLabel }) => {
  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-[280px] text-sm text-slate-400">
        No data yet
      </div>
    );
  }
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            cornerRadius={6}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} stroke="white" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
      {centerLabel && (
        <div
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
          style={{ top: height / 2 - 18 }}
        >
          <p className="text-xs text-slate-400">{centerLabel.title}</p>
          <p className="text-lg font-bold text-slate-800">{centerLabel.value}</p>
        </div>
      )}
    </div>
  );
};

export default CustomPieChart;
