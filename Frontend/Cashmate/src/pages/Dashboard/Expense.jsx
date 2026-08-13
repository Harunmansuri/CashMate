import React, { useEffect, useMemo, useState } from "react";
import { LuPlus, LuDownload } from "react-icons/lu";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import TrendLineChart from "../../components/Charts/TrendLineChart";
import TransactionList from "../../components/Transactions/TransactionList";
import TransactionForm from "../../components/Transactions/TransactionForm";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import useUserAuth from "../../hooks/useUserAuth";
import { fetchExpense, createExpense, editExpense, removeExpense, downloadExpenseExcel } from "../../utils/api";
import { buildDailySeries, saveBlobAsFile, sumAmounts, formatDate } from "../../utils/helper";

const Expense = () => {
  useUserAuth();
  const [allExpense, setAllExpense] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const loadExpense = () => {
    setLoading(true);
    return fetchExpense()
      .then(setAllExpense)
      .catch((err) => toast.error(err.response?.data?.message || "Could not load expenses"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadExpense();
  }, []);

  const chartData = useMemo(() => buildDailySeries(allExpense, 30), [allExpense]);
  const total = sumAmounts(allExpense);

  const handleAdd = async (data) => {
    setSaving(true);
    try {
      await createExpense({ icon: data.icon, category: data.category, amount: data.amount, date: data.date });
      toast.success("Expense added");
      setAddOpen(false);
      await loadExpense();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add expense");
    } finally {
      setSaving(false);
    }
  };

  const handleEditSave = async (data) => {
    setSaving(true);
    try {
      await editExpense(editItem.id, {
        icon: data.icon,
        category: data.category,
        amount: data.amount,
        date: data.date,
      });
      toast.success("Expense updated");
      setEditItem(null);
      await loadExpense();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update expense");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await removeExpense(deleteItem.id);
      toast.success("Expense deleted");
      setDeleteItem(null);
      await loadExpense();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete expense");
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await downloadExpenseExcel();
      saveBlobAsFile(blob, "expense.xlsx");
      toast.success("Expense exported");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not export expense");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <DashboardLayout title="Expense">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Expense Overview</h3>
            <p className="text-xs text-slate-400">Track your spending trends and gain insights into where your money goes.</p>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 transition shrink-0"
          >
            <LuPlus size={16} /> Add Expense
          </button>
        </div>
        <TrendLineChart data={chartData} color="#7c3aed" name="Expense" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-800">
            All Expenses <span className="text-slate-400 font-normal">· {formatCurrencyLabel(total)}</span>
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
            items={allExpense}
            type="expense"
            labelKey="category"
            onEdit={setEditItem}
            onDelete={setDeleteItem}
          />
        )}
      </div>

      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add Expense">
        <TransactionForm
          type="expense"
          onSubmit={handleAdd}
          submitLabel={saving ? "Saving..." : "Add Expense"}
        />
      </Modal>

      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Edit Expense">
        {editItem && (
          <TransactionForm
            type="expense"
            initial={editItem}
            onSubmit={handleEditSave}
            submitLabel={saving ? "Saving..." : "Save Changes"}
          />
        )}
      </Modal>

      <Modal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} title="Delete Expense" width="max-w-sm">
        {deleteItem && (
          <DeleteAlert
            content={`Delete "${deleteItem.category}" from ${formatDate(deleteItem.date)}? This can't be undone.`}
            onDelete={handleDelete}
            onCancel={() => setDeleteItem(null)}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
};

const formatCurrencyLabel = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export default Expense;
