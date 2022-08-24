import { Request, Response } from 'express';
import MatchesServices, { IMatchCreate } from '../services/matchesService';

export default class MatchesController {
  matchesServices = MatchesServices;

  async getAll(req: Request, res: Response) {
    // let response;
    // console.log(req.query.inProgress);
    // if (req.query.inProgress) {
    //   response = await this.matchesServices.getAllByQuery();
    // }
    const response = await this.matchesServices.getAll();
    res.json(response);
  }

  async create(req: Request, res: Response) {
    const response = await this.matchesServices.create(req.body as IMatchCreate);
    res.json(response);
  }
}
