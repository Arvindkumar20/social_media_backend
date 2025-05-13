import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectdb } from "./config/connectdb.js";
import { userRouter } from "./routes/user.route.js";
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectdb();

app.get("/", (req, res) => {
    return res.json({
        message: "hello"
    });
});
app.use("/api/user",userRouter);

app.listen(port, () => {
    console.log("server running on port ", port);
})

