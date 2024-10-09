import { TimerService } from "../services/timer.service";
import { Timer, ITimer } from "../models/timer.model";
import { User } from "../models/user.model";
import mongoose from "mongoose";
import { CreateTimerDto } from "../dtos/timer.dto";

jest.mock("../models/timer.model");
jest.mock("../models/user.model");

describe("TimerService", () => {
  let timerService: TimerService;
  let userMock: any;
  let timerMock: ITimer;

  beforeEach(() => {
    timerService = new TimerService();

    userMock = {
      _id: "user-id",
      email: "test@example.com",
      password: "hashedpassword",
      role: true,
    };

    timerMock = {
      _id: "timer-id",
      user_id: new mongoose.Types.ObjectId(userMock._id),
      time: 1000,
      save: jest.fn(),
    } as unknown as ITimer;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should successfully create a new timer", async () => {
      const createTimerDto: CreateTimerDto = {
        startTimestamp: 100,
        clickTimestamp: 1100,
      };

      (User.findById as jest.Mock).mockResolvedValue(userMock);
      (Timer.prototype.save as jest.Mock).mockResolvedValue(timerMock);
      (Timer as jest.Mock).mockImplementation(() => timerMock);

      const result = await timerService.create(userMock._id, createTimerDto);
      expect(result).toEqual(timerMock);
      expect(User.findById).toHaveBeenCalledWith(userMock._id);
      expect(Timer).toHaveBeenCalledWith({
        user_id: new mongoose.Types.ObjectId(userMock._id),
        time: 1000,
      });
      expect(timerMock.save).toHaveBeenCalled();
    });

    it("should throw an error if the user is not found", async () => {
      const createTimerDto: CreateTimerDto = {
        startTimestamp: 100,
        clickTimestamp: 1100,
      };

      (User.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        timerService.create(userMock._id, createTimerDto)
      ).rejects.toThrow("No user found with this id");
    });
  });

  describe("getTimers", () => {
    it("should return all timers for a user", async () => {
      (User.findById as jest.Mock).mockResolvedValue(userMock);
      (Timer.find as jest.Mock).mockResolvedValue([timerMock]);

      const result = await timerService.getTimers(userMock._id);
      expect(result).toEqual([timerMock]);
      expect(User.findById).toHaveBeenCalledWith(userMock._id);
      expect(Timer.find).toHaveBeenCalledWith({ user_id: userMock._id });
    });

    it("should throw an error if the user is not found", async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      await expect(timerService.getTimers(userMock._id)).rejects.toThrow(
        "No user found with this id"
      );
    });

    it("should throw an error if no timers are found", async () => {
      (User.findById as jest.Mock).mockResolvedValue(userMock);
      (Timer.find as jest.Mock).mockResolvedValue([]);

      await expect(timerService.getTimers(userMock._id)).rejects.toThrow(
        "No timers found for this user"
      );
    });
  });

  describe("getBestTimers", () => {
    it("should return the best timers for a user", async () => {
      (User.findById as jest.Mock).mockResolvedValue(userMock);
      (Timer.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([timerMock]),
      });

      const result = await timerService.getBestTimers(userMock._id, 10);
      expect(result).toEqual([timerMock]);
      expect(User.findById).toHaveBeenCalledWith(userMock._id);
      expect(Timer.find).toHaveBeenCalledWith({ user_id: userMock._id });
    });

    it("should throw an error if the user is not found", async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        timerService.getBestTimers(userMock._id, 10)
      ).rejects.toThrow("No user found with this id");
    });

    it("should throw an error if no timers are found", async () => {
      (User.findById as jest.Mock).mockResolvedValue(userMock);
      (Timer.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      });

      await expect(
        timerService.getBestTimers(userMock._id, 10)
      ).rejects.toThrow("No timers found for this user");
    });
  });

  describe("getAllTimers", () => {
    it("should return all timers", async () => {
      (Timer.find as jest.Mock).mockResolvedValue([timerMock]);

      const result = await timerService.getAllTimers();
      expect(result).toEqual([timerMock]);
      expect(Timer.find).toHaveBeenCalled();
    });

    it("should throw an error if no timers are found", async () => {
      (Timer.find as jest.Mock).mockResolvedValue([]);

      await expect(timerService.getAllTimers()).rejects.toThrow(
        "No timers found"
      );
    });
  });
});
