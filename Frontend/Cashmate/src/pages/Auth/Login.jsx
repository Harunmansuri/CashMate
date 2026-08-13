import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../../utils/api";
import { saveSession } from "../../utils/storage";
import { validateEmail } from "../../utils/helper";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      const user = saveSession(response);
      toast.success(`Welcome back, ${user.fullName.split(" ")[0]}!`);
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.request ? "Could not reach the server. Is it running?" : "Something went wrong. Please try again.");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[80%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-purple-700">Welcome Back to CashMate</h3>
        <p className="text-md text-gray-600 mb-6 mt-[5px]">
          Please login to your account to continue
        </p>
        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            placeholder="Email Address"
            label="Email Address"
            type="text"
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            placeholder="Password"
            label="Password"
            type="password"
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="mt-4 text-sm text-slate-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-600 font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
