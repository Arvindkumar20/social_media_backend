
import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { upload } from "../middlewares/upload.js";
import { commentOnPost, createPost, deletePost, getAllPost, getPostById, likePost, sharePost, updatePost } from "../controllers/post.controller.js";
const router = express.Router();
router.post("/create", isAuthenticated, upload.single("image"), createPost);
router.put("/update/:postId", isAuthenticated, upload.single("image"), updatePost);
router.delete("/:postId", isAuthenticated, deletePost);
router.get("/", getAllPost);
router.get("/:postId", getPostById);
router.post("/:postId/like", isAuthenticated, likePost);
router.post("/:postId/share", isAuthenticated, sharePost);
router.post("/:postId/comment", isAuthenticated, commentOnPost);
export const postRouter = router;