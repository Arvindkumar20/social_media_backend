import express from "express";
import { getUser, login, register, updateProfile } from "../controllers/user.controller.js";
import { upload } from "../middlewares/upload.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { User } from "../models/user.model.js";

const router = express.Router();


router.post("/register", upload.single("image"), register);
router.post("/login", login);
// router.get("/auth", isAuthenticated, async (req, res) => {
//     let user;
//     try {
//         user = await User.findById({ _id: req.user.id });
//         user.posts.push("user");
//         await user.save();
//     } catch (error) {
//         return res.json({
//             message: "server error",
//             error: error.message
//         })
//     }
//     return res.json({
//         message: "user authenticated",
//         user
//     })
// })

router.get("/", isAuthenticated, getUser);
router.get("/users", async (req, res) => {
    try {
        const user = await User.find({});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
)

router.put("/profile", isAuthenticated, upload.single("image"), updateProfile);
export const userRouter = router;