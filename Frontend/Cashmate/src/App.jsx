import React from "react";
import "./index.css";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Auth/Login.jsx";
import Signup from "./pages/Auth/Signup";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="*" element={<Root />} />
        </Routes>
      </Router>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2600,
          style: {
            fontSize: "13px",
            borderRadius: "10px",
          },
          success: { iconTheme: { primary: "#7c3aed", secondary: "#fff" } },
        }}
      />
    </div>
  );
};

export default App;

const Root = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};
