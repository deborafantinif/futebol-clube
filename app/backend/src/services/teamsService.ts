import Teams from '../database/models/teams';

export interface ITeam {
  id: number
  teamName: string
}

export default class TeamService {
  static async getAll(): Promise<ITeam[]> {
    return Teams.findAll();
  }

  static async getById(id: number): Promise<ITeam> {
    const team = await Teams.findByPk(id) as Teams;
    return { id, teamName: team.teamName };
  }
}
