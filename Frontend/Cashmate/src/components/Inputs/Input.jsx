import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Input = ({
  value,
  onChange,
  placeholder,
  label,
  type = "text",
  name,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="mb-5 relative">
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="block text-gray-700 text-sm font-semibold mb-2"
        >
          {label}
        </label>
      )}

      {/* Input */}
      <input
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e)}
        placeholder={placeholder}
        type={isPassword && showPassword ? "text" : type}
        className="
          w-full rounded-lg border border-gray-300
          px-4 py-2.5 pr-12
          text-gray-800
          focus:outline-none focus:ring-2 focus:ring-purple-500
          transition
        " 
      />

      {/* Eye Icon */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-[42px] right-4 text-gray-500 hover:text-purple-600 transition"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <FaEyeSlash size={18} />
          ) : (
            <FaEye size={18} />
          )}
        </button>
      )}
    </div>
  );
};

export default Input;
