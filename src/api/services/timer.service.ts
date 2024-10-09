import { CreateTimerDto } from "../dtos/timer.dto";
import { User } from "../models/user.model";
import { Timer, ITimer, ITimerBase } from "../models/timer.model";
import mongoose from "mongoose";

export class TimerService {
  async create(userId: string, dto: CreateTimerDto): Promise<ITimer> {
    const user = await User.findById(userId);

    if (!user) throw new Error(`No user found with this id`);

    const time = dto.clickTimestamp - dto.startTimestamp;

    const timerData: ITimerBase = {
      user_id: new mongoose.Types.ObjectId(userId),
      time: time,
    };

    const newTimer = new Timer(timerData);

    const savedTimer = await newTimer.save();
    return savedTimer;
  }

  async getTimers(userId: string): Promise<ITimer[]> {
    const user = await User.findById(userId);

    if (!user) throw new Error(`No user found with this id`);

    const timers = await Timer.find({ user_id: userId });

    if (timers.length === 0) throw new Error(`No timers found for this user`);

    return timers;
  }

  async getBestTimers(userId: string, limit: number = 10): Promise<ITimer[]> {
    const user = await User.findById(userId);

    if (!user) throw new Error(`No user found with this id`);

    const timers = await Timer.find({ user_id: userId })
      .sort({ time: 1 })
      .limit(limit);

    if (timers.length === 0) throw new Error(`No timers found for this user`);

    return timers;
  }

  async getAllTimers(): Promise<ITimer[]> {
    const timers = await Timer.find();

    if (timers.length === 0) throw new Error(`No timers found `);

    return timers;
  }
}
