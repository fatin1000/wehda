import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import cloudinary from "../lib/cloudinary.js"
import { whitelist } from "../util/whiteList.js"

export const singup = async (req,res)=>{
    const { username, email, password , phone, company, location,headline, fields, services, labor ,laborPayment, record} = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }      
if( whitelist.includes(req.body.email) ) {
    try{
        if (!req.file) {
            return res.status(400).json({ message: "Commercial record file is required" });
          }      
        if(!username){
            return res.status(400).json({message:"User name is required"})
        }
        if(!email){
            return res.status(400).json({message:"Email is required"})
        }
        if(!password){
            return res.status(400).json({message:"Password is required"})
        }
        if(!phone){
            return res.status(400).json({message:"Phone is required"})
        }
        if(!company){
            return res.status(400).json({message:"Company is required"})
        }
        if(!location){
            return res.status(400).json({message:"Location is required"})
        }
        if(!headline){
            return res.status(400).json({message:"Headline is required"})
        }
        if(fields.length === 0){
            return res.status(400).json({message:"Fields is required at least one"})
        }
        
         // رفع الملف إلى Cloudinary باستخدام Promise
    const uploadToCloudinary = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: "auto",
              folder: "commercial_records",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          stream.end(req.file.buffer);
        });
      };
  
      const result = await uploadToCloudinary();
      const recordUrl = result.secure_url;
  

        const existingEmail = await User.findOne({email})
        if(existingEmail){
            return res.status(400).json({message: "Email already exists"})
        }
        if(password.length < 6){
            return res.status(400).json({message :"Password must be at least 6 charcters"})
        }


        const salt =await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(password,salt)

        const user =new User({
             username, email,phone, company, location,headline, fields, services,labor,laborPayment,
            password:hashedPassword,
            record:recordUrl
        })

        await user.save();

        const token =jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1d"})

        res.cookie("jwt-wehda", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // يوم كامل
            sameSite: "Strict",
            secure: process.env.NODE_ENV === "production"
        })

        res.status(201).json({message:"User registered successfully"})

        //todo : send verification by phone


    }catch(err){
        res.status(500).json({message:"Something went wrong"})
    }
}else{
    return res.status(400).json({
        message: "Email is not allowed",
      });    
}
   
}

export const login =async (req,res)=>{
    try{
        const {username,password} = req.body
        //check user
        const user =await User.findOne({username})
        
        if(!user){
            return res.status(400).json({message:"invalid credentials"})
        }
        //check password
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message:"invalid credentials"})
        }
        if(user.isDeleted){
            return res.status(400).json({message:"This account has been deleted"})  
        }
        //create and send password
        const token = jwt.sign({userId: user._id},process.env.JWT_SECRET,{expiresIn:"1d"})
        await res.cookie("jwt-wehda",token,{
            httpOnly:true,
            maxAge: 24 * 60 * 60 * 1000, // 3 أيام
            sameSite:"strict",
            secure:process.env.NODE_ENV === "production",
        })
        await User.findOneAndUpdate(
            { username }, // البحث عن المستخدم باستخدام username
            { isOnline: true } // تحديث حالة isOnline
          );
        
        res.json({message:"Logged in successfully"})

    }catch(err){
        res.status(500).json({message:"Server Error!"})
    }
}

export const logout = async (req,res)=>{
    const userlog = await User.findByIdAndUpdate(
         req.user._id,
        { isOnline: false }
      );
    userlog.save()
    res.clearCookie("jwt-wehda");
    res.json({message:"Logged out successflluy"})
}

export const getCurrentUser =async(req,res) =>{
    try{
        res.set("Cache-Control", "no-store");
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
          } 
        const user = await User.findById(req.user._id).select("-password")
        res.json(user)
    }catch(err){
        res.status(500).json({message:"Server error"})
    }
}