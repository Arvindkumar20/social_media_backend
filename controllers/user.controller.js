import cloudinary from "../config/cloudinary.js";
import { User } from "../models/user.model.js";
import { checkEmpty } from "../utils/checkEmpty.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    const file = req.file;
    if (checkEmpty(name, email, password)) {
        return res.json({
            message: "all fields are required"
        });
    }



    let result;
    if (file) {
        try {
            result = await cloudinary.uploader.upload(file.path, {
                folder: "profile"
            });
        } catch (error) {
            return res.json({
                message: "server error",
                error: error.message
            });
        }
    }
    if (!result) {
        return res.json({
            message: "image not uploaded"
        });
    }

    let userExist;
    try {
        userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.json({
                message: "user already exist",
                email
            });

        }
    } catch (error) {
        console.log(error)
        return res.json({
            message: "server error",
            error: error.message
        });
    }

    let hashedPassword = await bcrypt.hash(password, 10);
    let user;
    try {
        user = await User.create({
            name, email, password: hashedPassword,
            image: {
                url: result?.secure_url,
                public_id: result?.public_id
            }
        });

    } catch (error) {
        return res.json({
            message: "server error",
            error: error.message
        });
    }

    if (!user) {
        return res.json({
            message: "user not registered"
        });
    }

    let token;
    try {
        token = jwt.sign({ userId: user._id }, "gyuegrugverqugvreygfrygvegyyguygtytdd");
    } catch (error) {
        return res.json({
            message: "token not generted",
            error: error.message

        });
    }
    return res.json({
        message: "user registered success full",
        token,
        user: user
    });

}



export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email }).select("+password"); // include password
    if (!user) {
      return res.status(401).json({ message: "User not registered" });
    }

    const isMatchedPassword = await bcrypt.compare(password, user.password);
    if (!isMatchedPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "gyuegrugverqugvreygfrygvegyyguygtytdd",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "User logged in successfully",
      token,
      userId: user._id,
    });

  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};





export const getUser = async (req, res) => {
    try {
        const userId = req.user // Assume userId is set in auth middleware

        const user = await User.findById(userId)
            .populate("friends", "name image.url") // populate only needed fields
            .populate("posts", "_id") // just for count or you can skip populate
            .populate("comments", "_id"); // same here

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            name: user.name,
            email: user.email,
            image: user.image,
            friends: user.friends,
            posts: user.posts,
            comments: user.comments,
            // Add these if you added to schema:
            // location: user.location,
            // occupation: user.occupation,
            // profileViews: user.profileViews,
            // postImpressions: user.postImpressions,
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



export const updateProfile = async (req, res) => {
    try {
        const userId = req.user; // set by auth middleware
        const { name, email, password, location } = req.body;
        const file = req.file;

        const updatedData = { name, email, location };

        // Handle new profile image upload
        if (file) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "profile",
            });

            updatedData.image = {
                url: result.secure_url,
                public_id: result.public_id,
            };

            // Optional: delete old image if exists
            const existingUser = await User.findById(userId);
            if (existingUser?.image?.public_id) {
                await cloudinary.uploader.destroy(existingUser.image.public_id);
            }
        }

        // Hash new password if provided
        if (password) {
            updatedData.password = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(userId, updatedData, {
            new: true,
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile updated", user });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


