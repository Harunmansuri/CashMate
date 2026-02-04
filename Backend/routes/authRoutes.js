import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
const router = express.Router();
import { registerUser,loginUser,getUserInfo} from "../controllers/authController.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser",protect, getUserInfo); 
router.post("/upload-image", upload.single("image"),(req,res)=>{
    if(!req.file){
        return res.status(400).send("No file uploaded.");
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });

});
export default router;