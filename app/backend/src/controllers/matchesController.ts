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
    const { code, data } = await this.matchesServices.create(
      req.body as IMatchCreate,
      req.headers.authorization as string,
    );
    res.status(code).json(data);
  }

  async finishProgress(req: Request, res: Response) {
    await this.matchesServices.finishProgress(Number(req.params.id));
    res.json({ message: 'Finished' });
  }
}
