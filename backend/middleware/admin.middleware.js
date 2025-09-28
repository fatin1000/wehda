import jwt from "jsonwebtoken"
import Admin from "../models/admin.model.js"

export const adminProtectRoute =async(req,res,next)=>{
    try{
        //const jwtWebCookie = Object.keys(req.cookies).find(cookie => cookie.startsWith("jwt-web"));
        const token = req.cookies["jwt-wehda-admin"]
        if(!token){
            return res.status(401).json({message:"Unauthorized - no Token provided"})
        }
        const decoded =jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({message:"Unauthorized - invalid Token"})
        }

        const user =await Admin.findById(decoded.userId).select("-password")

        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        req.admin = user;

        next()
    }catch(err){
        res.status(500).json({message:"Internal server error"})
    }
}