import express from "express";
import { login, register } from "../controllers/user.controller.js";
import { upload } from "../middlewares/upload.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { User } from "../models/user.model.js";

const router = express.Router();


router.post("/register", upload.single("image"), register);
router.post("/login", login);
router.get("/auth", isAuthenticated, async (req, res) => {
    let user;
    try {
        user = await User.findById({ _id: req.user.id });
        user.posts.push("user");
        await user.save();
    } catch (error) {
        return res.json({
            message: "server error",
            error: error.message
        })
    }
    return res.json({
        message: "user authenticated",
        user
    })
})

export const userRouter = router;