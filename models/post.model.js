import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment"
    }],
    likedBy: [],
    sharedBy: [],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true });

export const Post = mongoose.model("post", postSchema);