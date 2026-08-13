import multer from "multer";
import path from "path";
import fs from "fs";

// Make sure the uploads folder exists — multer's diskStorage throws if the
// destination directory is missing (fresh clone won't have it since it's
// usually gitignored).
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  // BUG FIX: this was `file.mimitype` (typo) which is always undefined,
  // so `allowedTypes.includes(undefined)` was always false — every single
  // upload was being silently rejected regardless of file type. That's
  // the "upload not working" issue.
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg and .png formats are allowed"), false);
  }
};

// Export upload
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB cap, avoids huge accidental uploads
});

export default upload;
