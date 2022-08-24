import Matches from '../database/models/matches';
import Teams from '../database/models/teams';

export interface IMatchCreate {
  homeTeam: number
  awayTeam: number
  homeTeamGoals: number
  awayTeamGoals: number
}

export interface IDefaultResponse {
  code: number
  data: any
}

export default class MatchesServices {
  static async getAll(): Promise<Matches[]> {
    return Matches.findAll({
      include: [
        { model: Teams, as: 'teamHome', attributes: ['teamName'] },
        { model: Teams, as: 'teamAway', attributes: ['teamName'] },
      ],
    });
  }

  // static async getAllByQuery(): Promise<Matches[]> {
  //   console.log('caiu');
  //   return Matches.findAll({
  //     include: [
  //       { model: Teams, as: 'teamHome', attributes: ['teamName'] },
  //       { model: Teams, as: 'teamAway', attributes: ['teamName'] },
  //     ],
  //     where: { id: 16 },
  //   });
  // }

  static async create(match: IMatchCreate, token: string): Promise<IDefaultResponse> {
    // await JwtService.verify(token);
    if (!token) return { code: 401, data: { message: 'Not Authorization' } };
    const newMatch = await Matches.create({ ...match, inProgress: 1 });
    return { code: 201, data: newMatch };
  }

  static async finishProgress(id: number): Promise<void> {
    await Matches.update(
      { inProgress: 0 },
      { where: { id } },
    );
  }
}
