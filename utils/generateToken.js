import jwt from "jsonwebtoken";

export const generateToken = async (userId) => {
    let token;
    try {
        token = jwt.sign({ userId: userId }, "gyuegrugverqugvreygfrygvegyyguygtytdd");
    } catch (error) {
        return error.message
    }
    return token;
}