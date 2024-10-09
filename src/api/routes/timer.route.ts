import { Router } from "express";
import { TimerController } from "../controllers/timer.controller";
import { TimerService } from "../services/timer.service";
import { CreateTimerDto } from "../dtos/timer.dto";

const router = Router();
const timerService = new TimerService();
const timerController = new TimerController(timerService);

router.post("/:userId/add", async (req, res) => {
  const userId = req.params.userId;
  const dto: CreateTimerDto = req.body;

  try {
    const newTimer = await timerController.createTimer(userId, dto);
    return res.status(201).json(newTimer);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

router.get("/:userId/timers", async (req, res) => {
  const userId = req.params.userId;

  try {
    const timers = await timerController.getTimers(userId);
    return res.status(200).json(timers);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
});

router.get("/:userId/best", async (req, res) => {
  const userId = req.params.userId;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

  try {
    const bestTimers = await timerController.getBestTimers(userId, limit);
    return res.status(200).json(bestTimers);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const timers = await timerController.getAllTimers();
    return res.status(200).json(timers);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
});

export default router;
