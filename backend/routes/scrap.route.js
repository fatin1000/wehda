import express from "express"
import { protectRoute} from "../middleware/auth.middleware.js";
import { getAllScraps,createScrap,deleteScrap,createComment,likeScrap,getFollowingScraps,getMyScraps,getScrapById} from "../controllers/scrap.controller.js";

const router=express.Router();

router.get("/",getAllScraps)
router.post("/create",protectRoute,createScrap)
router.put("/delete/:id",protectRoute,deleteScrap)

router.get("/myScrapslist",protectRoute,getMyScraps)
router.post("/:id/comment",protectRoute,createComment)
router.post("/:id/like",protectRoute,likeScrap)
router.get("/following", protectRoute, getFollowingScraps);

router.get("/:id",protectRoute,getScrapById)

export default router