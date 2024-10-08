import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user.route";

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose
  .connect("mongodb://mongo:27017/mydatabase")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Simple route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
