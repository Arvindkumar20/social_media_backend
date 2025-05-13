import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    profilePic: {
        url: {
            type: String
        },
        public_id: { type: String }
    },
    posts: [],
    friends: [],
    comments: []

});


export const User = mongoose.model("user", userSchema);