import Teams from '../database/models/teams';

export interface ITeam {
  id: number
  teamName: string
}

export default class TeamService {
  static async getAll(): Promise<ITeam[]> {
    return Teams.findAll();
  }
}
