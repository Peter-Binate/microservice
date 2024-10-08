const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: "true" },
  password: { type: String, required: "true" },
  role: { type: Boolean, required: "true", default: 1 },
});

export const User = mongoose.model("User", userSchema);
