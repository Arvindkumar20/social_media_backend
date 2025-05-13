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
    let image = result ? {
        url: result?.secure_url,
        public_id: result?.public_id
    } : {};

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
            image: image
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
    if (checkEmpty(email, password)) {
        return res.json({
            message: "all fields are required"
        });
    }

    let user;
    try {
        user = await User.findOne({ email: email });
    } catch (error) {
        return res.json({
            message: "server error",
            error: error.message
        })
    }

    if (!user) {
        return res.json({
            message: "user not registered",
            email
        });
    }

    let isMatchedPassword;
    try {
        isMatchedPassword = await bcrypt.compare(password, user.password);
    } catch (error) {
        return res.json({
            message: "server error",
            error: error.message
        })
    }

    if (!isMatchedPassword) {
        return res.json({
            message: "Check your password please"
        });
    }

    let token = await generateToken(user._id);
    if (!token) {
        return res.json({
            message: "token not generated"
        });
    }
   
    return res.json({
        message: "user logged in successfully",
        token
    });


}