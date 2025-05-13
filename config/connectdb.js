import mongoose from "mongoose";
import "dotenv/config";

export const connectdb = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGODB_URI);
        if (!con) {
            console.log("mongo db not connected")
        }
        console.log("mongo db connected")
    } catch (error) {
        console.log("mongo db connection error", error);
    }
}