import React, { useEffect, useMemo, useState } from "react";
import { LuPlus, LuDownload } from "react-icons/lu";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import BarTrendChart from "../../components/Charts/BarTrendChart";
import TransactionList from "../../components/Transactions/TransactionList";
import TransactionForm from "../../components/Transactions/TransactionForm";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import useUserAuth from "../../hooks/useUserAuth";
import { fetchIncome, createIncome, editIncome, removeIncome, downloadIncomeExcel } from "../../utils/api";
import { buildDailySeries, saveBlobAsFile, sumAmounts, formatDate } from "../../utils/helper";

const Income = () => {
  useUserAuth();
  const [allIncome, setAllIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const loadIncome = () => {
    setLoading(true);
    return fetchIncome()
      .then(setAllIncome)
      .catch((err) => toast.error(err.response?.data?.message || "Could not load income"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadIncome();
  }, []);

  const chartData = useMemo(() => buildDailySeries(allIncome, 30), [allIncome]);
  const total = sumAmounts(allIncome);

  const handleAdd = async (data) => {
    setSaving(true);
    try {
      await createIncome({ icon: data.icon, source: data.source, amount: data.amount, date: data.date });
      toast.success("Income added");
      setAddOpen(false);
      await loadIncome();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add income");
    } finally {
      setSaving(false);
    }
  };

  const handleEditSave = async (data) => {
    setSaving(true);
    try {
      await editIncome(editItem.id, {
        icon: data.icon,
        source: data.source,
        amount: data.amount,
        date: data.date,
      });
      toast.success("Income updated");
      setEditItem(null);
      await loadIncome();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update income");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await removeIncome(deleteItem.id);
      toast.success("Income deleted");
      setDeleteItem(null);
      await loadIncome();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete income");
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await downloadIncomeExcel();
      saveBlobAsFile(blob, "income.xlsx");
      toast.success("Income exported");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not export income");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <DashboardLayout title="Income">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Income Overview</h3>
            <p className="text-xs text-slate-400">Track your earnings over time and analyze your income trends.</p>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 transition shrink-0"
          >
            <LuPlus size={16} /> Add Income
          </button>
        </div>
        <BarTrendChart data={chartData} color="#7c3aed" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-800">
            Income Sources <span className="text-slate-400 font-normal">· {formatCurrencyLabel(total)}</span>
          </h3>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-purple-600 transition disabled:opacity-60"
          >
            <LuDownload size={14} /> {downloading ? "Exporting..." : "Download"}
          </button>
        </div>
        {loading ? (
          <p className="text-sm text-slate-400 py-10 text-center">Loading...</p>
        ) : (
          <TransactionList
            items={allIncome}
            type="income"
            labelKey="source"
            onEdit={setEditItem}
            onDelete={setDeleteItem}
          />
        )}
      </div>

      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add Income">
        <TransactionForm
          type="income"
          onSubmit={handleAdd}
          submitLabel={saving ? "Saving..." : "Add Income"}
        />
      </Modal>

      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Edit Income">
        {editItem && (
          <TransactionForm
            type="income"
            initial={editItem}
            onSubmit={handleEditSave}
            submitLabel={saving ? "Saving..." : "Save Changes"}
          />
        )}
      </Modal>

      <Modal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} title="Delete Income" width="max-w-sm">
        {deleteItem && (
          <DeleteAlert
            content={`Delete "${deleteItem.source}" from ${formatDate(deleteItem.date)}? This can't be undone.`}
            onDelete={handleDelete}
            onCancel={() => setDeleteItem(null)}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
};

const formatCurrencyLabel = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export default Income;
