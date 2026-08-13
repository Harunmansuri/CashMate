export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

export const addThousandsSeparator = (num) => {
  if (num === null || num === undefined || num === "" || isNaN(num)) return "0";
  const [integer, fraction] = num.toString().split(".");
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fraction ? `${formattedInteger}.${fraction}` : formattedInteger;
};

export const formatCurrency = (num) => `₹${addThousandsSeparator(Math.round(Number(num || 0)))}`;

export const formatDate = (date, options) =>
  new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", ...options });

export const formatShortDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

export const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

export const todayISO = () => new Date().toISOString().slice(0, 10);

const dayKeyOffset = (n) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
};

export const filterByRange = (list, days) => {
  if (!days) return list;
  const cutoff = dayKeyOffset(days - 1);
  return list.filter((item) => new Date(item.date) >= cutoff);
};

export const sumAmounts = (list) => list.reduce((sum, item) => sum + Number(item.amount || 0), 0);

// Builds a { label, date, amount }[] series for the last `days` days, aggregating
// same-day entries together — feeds the line/bar charts directly.
export const buildDailySeries = (list, days) => {
  const buckets = new Map();
  for (let i = days - 1; i >= 0; i--) {
    const d = dayKeyOffset(i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, { date: key, label: formatShortDate(key), amount: 0 });
  }
  list.forEach((item) => {
    if (buckets.has(item.date)) {
      buckets.get(item.date).amount += Number(item.amount || 0);
    }
  });
  return Array.from(buckets.values());
};

// Merges income + expense daily series into one array for combined charts.
export const buildCombinedSeries = (incomeList, expenseList, days) => {
  const income = buildDailySeries(incomeList, days);
  const expense = buildDailySeries(expenseList, days);
  return income.map((point, i) => ({
    label: point.label,
    date: point.date,
    income: point.amount,
    expense: expense[i]?.amount ?? 0,
  }));
};

// Groups a list by its category/source field and sums amounts — feeds pie charts.
export const groupByKey = (list, key) => {
  const totals = new Map();
  list.forEach((item) => {
    const label = item[key] || "Other";
    totals.set(label, (totals.get(label) || 0) + Number(item.amount || 0));
  });
  return Array.from(totals.entries()).map(([name, value]) => ({ name, value }));
};

// Saves a Blob returned by the backend (e.g. the .xlsx buffer from
// GET /api/income/downloadexcel or /api/expense/downloadexcel) as a file.
export const saveBlobAsFile = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
