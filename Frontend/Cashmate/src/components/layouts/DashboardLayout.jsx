import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { LuLayoutDashboard, LuWallet, LuReceipt, LuLogOut, LuMenu, LuX } from "react-icons/lu";
import toast from "react-hot-toast";
import { getSessionUser, logout } from "../../utils/storage";
import { getInitials } from "../../utils/helper";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: LuLayoutDashboard },
  { label: "Income", path: "/income", icon: LuWallet },
  { label: "Expense", path: "/expense", icon: LuReceipt },
];

const SidebarContent = ({ user, pathname, onNavigate, onLogout }) => (
  <div className="flex flex-col h-full">
    <div className="px-6 pt-8 pb-6 flex flex-col items-center text-center border-b border-slate-100">
      {user?.profileImageUrl ? (
        <img
          src={user.profileImageUrl}
          alt={user.fullName}
          className="w-20 h-20 rounded-full object-cover ring-4 ring-purple-50"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl font-semibold ring-4 ring-purple-50">
          {getInitials(user?.fullName || "U")}
        </div>
      )}
      <p className="mt-3 text-sm font-semibold text-slate-800 truncate max-w-full">{user?.fullName || "User"}</p>
      <p className="text-xs text-slate-400 truncate max-w-full">{user?.email}</p>
    </div>

    <nav className="flex-1 px-4 pt-4 space-y-1">
      {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
        const active = pathname === path;
        return (
          <button
            key={path}
            onClick={() => onNavigate(path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition relative ${
              active ? "text-purple-700 bg-purple-50" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            {active && (
              <motion.span
                layoutId="active-nav-pill"
                className="absolute inset-0 rounded-xl bg-purple-50"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <Icon size={18} className="relative z-10" />
            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </nav>

    <div className="px-4 py-6">
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 transition"
      >
        <LuLogOut size={18} />
        Logout
      </button>
    </div>
  </div>
);

const DashboardLayout = ({ title, children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = getSessionUser();

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 bg-white border-r border-slate-100">
        <SidebarContent user={user} pathname={pathname} onNavigate={handleNavigate} onLogout={handleLogout} />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial="closed" animate="open" exit="closed">
            <motion.div
              className="absolute inset-0 bg-slate-900/50"
              variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl"
              variants={{ open: { x: 0 }, closed: { x: "-100%" } }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-5 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <LuX size={18} />
              </button>
              <SidebarContent user={user} pathname={pathname} onNavigate={handleNavigate} onLogout={handleLogout} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 lg:px-8 py-4 flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            aria-label="Open menu"
          >
            <LuMenu size={20} />
          </button>
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-6">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
