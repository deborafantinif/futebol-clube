import Matches from '../database/models/matches';
import Teams from '../database/models/teams';

export interface IMatchCreate {
  homeTeam: number
  awayTeam: number
  homeTeamGoals: number
  awayTeamGoals: number
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

  static async create(match: IMatchCreate): Promise<Matches> {
    return Matches.create({ ...match, inProgress: 1 });
  }
}
