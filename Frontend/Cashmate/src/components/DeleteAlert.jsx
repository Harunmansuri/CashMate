import React from "react";
import { LuTriangleAlert } from "react-icons/lu";

const DeleteAlert = ({ content, onDelete, onCancel }) => {
  return (
    <div>
      <div className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 shrink-0 rounded-full bg-rose-100 flex items-center justify-center">
          <LuTriangleAlert className="text-rose-600" size={20} />
        </div>
        <p className="text-sm text-slate-600 mt-1.5">{content}</p>
      </div>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-100 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;
