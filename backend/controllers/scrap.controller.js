import Scrap from "../models/scrap.model.js"
import cloudinary from "../lib/cloudinary.js"
import User from "../models/user.model.js"
import Notification from "../models/notification.model.js"
import ScrapResponse from "../models/scrapResponse.model.js";

export const getAllScraps = async (req, res) => {
    //isDeleted:false
	try {
		const scraps = await Scrap.find({isDroped:false})
			.sort({ createdAt: -1 })
			.populate({
                path: "author",
                select: "-password",
                match: { isDeleted: false },   
            })
			.populate({
				path: "comments.user",
				select: "-password",
                match: { isDeleted: false },
			});
            const filteredScraps = scraps.filter((scrap) => scrap.author !== null);
        
		if (filteredScraps.length === 0) {
			return res.status(200).json([]);
		}

		res.status(200).json(filteredScraps);
	} catch (error) {
		console.log("Error in getAllScraps controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const createScrap = async(req,res)=>{
    
    try{
        const {itemName,
            quantity, 
            units, 
            discription,
            location,
            category,
            itemStatus ,
            sell,
            minAmount,
            unitPrice,
            image
            } = req.body
            let newScrap;
            if (image) {
                const imgResult = await cloudinary.uploader.upload(image);
                newScrap = new Scrap({
                    author: req.user._id,
                    image: imgResult.secure_url,
                    itemName,
                    quantity,
                    oldQuantity:quantity, 
                    units, 
                    discription,
                    location,
                    category,
                    itemStatus,
                    sell,
                    minAmount,
                    unitPrice,
                });
            } else {
             newScrap= new Scrap({
                author:req.user._id,
                itemName,
                quantity,
                oldQuantity:quantity, 
                units, 
                discription,
                location,
                category,
                itemStatus,
                sell,
                minAmount,
                unitPrice,
                })}

        await newScrap.save();
        res.status(201).json(newScrap)
    }catch(err){
        console.error("Error in createScrap controller:",err)
        res.status(500).json({message:"Server error"})
    }
}

export const deleteScrap = async(req,res)=>{
    try{
        const scrapId = req.params.id
        const userId = req.user._id

        const scrap = await Scrap.findByIdAndUpdate(scrapId,{isDroped:true})    
        if(!scrap){
            return res.status(404).json({message:"Scrap not found"})
        }    
        if(scrap.author.toString() !== userId.toString()){
            return res.status(403).json({message:"Unauthorized"})
        }

        if(scrap.image){       
            const imgId = scrap.image.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(imgId)
        }
        // const scrapRes = ScrapResponse.find({scrap:scrapId})
        // if(scrapRes){
        //     await ScrapResponse.deleteMany({scrap:scrapId})
        // }
        await scrap.save()
        return res.status(200).json({message:"Scrap deleted"})
    }catch(err){
        console.error("Error in deleteScrap controller:",err)
        res.status(500).json({message:"Server error"})
    }
}



export const createComment = async(req,res)=>{
    try{
        const scrapId = req.params.id
        const {content} = req.body
        const scrap = await Scrap.findByIdAndUpdate(scrapId,{
            $push:{comments:{user:req.user._id,content}},
        },{new:true})
        .populate("author","username profilePic headline")
        .populate("comments.user","username profilePic headline")
        if(!scrap){
            return res.status(404).json({message:"Scrap not found"})
        }
        if(scrap.author.toString() !== req.user._id.toString()){
            const newNotification = new Notification({
                recipient:scrap.author,
                type:"comment",
                relatedUser:req.user._id,
                relatedScrap:scrapId
            })
            await newNotification.save()
            //todo:send email notification
        }
        return res.status(200).json(scrap)
    }catch(err){
        console.error("Error in createComment controller:",err)
        res.status(500).json({message:"Server error"})
    }
}   

export const likeScrap = async(req,res)=>{
    try{
        const scrapId = req.params.id
        const scrap = await Scrap.findById(scrapId)
        const userId= req.user._id
        const user = await User.findById(userId)

        if(!scrap){
            return res.status(404).json({message:"Scrap not found"})
        }
        if(scrap.likes.includes(userId)){
            scrap.likes = scrap.likes.filter(id => id.toString() !== userId.toString())
            user.likedScraps = user.likedScraps.filter(id => id.toString() !== scrapId.toString())

        }else{
            scrap.likes.push(userId)
            user.likedScraps.push(scrapId);
            if(scrap.author.toString() !== userId.toString()){
                const newNotification = new Notification({
                    recipient:scrap.author,
                    type:"like scrap",
                    relatedUser:userId,
                    relatedScrap:scrapId
                })
                await newNotification.save()   
            }
        }
        await scrap.save()
        await user.save()
        return res.status(200).json(scrap)
    }catch(err){
        console.error("Error in likeScrap controller:",err)
        res.status(500).json({message:"Server error"})
    }
}

export const getSavedScraps = async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await User.findById(userId).populate('savedScraps');
		if (!user) return res.status(404).json({ error: "User not found" });

		const savedScraps =  user.savedScraps;
        
		res.status(200).json(savedScraps);
	} catch (error) {
		console.log("Error in getSeavedScraps controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getFollowingScraps = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const following = user.following;

		const feedScraps = await Scrap.find({ user: { $in: following } })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(feedScraps);
	} catch (error) {
		console.log("Error in getFollowingScraps controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMyScraps = async (req, res) => {
try {
    const userId = req.user._id;
    const scraps = await Scrap.find({ author: userId})
        .sort({ createdAt: -1 })
        .populate({
            path: "author",
            select: "-password",
        }).populate({
            path: "deal"
        })
    if (!scraps) {
        return res.status(200).json([]);
    }

    res.status(200).json(scraps);
} catch (error) {
    console.log("Error in getAllPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
}
};


export const getScrapById = async(req,res)=>{
    try{
        const scrapId = req.params.id
        const scrap = await Scrap.findById(scrapId)
        .populate("author", "username profilePic headline")
			.populate("comments.user", "username profilePic headline");

        if (!scrap) {
            return res.status(404).json({ message: "Scrap not found" });
        }

		res.status(200).json(scrap);
	} catch (error) {
		console.error("Error in getScrapById controller:", error);
		res.status(500).json({ message: "Server error" });
	}
}  