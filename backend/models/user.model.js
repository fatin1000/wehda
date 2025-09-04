import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    company: {
        type: String,    
        required: true
    },
    location: {
        type: String,
        required: true
    },
    fields:{
        type: Array,
        default: [],
        required: true
    },
    services: {
        type:Boolean,
        default: false
    },
    labor: {
        type: String,
    },
    profilePic: {
        type: String,
        default:""
    },
    bannerPic: {
        type: String,
        default:""
    },
    headline: {
        type: String,
        enum:["Supplier and Contractor" ,"Supplier" , "Contractor"],
    },
    record: {
        type: String,
        required: true
    },
    laborPayment:{
        type: String,
        enum: ["daily","monthly"],
        default:"daily"
    },
    plan: {
        type: String,
        default: "free"
    },
    active: {
        type: Boolean,
        default: true
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    likedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: [],
        },
    ],
    likedScraps: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Scrap",
            default: [],
        },
    ],
    notSettings: {
        type: Boolean,
        default: true  
    },
    isOnline:{
        type: Boolean,
        default:true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
},{
    timestamps: true})

const User =mongoose.model("User",userSchema)

export default User