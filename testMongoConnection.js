// testMongoConnection.js
import mongoose from "mongoose";

const uri = process.env.MONGO_URI || "mongodb://localhost:27017/wehda";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected successfully");
  process.exit(0);
})
.catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
  process.exit(1);
});