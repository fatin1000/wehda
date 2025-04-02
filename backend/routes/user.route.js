import express from "express"
import { protectRoute} from "../middleware/auth.middleware.js";
import { getSuggestedConnections,getPublicProfile,updateProfile,followUnfollowUser,getNetwork,getLikedScraps, getServices, getWorkers,updatePassword,deleteAccount} from "../controllers/user.controller.js";

const router=express.Router();

router.get("/suggestions",protectRoute,getSuggestedConnections)
router.get("/likedScraps",protectRoute,getLikedScraps)
router.get("/network",protectRoute,getNetwork)
router.put("/profile",protectRoute,updateProfile )
router.get("/:id",protectRoute,getPublicProfile )
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.get("/services/:service/:city", protectRoute, getServices);
router.get("/workers/:city", protectRoute, getWorkers);
router.put("/updatePassword",protectRoute,updatePassword)
router.put("/deleteAccount",protectRoute,deleteAccount)

export default router