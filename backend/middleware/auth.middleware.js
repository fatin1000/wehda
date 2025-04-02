import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute =async(req,res,next)=>{
    try{
        //const jwtWebCookie = Object.keys(req.cookies).find(cookie => cookie.startsWith("jwt-web"));
        const token = req.cookies["jwt-wehda"]
        if(!token){
            return res.status(401).json({message:"Unauthorized - no Token provided"})
        }
        const decoded =jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({message:"Unauthorized - invalid Token"})
        }

        const user =await User.findById(decoded.userId).select("-password")

        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        req.user = user;

        next()
    }catch(err){
        console.log("Error in prodectRoute middleware:",err.message)
        res.status(500).json({message:"Internal server error"})
    }
}