import { Request, Response } from 'express';
import TeamService from '../services/teamsService';

export default class TeamsController {
  teamService = TeamService;

  async getAll(_req: Request, res: Response): Promise<void> {
    const response = await this.teamService.getAll();
    res.json(response);
  }
}
