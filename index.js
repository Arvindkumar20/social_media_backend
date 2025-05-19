import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectdb } from "./config/connectdb.js";
import { userRouter } from "./routes/user.route.js";
import { postRouter } from "./routes/post.route.js";

const app = express();
const port = process.env.PORT || 5000;

// Correct CORS setup for credentials & specific origins
app.use(
  cors({
    origin: "https://capable-cat-daea0f.netlify.app",  // Your frontend URL here
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,                // Required to allow cookies, sessions
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    exposedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to DB
connectdb();

app.get("/", (req, res) => {
  return res.json({
    message: "hello",
  });
});

// Mount routes
app.use("/api/auth", userRouter);
app.use("/api/post", postRouter);

app.listen(port, () => {
  console.log("server running on port", port);
});
