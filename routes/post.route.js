import express from "express"
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { createPost } from "../controllers/post.controller.js";

const router = express.Router();


router.post("/create", isAuthenticated,createPost);

export const postRouter = router