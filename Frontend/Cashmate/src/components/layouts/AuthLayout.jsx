import React from "react";
import { motion } from "framer-motion";
import { FaWallet } from "react-icons/fa";
import Card from "../../assets/images/Card.png";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">

      {/* Left Section */}
      <div className="w-full md:w-[50vw] px-6 md:px-12 pt-8 pb-12">
        <h2 className="text-xl font-semibold text-black mb-6">
          Cashmate
        </h2>
        {children}
      </div>

      {/* Right Section */}
      <div className="hidden md:flex w-[50vw] h-screen bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center relative overflow-hidden p-8">

        {/* Decorative Purple Boxes */}
        <motion.div
          className="w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-10 -left-10"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="w-48 h-48 rounded-[40px] bg-purple-400 absolute top-40 left-20"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="w-48 h-48 rounded-[40px] bg-purple-300 absolute bottom-20 right-20"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 🔥 BIG Expense Info Card (On Top) */}
        <motion.div
          className="
            absolute top-20 right-12 z-50
            flex items-center gap-4
            bg-white/90 backdrop-blur-lg
            px-8 py-6
            rounded-2xl
            shadow-2xl
            w-[320px]
          "
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-purple-100">
            <FaWallet className="text-purple-600 text-3xl" />
          </div>

          <div>
            <p className="text-lg font-bold text-gray-900">
              Track your expenses
            </p>
            <p className="text-sm text-gray-600">
              Manage income & spending easily
            </p>
          </div>
        </motion.div>

        {/* Expense Card Image */}
        <motion.img
          src={Card}
          alt="Expense Card"
          className="absolute bottom-8 right-8 w-[380px] lg:w-[550px] drop-shadow-2xl z-40"
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

      </div>
    </div>
  );
};

export default AuthLayout;
