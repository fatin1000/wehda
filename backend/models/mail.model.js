import mongoose from "mongoose";

const mailSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    company:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    phone:{
        type:Number,
        required: true
    },
    message:{
        type:String,
        required: true
    },
    read:{
        type:Boolean,
        default:false
    }
},
{ timestamps: true }
)


const Mail = mongoose.model("Mail", mailSchema);

export default Mail;