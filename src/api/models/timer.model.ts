const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let timerSchema = new Schema({
  user_id: { required: "true", type: Schema.Types.ObjectId, ref: "User" },
  time: { required: "true", type: Number },
});

export const Timer = mongoose.model("Timer", timerSchema);
