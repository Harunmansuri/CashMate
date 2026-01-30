import React from "react";
import { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
    } else if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
    } else {
      setError("");
      // Mock login process
    }
  };
  return (
    <AuthLayout>
      <div className="lg:w-[80%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-Blue">
          {" "}
          Welcome Back to CashMate
        </h3>
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
          ></Input>
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            placeholder="Password"
            label="Password"
            type="password"
          ></Input>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 transition"
          >
            Login
          </button>
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
