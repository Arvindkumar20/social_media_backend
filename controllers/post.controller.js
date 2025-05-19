import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { checkEmpty } from "../utils/checkEmpty.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// Create Post
export const createPost = async (req, res) => {
    try {
        const { title, description } = req.body;
        const author = req.user;

        if (checkEmpty(title, description)) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let image = "";
        if (req.file) {
            const uploaded = await cloudinary.uploader.upload(req.file.path, {
                folder: "posts",
            });
            fs.unlinkSync(req.file.path);
            image = uploaded.secure_url;
        }

        const post = await Post.create({ title, description, image, author });
        res.status(201).json({ message: "Post created", post });
    } catch (err) {
        console.error("Create Post Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update Post
export const updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { title, description } = req.body;
        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ message: "Post not found" });

        // Image replacement
        if (req.file) {
            if (post.image?.includes("res.cloudinary.com")) {
                const publicId = post.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(`posts/${publicId}`);
            }

            const uploaded = await cloudinary.uploader.upload(req.file.path, {
                folder: "posts",
            });
            fs.unlinkSync(req.file.path);
            post.image = uploaded.secure_url;
        }

        post.title = title || post.title;
        post.description = description || post.description;

        await post.save();
        res.status(200).json({ message: "Post updated", post });
    } catch (err) {
        console.error("Update Post Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Post
export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.image?.includes("res.cloudinary.com")) {
            const publicId = post.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`posts/${publicId}`);
        }

        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: "Post deleted" });
    } catch (err) {
        console.error("Delete Post Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Like / Unlike Post
export const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user;
        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ message: "Post not found" });

        const alreadyLiked = post.likedBy.includes(userId);
        if (alreadyLiked) {
            post.likedBy.pull(userId);
            await post.save();
            return res.status(200).json({ message: "Post unliked" });
        } else {
            post.likedBy.push(userId);
            await post.save();
            return res.status(200).json({ message: "Post liked" });
        }
    } catch (err) {
        console.error("Like Post Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Share Post
export const sharePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user;
        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ message: "Post not found" });

        if (!post.sharedBy.includes(userId)) {
            post.sharedBy.push(userId);
            await post.save();
        }

        res.status(200).json({ message: "Post shared" });
    } catch (err) {
        console.error("Share Post Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Add Comment
export const commentOnPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const commentedBy = req.user;

        if (checkEmpty(content)) {
            return res.status(400).json({ message: "Comment text required" });
        }

        const comment = await Comment.create({ content, commentedBy, post: postId });
        if (!comment) return res.status(500).json({ message: "Comment not created" });
        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ message: "Post not found" });

        post.comments.push(comment._id);
        await post.save();

        res.status(201).json({ message: "Comment added", comment });
    } catch (err) {
        console.error("Comment Post Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get All Posts
export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", "name email image")
            .populate({
                path: "comments",
                populate: { path: "commentedBy", select: "name" },
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ message: "All posts", posts });
    } catch (err) {
        console.error("Get All Post Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Single Post
export const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId)
            .populate("author", "name email image")
            .populate({
                path: "comments",


                populate: { path: "commentedBy", select: "name image" }, // ✅ include commenter's image
                // ✅ include commenter's image

            });

        if (!post) return res.status(404).json({ message: "Post not found" });

        res.status(200).json({ message: "Post found", post });
    } catch (err) {
        console.error("Get Post By ID Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

