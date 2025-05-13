import { checkEmpty } from "../utils/checkEmpty.js";

export const createPost = async (req, res) => {
    const { title, description } = req.body;
    if (checkEmpty(title, description)) {
        return res.json({
            message: "all fields are required"
        });
    }
    return res.json({
        message: "user authenticated and post created"
    })
};
export const UpdatePost = async (req, res) => {

};
export const deletPost = async (req, res) => {

};
export const getAllPost = async (req, res) => {

};
export const getPostById = async (req, res) => {

};