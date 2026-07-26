import mongoose from "mongoose";

const connectDB = async () => {
  console.log("MONGODB_URI =", process.env.MONGODB_URI);

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;