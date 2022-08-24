import { Request, Response } from 'express';
import MatchesServices from '../services/matchesService';

export default class MatchesController {
  matchesServices = MatchesServices;

  async getAll(_req: Request, res: Response) {
    const response = await this.matchesServices.getAll();
    res.json(response);
  }
}
