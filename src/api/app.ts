import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route";
import timerRouter from "./routes/timer.route";

dotenv.config();

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri = process.env.MONGODB_URI as string;

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
  .catch((err) => console.error(err));

app.use("/users", userRouter);
app.use("/timers", timerRouter);

const PORT = process.env.PORT || 3000;
export const server = app.listen(PORT, () => {
  console.log(process.env.MONGODB_URI);

  console.log(`Server is running on port ${PORT}`);
});
