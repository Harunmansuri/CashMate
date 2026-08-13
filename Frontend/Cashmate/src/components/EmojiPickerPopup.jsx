import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { AnimatePresence, motion } from "framer-motion";

const EmojiPickerPopup = ({ icon, onSelect }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative mb-5" ref={ref}>
      <label className="block text-slate-700 text-sm font-semibold mb-2">Icon</label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-slate-300 hover:border-purple-400 transition w-full"
      >
        <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-purple-50 text-lg">
          {icon || "🙂"}
        </span>
        <span className="text-sm text-slate-500">Pick an emoji</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute z-20 mt-2"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            <EmojiPicker
              open={open}
              onEmojiClick={(emojiData) => {
                onSelect(emojiData.emoji);
                setOpen(false);
              }}
              width={300}
              height={360}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmojiPickerPopup;
