import Teams from '../database/models/teams';
import Matches from '../database/models/matches';

export default class MatchesServices {
  static async getAll(): Promise<Matches[]> {
    return Matches.findAll({
      include: [
        { model: Teams, as: 'teamHome', attributes: ['teamName'] },
        { model: Teams, as: 'teamAway', attributes: ['teamName'] },
      ],
    });
  }
}
