import { TimerService } from "../services/timer.service";
import { CreateTimerDto } from "../dtos/timer.dto";

export class TimerController {
  constructor(private timerService: TimerService) {}

  async createTimer(userId: string, dto: CreateTimerDto) {
    return await this.timerService.create(userId, dto);
  }

  async getTimers(userId: string) {
    return await this.timerService.getTimers(userId);
  }

  async getBestTimers(userId: string, limit: number) {
    return await this.timerService.getBestTimers(userId, limit);
  }

  async getAllTimers() {
    return await this.timerService.getAllTimers();
  }
}
