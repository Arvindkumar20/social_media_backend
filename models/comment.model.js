import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        minLength: 10,
        maxLength: 500,
        required: true
    },
    commentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true });
export const Comment = mongoose.model("comment", commentSchema);