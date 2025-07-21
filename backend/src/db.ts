import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
  });

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Content Schema
const ContentSchema = new mongoose.Schema({
  title: String,
  link: String,
  tag: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

// Link Schema
const LinkSchema = new mongoose.Schema({
  hash: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

// Models
export const UserModel = mongoose.model("User", UserSchema);
export const ContentModel = mongoose.model("Content", ContentSchema);
export const LinkModel = mongoose.model("Links", LinkSchema);
