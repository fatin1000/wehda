import Notification from "../models/notification.model.js";
import ScrapResponse from "../models/scrapResponse.model.js";
import Scrap from "../models/scrap.model.js";

export const sendScrapResponse = async (req, res) => {
	try {
		const { price , quantity, scrapId , recipient , paymentMethod} = req.body;
        const senderId = req.user._id

		const existingResponse = await ScrapResponse.findOne({
			sender: senderId,
            scrap: scrapId,
			recipient: recipient,
			status: "pending",
		});

		if (existingResponse) {
			return res.status(400).json({ message: "A request already exists" });
		}
        const scrap = await Scrap.findById(scrapId)
			.populate("author", "_id username profilePic headline")
        
        const newResponse = new ScrapResponse({
        sender: senderId,
		recipient,
        scrap : scrapId,
        quantity,
        price,
		paymentMethod,
		});

		await newResponse.save();

        const notification = new Notification({
			recipient: recipient,
			type: "offer",
			relatedUser: senderId,
			relatedScrap: scrapId,
		});

		await notification.save();

		res.status(201).json({ message: "Request sent successfully" });
	} catch (error) {
        console.error("Error in sendScrapResponse controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const getUserScrapResponses = async (req, res) => {
    try {
        const userId = req.user._id;
        const userScrapResponsArr = await ScrapResponse.find({sender : userId }).populate("scrap" , "itemName image").populate("recipient", "username profilePic");
        if(userScrapResponsArr){
            res.status(200).json(userScrapResponsArr.reverse());
        }else{
            return null
        }
    }catch(err){
        console.error("Error in getUserScrapResponse controller:", err);
		res.status(500).json({ message: "Server error" });
}};

export const getMyScrapResponses = async (req, res) => {
	const scrapId = req.params.scrapId
	try {
		const scrapRes = await ScrapResponse.find({scrap: scrapId}).populate("sender", "username profilePic");
		res.status(200).json(scrapRes)
	}catch(err){
		console.error("Error in getMyScrapResponse controller:", err);
		res.status(500).json({ message: "Server error" });
	}
   };


export const getScrapResStatus = async (req,res) =>{
    try{
        const userId = req.user._id;
        const scrapId = req.params.scrapId
        const scrap = await ScrapResponse.find({ scrap: scrapId, sender: userId }).sort({ createdAt: -1 });
        res.status(200).json(scrap)
    }catch(err){
        console.error("Error in getScrapResStatus controller:", err);
		res.status(500).json({ message: "Server error" }); 
    }
}

export const acceptScrapResponse = async (req, res) => {
	//requestId = the scrapResponse id
		//scrapId = the scrap id
		const { scrapId,requestId, dealQuantity } = req.params;
		const userId = req.user._id;
	try {
		//the scrap respons
		const request = await ScrapResponse.findById(requestId)
		//the scrap
		const scrap = await Scrap.findById(scrapId);

		if (!request) {
			return res.status(404).json({ message: "Request not found 😣" });
		}
		if (!scrap) {
			return res.status(404).json({ message: "Scrap not found 😪" });
		}
		if (request.status !== "pending") {
			return res.status(400).json({ message: "This request has already been processed" });
		}

		request.status = "accepted";
		await request.save();

		scrap.deal.push(requestId)
		scrap.quantity -= dealQuantity;
		if(scrap.quantity == 0){
			scrap.scrapStatus ="expired"
			const scrapResAutoReject = await ScrapResponse.find({scrap:scrapId , status:"pending"});
			if(scrapResAutoReject) {
				scrapResAutoReject.forEach(async (scrapRes) => {
					scrapRes.status = "auto Rejected";
					await scrapRes.save();
				})
			}
		}

		await scrap.save();

		const notification = new Notification({
			recipient: request.sender._id,
			type: "offer Accepted",
			relatedUser: userId,
			relatedScrap: scrapId,
		});

		await notification.save();

		res.json({ message: "Connection accepted successfully" });
	} catch (error) {
		console.error("Error in acceptConnectionRequest 😛 controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const rejectScrapResponse = async (req, res) => {
	try {
        //request = the scrapResponse it him salve 
		const { requestId } = req.params;
		const userId = req.user._id;

		const request = await ScrapResponse.findById(requestId);

		if (request.recipient.toString() !== userId.toString()) {
			return res.status(403).json({ message: "Not authorized to reject this request" });
		}

		if (request.status !== "pending") {
			return res.status(400).json({ message: "This request has already been processed" });
		}

		request.status = "rejected";
		await request.save();

		res.json({ message: "Connection request rejected" });
	} catch (error) {
		console.error("Error in rejectConnectionRequest controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};