import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./api/routes/user";

dotenv.config();

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri = process.env.MONGODB_URI_USER as string;

if (!uri) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err: any) => console.error(err));

app.use("/users", userRouter);

const PORT = process.env.PORT || 3000;
export const server = app.listen(PORT, () => {
  console.log(process.env.MONGODB_URI_USER);

  console.log(`Server is running on port ${PORT}`);
});
