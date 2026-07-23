import multer from "multer";
import path from "path";

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// File filter (optional but recommended)
const fileFilter = (req, file, cb) => {
  const allowedtypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedtypes.includes(file.mimitype)) {
    cb(null, true);
  }
  else {
    cb(new Error('Only .jpeg .jpg and .png fromats are allowed'), false);
  }
};

// Export upload
const upload = multer({
  storage,
  fileFilter,
});

export default upload;
