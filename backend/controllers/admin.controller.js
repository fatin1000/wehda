import Admin from "../models/admin.model.js";
import Mail from "../models/mail.model.js"
import Scrap from "../models/scrap.model.js"
import User from "../models/user.model.js"
import ScrapResponse from "../models/scrapResponse.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
//auth functions
export const singup = async (req,res)=>{
    try{
        const { name, email, password , phone} = req.body;
        if(!name || !email || !password || !phone){
            return res.status(400).json({message:"All fields are required"})
        }
        const existingEmail = await Admin.findOne({email})
        if(existingEmail){
            return res.status(400).json({message: "Email already exists"})
        }
        const existingUsername = await Admin.findOne({name})
        if(existingUsername){
            return res.status(400).json({message: "User name already exists"})
        }
        if(password.length < 6){
            return res.status(400).json({message :"Password must be at least 6 charcters"})
        }
        // const salt =await bcrypt.genSalt(10)
        // const hashedPassword= await bcrypt.hash(password,salt)

        const user =new Admin({
             name, email,phone,password
            //password:hashedPassword,
        })

        await user.save();

        const token =jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1d"})

        res.cookie("jwt-wehda-admin",token,{
            httpOnly:true,
            maxAge: 24 * 60 * 1000,
            sameSite:"strict",
            seucure: process.env.NODE_ENV === "production"
        })

        res.status(201).json({message:"User registered successfully"})

        // send verification by phone


    }catch(err){
        console.log("Error in singup",err)
        res.status(500).json({message:"Something went wrong"})
    }
}

export const login =async (req,res)=>{
    try{
        const {name,password} = req.body
        //check user
        const user =await Admin.findOne({name,password})
        
        if(!user){
            return res.status(400).json({message:"invalid credentials"})
        }
        if(!password){
            return res.status(400).json({message:"invalid credentials"})
        }
        //check password
        // const isMatch = await bcrypt.compare(password, user.password)
        // if(!isMatch){
        //     return res.status(400).json({message:"invalid credentials"})
        // }
        //create and send password
        const token = jwt.sign({userId: user._id},process.env.JWT_SECRET,{expiresIn:"1d"})
        await res.cookie("jwt-wehda-admin",token,{
            httpOnly:true,
            maxAge:24 * 60 * 60 * 1000, // 1 أيام
            sameSite:"strict",
            secure:process.env.NODE_ENV === "production",
        })
        await Admin.findOneAndUpdate(
            { name }, // البحث عن المستخدم باستخدام username
            { isOnline: true } // تحديث حالة isOnline
          );
        
        res.json({message:"Logged in successfully"})

    }catch(err){
        console.error("Error in login contoller:",err)
        res.status(500).json({message:"Server Error!"})
    }
}

export const logout = async (req,res)=>{
    const userlog = await Admin.findByIdAndUpdate(
         req.admin._id,
        { isOnline: false }
      );
    userlog.save()
    res.clearCookie("jwt-wehda-admin");
    res.json({message:"Logged out successflluy"})
}

export const getCurrentUser =async(req,res) =>{
    try{
        res.json(req.admin)
    }catch(err){
        console.error("Error in getCurrentUser controller:",err)
        res.status(500).json({message:"Server error"})
    }
}
//dashboard
//get all users
export const getAllUsers = async(req,res)=>{
    try{
        const allUsers = await User.find().sort({ createdAt: -1 })
        res.status(200).json(allUsers)
    }catch (err){
        console.error("Error in getAllUsers Controller:",err)
        res.status(500).json({message:"Server error"})
    }
}

export const getUserScraps =async(req,res)=>{
    
    try{
        const userId=req.params.id
        const userScraps = await Scrap.find({author:userId})
        res.status(200).json(userScraps)
    }catch (err){
        console.error("Error in getUserScraps Controller:",err)
        res.status(500).json({message:"Server error"})
    }
}

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // حذف المستخدم
        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // حذف السجلات المرتبطة بالمستخدم
        // حذف جميع السجلات الخاصة بـScrap حيث يكون المستخدم هو المؤلف
        await Scrap.deleteMany({ author: userId });

        // حذف التعليقات الخاصة بالمستخدم
        await Scrap.updateMany(
            {},
            { $pull: { comments: { user: userId } } }
        );

        res.status(200).json({ message: "User and related data deleted successfully" });
    } catch (error) {
        console.log("Error in deleteUser controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const desActiveUser= async(req,res)=>{
    const userId =req.params.id
    try{
        const user = await User.findByIdAndUpdate(userId,{active: false, isOnline: false}, { new: true })
        // إزالة الكوكي الخاص بتسجيل الدخول
    // res.clearCookie("jwt-wehda", {
    //     httpOnly: true,
    //     sameSite: "strict",
    //     secure: process.env.NODE_ENV === "production",
    //   });
  
      res.status(200).json({ message: "User deactivated", user });
   
    }catch (err){
        console.error("Error in deleteUser Controller:",err)
        res.status(500).json({message:"Server error"})
    }
}
export const activeUser= async(req,res)=>{
    const userId =req.params.id
    try{
        const user = await User.findByIdAndUpdate(userId,{active:true})
        res.status(200).json(user)
    }catch (err){
        console.error("Error in deleteUser Controller:",err)
        res.status(500).json({message:"Server error"})
    }
}

export const userScraps = async (req, res) => {
    try {
        const userId = req.params.id;
        const scraps = await Scrap.find({ author: userId})
            .sort({ createdAt: -1 })
            // .populate({
            //     path: "deal"
            // })
        if (!scraps) {
            return res.status(200).json([]);
        }
        res.status(200).json(scraps);
    } catch (error) {
        console.log("Error in getAllPosts controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
    };

    export const deleteScrap = async(req,res)=>{
        try{
            const scrapId = req.params.id
    
            const scrap = await Scrap.findByIdAndUpdate(scrapId,{isDroped:true})    
            if(!scrap){
                return res.status(404).json({message:"Scrap not found"})
            }  
            await scrap.save()
            return res.status(200).json({message:"Scrap deleted"})
        }catch(err){
            console.error("Error in deleteScrap controller:",err)
            res.status(500).json({message:"Server error"})
        }
    }
    export const activeScrap = async(req,res)=>{
        try{
            const scrapId = req.params.id
    
            const scrap = await Scrap.findByIdAndUpdate(scrapId,{isDroped:false})    
            if(!scrap){
                return res.status(404).json({message:"Scrap not found"})
            }  
            await scrap.save()
            return res.status(200).json({message:"Scrap deleted"})
        }catch(err){
            console.error("Error in deleteScrap controller:",err)
            res.status(500).json({message:"Server error"})
        }
    }
    
    export const adminDeleteScrap = async(req,res)=>{
        try{
            const scrapId = req.params.id
    
            const scrap = await Scrap.findById(scrapId)    
            if(!scrap){
                return res.status(404).json({message:"Scrap not found"})
            }    
            if(scrap.image){       
                const imgId = scrap.image.split("/").pop().split(".")[0]
                await cloudinary.uploader.destroy(imgId)
            }
            // const scrapRes = ScrapResponse.find({scrap:scrapId})
            // if(scrapRes){
            //     await ScrapResponse.deleteMany({scrap:scrapId})
            // }
            await Scrap.findByIdAndDelete(scrapId)
            return res.status(200).json({message:"Scrap deleted"})
        }catch(err){
            console.error("Error in deleteScrap controller:",err)
            res.status(500).json({message:"Server error"})
        }
    }
    
    export const getAllScraps =  async(req,res)=>{
        try{
            const allScraps = await Scrap.find().sort({ createdAt: -1 })
            res.status(200).json(allScraps)
        }catch (err){
            console.error("Error in getAllUsers Controller:",err)
            res.status(500).json({message:"Server error"})
        }
    }

    export const messageSend = async (req,res)=>{
        try{
            const { name , company ,email ,phone , message} = req.body;
            if(!name || !company || !email || !phone || !message){
                return res.status(400).json({message:"All fields are required"})
            }
           const msg =new Mail({
            name , company ,email ,phone , message
            })
    
            await msg.save();
    
            res.status(200).json({message:"Message Send Successfully"})
    
        }catch(err){
            console.log("Error in messageSend",err)
            res.status(500).json({message:"Something went wrong"})
        }
    }

    export const getAllMails =  async(req,res)=>{
        try{
            const allMails = await Mail.find().sort({ createdAt: -1 })
            res.status(200).json(allMails)
        }catch (err){
            console.error("Error in getAllUsers Controller:",err)
            res.status(500).json({message:"Server error"})
        }
    }

    export const deleteMail = async(req,res)=>{
        try{
            const mailId = req.params.id
    
            const mail = await Mail.findByIdAndDelete(mailId)    
            if(!mail){
                return res.status(404).json({message:"Mail not found"})
            }  
            return res.status(200).json({message:"Mail deleted"})
        }catch(err){
            console.error("Error in deleteMail controller:",err)
            res.status(500).json({message:"Server error"})
        }
    }

    export const mailRead = async(req,res)=>{
        try{
            const mailId = req.params.id
    
            const mail = await Mail.findByIdAndUpdate(mailId,{read:true})   
            if(!mail){
                return res.status(404).json({message:"Mail not found"})
            }  
            await mail.save()
            return res.status(200).json({message:"Mail read"})
        }catch(err){
            console.error("Error in mailRead controller:",err)
            res.status(500).json({message:"Server error"})
        }
    }

    export const getMail = async(req,res)=>{
        try{
            const mailId = req.params.id
    
            const mail = await Mail.findById(mailId)    
            if(!mail){
                return res.status(404).json({message:"Mail not found"})
            }  
            return res.status(200).json(mail)
        }catch(err){
            console.error("Error in getMail controller:",err)
            res.status(500).json({message:"Server error"})
        }
    }

   export const getScrapResponses =async(req,res)=>{
        try{
            const scrapId=req.params.id
            const scrapRes = await ScrapResponse.find({scrap:scrapId})
            res.status(200).json(scrapRes)
        }catch (err){
            console.error("Error in getScrapResponses Controller:",err)
            res.status(500).json({message:"Server error"})
        }
    }