import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, "Comment content is required"],
        trim: true,
        minlength: [3, "Comment must be at least 3 characters long"],
        maxlength: [500, "Comment must be less than 500 characters"]
    },
    commentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Comment author is required"]
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: [true, "Associated post is required"]
    }
}, {
    timestamps: true
});

export const Comment = mongoose.model("Comment", commentSchema);
