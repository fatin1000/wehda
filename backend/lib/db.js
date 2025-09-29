import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Connection failed:", err.message);
    process.exit(1);
  });