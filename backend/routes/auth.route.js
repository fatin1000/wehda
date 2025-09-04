import express from "express"
import {singup,login,logout,getCurrentUser} from "../controllers/auth.controller.js" 
import { protectRoute } from "../middleware/auth.middleware.js"
import multer from "multer";

export const uploadRecord = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const router = express.Router()

router.post("/signup",uploadRecord.single("record"),singup)
router.post("/login",login)
router.post("/logout",protectRoute,logout)

router.get("/me",protectRoute,getCurrentUser)

export default router;