import Notification from "../models/notification.model.js"
export const getUserNotifications =async(req,res)=>{
    try{
        const notifications=await Notification.find({recipient: req.user._id}).sort({createdAt: -1}).populate("relatedUser","username profilePic").populate("relatedScrap","itemName image")
        res.status(200).json(notifications)
    }catch(err){
        console.error("Error in getUserNotifications controller:",err)
        res.status(500).json({message:"Server error"})
    }
}

export const markNotificationAsRead =async(req,res)=>{
    const notificationId=req.params.id
    try{
        const notification=await Notification.findByIdAndUpdate({
            _id:notificationId,
            recipient:req.user._id},
            {read:true},
        {new:true})
        if(!notification){
            return res.status(404).json({message:"Notification not found"})
        }
        await notification.save()
        res.status(200).json(notification)
    }catch(err){
        console.error("Error in markNotificationAsRead controller:",err)
        res.status(500).json({message:"Server error"})
    }
}

export const deleteNotification =async(req,res)=>{
    const notificationId=req.params.id
    try{
        const notification=await Notification.findByIdAndDelete({
            _id:notificationId,
            recipient:req.user._id
        })
        if(!notification){
            return res.status(404).json({message:"Notification not found"})
        }
        res.status(200).json(notification)
    }catch(err){
        console.error("Error in deleteNotification controller:",err)
        res.status(500).json({message:"Server error"})
    }
}

export const deleteAllNotifications =async(req,res)=>{
    try{
        const notifications=await Notification.deleteMany({recipient:req.user._id})
        res.status(200).json(notifications)
    }catch(err){
        console.error("Error in deleteAllNotifications controller:",err)
        res.status(500).json({message:"Server error"})
    }
}