import Matches from '../database/models/matches';
import Teams from '../database/models/teams';
import JwtService from './jwtService';

export interface IMatchUpdate {
  homeTeamGoals: number
  awayTeamGoals: number
}

export interface IMatchCreate extends IMatchUpdate {
  homeTeam: number
  awayTeam: number
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
    const isValidToken = await JwtService.verify(token);
    if (!isValidToken.id) return { code: 401, data: { message: 'Token must be a valid token' } };
    if (match.awayTeam === match.homeTeam) {
      return {
        code: 401,
        data: { message: 'It is not possible to create a match with two equal teams' },
      };
    }
    const homeTeam = await Matches.findByPk(match.homeTeam);
    const awayTeam = await Matches.findByPk(match.awayTeam);
    if (!homeTeam || !awayTeam) {
      return {
        code: 404,
        data: { message: 'There is no team with such id!' },
      };
    }
    const newMatch = await Matches.create({ ...match, inProgress: 1 });
    return { code: 201, data: newMatch };
  }

  static async finishProgress(id: number): Promise<void> {
    await Matches.update(
      { inProgress: 0 },
      { where: { id } },
    );
  }

  static async update(id: number, match: IMatchUpdate): Promise<void> {
    await Matches.update(
      { ...match },
      { where: { id } },
    );
  }
}
