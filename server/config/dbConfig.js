import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Corrected the typo

const uri = process.env.MONGO_URI;

const connectToDB = async () => {
  try {
    if (!uri) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }

    await mongoose.connect(uri);

    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

export default connectToDB;
