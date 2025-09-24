import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.NODE_ENV === "production"
      ? process.env.MONGO_URI_PROD
      : process.env.MONGO_URI;

    await mongoose.connect(uri);
    console.log("✅ DB connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  }
};

export { connectDB };

