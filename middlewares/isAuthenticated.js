import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.json({
            message: "invalid token"
        });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.json({
            message: "invalid token"
        });
    }

    const decoded = jwt.verify(token, "gyuegrugverqugvreygfrygvegyyguygtytdd");

    if (!decoded.userId) {
        return res.json({
            message: "user id not found",
        });
    }

    let user;
    try {
        user = await User.findById({ _id: decoded.userId })
    } catch (error) {
        return res.json({
            message: "server error",
            error: error.message
        });
    }
    if (!user) {
        return res.json({
            message: "user not found "
        });
    }

    req.user = user._id
    next();
}