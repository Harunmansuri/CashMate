import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuWallet, LuArrowUpToLine, LuArrowDownToLine, LuArrowRight } from "react-icons/lu";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import InfoCard from "../../components/Cards/InfoCard";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import BarTrendChart from "../../components/Charts/BarTrendChart";
import MiniTransactionList from "../../components/Transactions/MiniTransactionList";
import useUserAuth from "../../hooks/useUserAuth";
import { fetchIncome, fetchExpense } from "../../utils/api";
import { buildDailySeries, sumAmounts } from "../../utils/helper";

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchIncome(), fetchExpense()])
      .then(([incomeData, expenseData]) => {
        if (cancelled) return;
        setIncome(incomeData);
        setExpense(expenseData);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Could not load dashboard data");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const totalIncome = sumAmounts(income);
  const totalExpense = sumAmounts(expense);
  const totalBalance = totalIncome - totalExpense;

  // Reference dashboard: Financial Overview donut = Balance / Expenses / Income
  const financialOverview = [
    { name: "Total Balance", value: Math.max(totalBalance, 0) },
    { name: "Total Expenses", value: totalExpense },
    { name: "Total Income", value: totalIncome },
  ];

  const last30ExpenseSeries = useMemo(() => buildDailySeries(expense, 30), [expense]);
  const last60IncomeSeries = useMemo(() => buildDailySeries(income, 60), [income]);
  const last60IncomeTotal = useMemo(
    () => last60IncomeSeries.reduce((s, p) => s + p.amount, 0),
    [last60IncomeSeries]
  );

  const recentAll = [
    ...income.slice(0, 3).map((i) => ({ ...i, type: "income", label: i.source })),
    ...expense.slice(0, 3).map((e) => ({ ...e, type: "expense", label: e.category })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map((t) => ({ ...t, labelKey: "label" }));

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <p className="text-sm text-slate-400 py-16 text-center">Loading your dashboard...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      {/* Total Balance / Income / Expenses */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <InfoCard icon={<LuWallet />} label="Total Balance" value={totalBalance} variant="purple" delay={0} />
        <InfoCard icon={<LuArrowUpToLine />} label="Total Income" value={totalIncome} variant="orange" delay={0.05} />
        <InfoCard icon={<LuArrowDownToLine />} label="Total Expenses" value={totalExpense} variant="rose" delay={0.1} />
      </div>

      {/* Recent Transactions + Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-slate-800">Recent Transactions</h3>
            <button
              onClick={() => navigate("/income")}
              className="text-xs font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              See All <LuArrowRight size={13} />
            </button>
          </div>
          {recentAll.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">No transactions yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentAll.map((item) => (
                <li key={`${item.type}-${item.id}`} className="flex items-center gap-3 py-3">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-slate-50 flex items-center justify-center text-lg">
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">{item.label}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(item.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <p
                    className={`text-sm font-bold whitespace-nowrap ${
                      item.type === "income" ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {item.type === "income" ? "+" : "-"} ₹{Math.round(item.amount).toLocaleString("en-IN")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Financial Overview</h3>
          <CustomPieChart
            data={financialOverview}
            colors={["#7c3aed", "#f43f5e", "#f97316"]}
            centerLabel={{ title: "Total Balance", value: `₹${Math.round(totalBalance).toLocaleString("en-IN")}` }}
          />
        </div>
      </div>

      {/* Recent Expenses + Last 30 Days Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-slate-800">Expenses</h3>
            <button
              onClick={() => navigate("/expense")}
              className="text-xs font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              See All <LuArrowRight size={13} />
            </button>
          </div>
          <MiniTransactionList items={expense.slice(0, 5)} sign="-" labelKey="category" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Last 30 Days Expenses</h3>
          <BarTrendChart data={last30ExpenseSeries} color="#7c3aed" />
        </div>
      </div>

      {/* Last 60 Days Income + Income */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Last 60 Days Income</h3>
          <CustomPieChart
            data={[{ name: "Total Income", value: last60IncomeTotal || 1 }]}
            colors={["#7c3aed"]}
            centerLabel={{ title: "Total Income", value: `₹${Math.round(last60IncomeTotal).toLocaleString("en-IN")}` }}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-slate-800">Income</h3>
            <button
              onClick={() => navigate("/income")}
              className="text-xs font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              See All <LuArrowRight size={13} />
            </button>
          </div>
          <MiniTransactionList items={income.slice(0, 5)} sign="+" labelKey="source" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
