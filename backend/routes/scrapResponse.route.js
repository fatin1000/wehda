import express from "express"
import { protectRoute} from "../middleware/auth.middleware.js";
import { sendScrapResponse ,getUserScrapResponses ,getScrapResStatus ,acceptScrapResponse ,rejectScrapResponse, getMyScrapResponses} from "../controllers/scrapResponse.controller.js";

const router=express.Router();

router.post("/request", protectRoute, sendScrapResponse);
router.put("/accept/:scrapId/:requestId/:dealQuantity", protectRoute, acceptScrapResponse);
router.put("/reject/:requestId", protectRoute, rejectScrapResponse);
//get the scrap responses related to the authUser
router.get("/myScrapResponses", protectRoute, getUserScrapResponses); // i was sended
//sendedScrapResponses
router.get("/sendedScrapResponses", protectRoute, getMyScrapResponses); //sended for me
router.get("/status/:scrapId", protectRoute, getScrapResStatus);
//get all responses for a scrap
//router.get("/:scrapId", protectRoute, getScrapResponses);

export default router