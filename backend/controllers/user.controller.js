import cloudinary from "../lib/cloudinary.js"
import User from "../models/user.model.js"
import Notification from "../models/notification.model.js"
import sharp from "sharp"
import bcrypt from "bcryptjs"
export const getSuggestedConnections =async(req,res)=>{
    try{
        const currentUser =await User.findById(req.user._id).select("following")

        const suggestedUser=await User.find({
            _id:{
                $ne:req.user._id , $nin: currentUser.following
            }
        , isDeleted: false , active:true}).select("username profilePic headline").limit(3)
        res.json(suggestedUser)
    }catch(err){
        console.error("Error in getSuggestedConnections Controller:",err)
        res.status(500).json({message:"Server error"})
    }
}

export const getLikedScraps = async (req, res) => {
	try {
		const myLikedScraps =await User.findById(req.user._id).select("likedScraps")
        .populate({
            path: "likedScraps",
            populate: {
                path: "author",
                select: "username profilePic"
            }
        });

        if (!myLikedScraps) {
            return [];
        }
		res.status(200).json(myLikedScraps);
	} catch (error) {
		console.log("Error in getLikedScraps controller:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getPublicProfile =async(req,res)=>{
    try{
        const user=await User.findById(req.params.id).select("-password")

        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        res.json(user)
    }catch(err){
        console.error("Error in getPublicProfile Controller:",err)
        res.status(500).json({message:"Server error"})
    }
}
export const updateProfile = async (req, res) => {
    try {
        const allowedFields = [
            "username",
            "headline",
            "location",
            "profilePic",
            "services",
            "bannerPic",
            "fields",
            "company",
            "phone",
            "email",
            "labor",
            "laborPayment"
        ];

        const updatedData = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updatedData[field] = req.body[field];
            }
        }

        // حذف الصورة القديمة ومعالجة الصورة الجديدة للـ profilePic
        if (req.body.profilePic) {
            const user = await User.findById(req.user._id);
        
            // حذف الصورة القديمة
            if (user.profilePic) {
                //await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0]);
                const publicId = user.profilePic.split('/').slice(-1)[0].split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }
        
            // رفع الصورة الجديدة
            const base64Data = req.body.profilePic.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, "base64");
            const resizedImage = await sharp(buffer)
                .resize({ width: 500, height: 500 })
                .toBuffer();
        
            await new Promise((resolve, reject) => {
                const result = cloudinary.uploader.upload_stream(
                    { resource_type: "image" },
                    (error, response) => {
                        if (error) {
                            console.error("Cloudinary error:", error);
                            return reject(error);
                        }
                        console.log("Uploaded new profilePic:", response.secure_url);
                        updatedData.profilePic = response.secure_url;
                        resolve();
                    }
                );
                result.end(resizedImage);
            });
        }
        

        // حذف الصورة القديمة ومعالجة الصورة الجديدة للـ bannerPic
        if (req.body.bannerPic) {
            const user = await User.findById(req.user._id);

            if (user.bannerPic) {
                const publicId = user.bannerPic.split('/').slice(-1)[0].split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }

            const base64Data = req.body.profilePic.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, "base64");
            const resizedImage = await sharp(buffer)
                .resize({ width: 1200 }) // تحديد العرض إلى 1200 بكسل والطول سيُضبط تلقائيًا
                .toBuffer();

            const result = await cloudinary.uploader.upload_stream(
                { resource_type: 'image' },
                (error, response) => {
                    if (error) {
                        console.error("Cloudinary error:", error);
                        throw error;
                    }
                    updatedData.bannerPic = response.secure_url;
                }
            );

            result.end(resizedImage);
        }

        const user = await User.findByIdAndUpdate(req.user._id, { $set: updatedData }, { new: true }).select("-password");

        res.json(user);
    } catch (err) {
        console.error("Error in updateProfile Controller:", err);
        res.status(500).json({ message: "Server error" });
    }
};




export const followUnfollowUser = async (req, res) => {
	try {
		const { id } = req.params;
		const followedUser = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (id === req.user._id.toString()) {
			return res.status(400).json({ error: "You can't follow/unfollow yourself" });
		}

		if (!followedUser || !currentUser) return res.status(400).json({ error: "User not found" });

		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			// Unfollow the user
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

			res.status(200).json({ message: "User unfollowed successfully" });
		} else {
			// Follow the user
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			// Send notification to the user
			const newNotification = new Notification({
				type: "follow",
				relatedUser: req.user._id,
				recipient: followedUser._id,
			});

			await newNotification.save();

			res.status(200).json({ message: "User followed successfully" });
		}
	} catch (error) {
		console.log("Error in followUnfollowUser: ", error.message);
		res.status(500).json({ error: error.message });
	}
};



export const getServices = async (req, res) => {
    try {
        const { service, city } = req.params;
        const field = { value : service , label : service };
        const location = city.toString();
        const users = await User.find({ fields: field, location}).select("username headline services phone email company fields labor profilePic");
        //const users = await User.find({fields: service}, {location : city}).select("name username headline services phone email company fields");

        if (!users) return res.status(404).json({ error: "There are no users with this service in this city" });

        res.status(200).json(users);
    } catch (error) {
        console.log("Error in getServices controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getWorkers = async (req, res) => {
    try {
        const { city } = req.params;
        const location = city.toString();
        const users = await User.find({ location , services: true }).select("username headline services phone email company fields labor profilePic");

        if (!users) return res.status(404).json({ error: "There are no users in this city" });

        res.status(200).json(users);
    }catch (error) {
        console.log("Error in getWorkers controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getNetwork = async (req, res) => {
    try {
        const network =await User.findById(req.user._id).select("following").populate("following");

        if (!network) return [];
        
        res.status(200).json(network);
    }catch (error) {
        console.log("Error in getNetwork controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ error: "User not found" });

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: "Please provide both current password and new password" });
        }

		if (oldPassword && newPassword) {
			const isMatch = await bcrypt.compare(oldPassword, user.password);
			if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });
			if (newPassword.length < 6) {
				return res.status(400).json({ error: "Password must be at least 6 characters long" });
			}

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(newPassword, salt);
		}

        await user.save();


        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.log("Error in updatePassword controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id , { isDeleted: true , isOnline: false });

        if (!user) return res.status(404).json({ error: "User not found" });

        //await Post.deleteMany({ user: req.user._id });
        //await Comment.deleteMany({ user: req.user._id });

        await user.save();
        res.clearCookie("jwt-wehda");
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.log("Error in deleteAccount controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};