const mongoose = require("mongoose");
const Schema = mongoose.Schema;
import { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: boolean;
}

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: Boolean, required: true, default: true },
});

const User = mongoose.model("User", userSchema);

export { User };
