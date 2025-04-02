import mongoose from "mongoose";

const scrapSchema = new mongoose.Schema({
    author:{type:mongoose.Schema.Types.ObjectId, ref:"User" , require:true},
    itemName:{
        type:Object,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    oldQuantity:{
        type:Number
    },
    units:{
        type:String,
        required:true
    },
    sell:{
        type:String,
        enum:["retail" ,"wholesale"],
        default:"wholesale"
    },
    minAmount:{
        type:Number
    },
    unitPrice:{
        type:Number
    },
    location:{
        type:String,
        required:true
    },
    category:{
        type:String,
         required:true
    },
    itemStatus:{
        type:String,
    },
    discription:{type:String,
        default:""
    },
    image:{type:String},

    likes:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
    comments:[
        {
            content:{type:String},
            user:{type:mongoose.Schema.Types.ObjectId, ref: "User"},
            createdAt:{type: Date, default:Date.now}
        },
    ],
    scrapStatus:{
        type:String,
        enum:["open","expired"],
        default:"open"
    },
   deal:[{type:mongoose.Schema.Types.ObjectId, ref:"ScrapResponse"}],
   isDroped:{
    type:Boolean,
    default:false
    }
},{timestamps:true})

const Scrap =mongoose.model("Scrap",scrapSchema)

export default Scrap;