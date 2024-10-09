import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route";
import { log } from "console";

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get MongoDB URI from environment variables
const uri =
  (process.env.MONGODB_URI as string) ??
  "mongodb://gana:test_g@mongo:27017/myDatabase";

if (!uri) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

// Connect to MongoDB
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Use the user router
app.use("/users", userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(process.env.MONGODB_URI);

  console.log(`Server is running on port ${PORT}`);
});
