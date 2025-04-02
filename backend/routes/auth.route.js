import express from "express"
import {singup,login,logout,getCurrentUser} from "../controllers/auth.controller.js" 
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/signup",singup)
router.post("/login",login)
router.post("/logout",protectRoute,logout)

router.get("/me",protectRoute,getCurrentUser)

export default router;