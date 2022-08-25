import { Request, Response } from 'express';
import LeaderboardService from '../services/leaderboardService';

export default class LeaderboardController {
  leaderboardService = LeaderboardService;

  async getAll(_req: Request, res: Response) {
    const response = await this.leaderboardService.getAll();
    res.json(response);
  }
}
