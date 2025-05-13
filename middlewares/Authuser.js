import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
export const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token missing or invalid' });
        }

        const token = authHeader.split(' ')[1];

        // Step 1: Verify token
        const decoded = jwt.verify(token, "gyuegrugverqugvreygfrygvegyyguygtytdd"); // decoded = { userId: ... }

        if (!decoded.userId) {
            return res.status(401).json({ message: 'Invalid token payload' });
        }

        // Step 2: Check if user exists
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'User does not exist' });
        }

        // Step 3: Attach userId to request
        req.user = { id: user._id }; // bas userId return karna

        next();
    } catch (err) {
        console.error('Authentication error:', err.message);
        return res.status(401).json({ message: 'Authentication failed' });
    }
};

