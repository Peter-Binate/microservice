import mongoose, { Document, Schema } from "mongoose";

export interface ITimerBase {
  user_id: mongoose.Types.ObjectId | string;
  time: number;
}

export interface ITimer extends ITimerBase, Document {}

const timerSchema = new Schema<ITimer>({
  user_id: { required: true, type: Schema.Types.ObjectId, ref: "User" },
  time: { required: true, type: Number },
});

export const Timer = mongoose.model<ITimer>("Timer", timerSchema);
