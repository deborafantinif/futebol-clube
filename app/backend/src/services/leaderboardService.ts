import { Op } from 'sequelize';
import Matches from '../database/models/matches';
import Teams from '../database/models/teams';

interface IPointsMatch {
  homeTeamGoals: number,
  awayTeamGoals: number,
  result: string,
}

interface IResultTeam {
  name: string
  totalPoints: number
  totalGames: number
  totalVictories: number
  totalDraws: number
  totalLosses: number
  goalsFavor: number
  goalsOwn: number
  goalsBalance: number
  efficiency: string
}

const verifyVictory = (matches: Matches[]): IPointsMatch[] => matches.map((match) => {
  let result;
  if (match.homeTeamGoals > match.awayTeamGoals) {
    result = 'victory';
  } else if (match.homeTeamGoals >= match.awayTeamGoals) {
    result = 'draw';
  } else {
    result = 'loser';
  }
  return {
    homeTeamGoals: match.homeTeamGoals,
    awayTeamGoals: match.awayTeamGoals,
    result,
  };
});

const verifyVictoryAway = (matches: Matches[]): IPointsMatch[] => matches.map((match) => {
  let result;
  if (match.homeTeamGoals < match.awayTeamGoals) {
    result = 'victory';
  } else if (match.homeTeamGoals <= match.awayTeamGoals) {
    result = 'draw';
  } else {
    result = 'loser';
  }
  return {
    homeTeamGoals: match.homeTeamGoals,
    awayTeamGoals: match.awayTeamGoals,
    result,
  };
});

const verifyVictoryGeral = (matches: Matches[], id: number): IPointsMatch[] => {
  const homeMatches = matches.filter((match) => match.homeTeam === id);
  const awayMatches = matches.filter((match) => match.awayTeam === id);
  const resultsHomeMatches = verifyVictory(homeMatches);
  const resultsAwayMatches = verifyVictoryAway(awayMatches);
  return [
    ...resultsAwayMatches,
    ...resultsHomeMatches,
  ];
};

const totalGoals = (matches: IPointsMatch[]) => {
  let goalsFavor = 0;
  let goalsOwn = 0;
  matches.forEach((match) => {
    goalsFavor += match.homeTeamGoals;
    goalsOwn += match.awayTeamGoals;
  });
  return { goalsFavor, goalsOwn };
};

const totalGoalsAway = (matches: IPointsMatch[]) => {
  let goalsFavor = 0;
  let goalsOwn = 0;
  matches.forEach((match) => {
    goalsFavor += match.awayTeamGoals;
    goalsOwn += match.homeTeamGoals;
  });
  return { goalsFavor, goalsOwn };
};

const totalGoalsGeral = (matches: IPointsMatch[]) => {
  let goalsFavor = 0;
  let goalsOwn = 0;
  matches.forEach((match) => {
    const goals = [match.awayTeamGoals, match.homeTeamGoals];
    const maxGoal = Math.max(...goals);
    const minGoal = Math.min(...goals);
    if (match.result === 'draw') {
      goalsFavor += match.awayTeamGoals;
      goalsOwn += match.homeTeamGoals;
    } if (match.result === 'victory') {
      goalsFavor += maxGoal;
      goalsOwn += minGoal;
    } else {
      goalsFavor += minGoal;
      goalsOwn += maxGoal;
    }
  });
  return { goalsFavor, goalsOwn };
};

const totalResultMatch = (matches: IPointsMatch[]) => {
  let [totalVictories, totalDraws, totalLosses] = [0, 0, 0, 0];
  matches.forEach((match) => {
    switch (match.result) {
      case 'victory':
        totalVictories += 1;
        break;
      case 'draw':
        totalDraws += 1;
        break;
      case 'loser':
        totalLosses += 1;
        break;
      default:
        return null;
    }
  });
  return { totalVictories, totalDraws, totalLosses };
};

const sumMatches = (matches: IPointsMatch[]) => {
  const resultMatchesByTeam = totalResultMatch(matches);
  const totalPoints = resultMatchesByTeam.totalVictories * 3 + resultMatchesByTeam.totalDraws;
  const totalGames = matches.length;
  const efficiency = ((totalPoints / (totalGames * 3)) * 100).toFixed(2);
  return {
    ...resultMatchesByTeam, totalPoints, totalGames, efficiency,
  };
};

const orderTeams = (resultTeam: IResultTeam[]) => resultTeam.sort((team, otherTeam) => {
  if (otherTeam.totalPoints > team.totalPoints) return 1;
  if (otherTeam.totalPoints < team.totalPoints) return -1;
  if (otherTeam.totalVictories > team.totalVictories) return 1;
  if (otherTeam.totalVictories < team.totalVictories) return -1;
  if (otherTeam.goalsBalance > team.goalsBalance) return 1;
  if (otherTeam.goalsBalance < team.goalsBalance) return -1;
  if (otherTeam.goalsFavor > team.goalsFavor) return 1;
  if (otherTeam.goalsFavor < team.goalsFavor) return -1;
  if (otherTeam.goalsOwn > team.goalsOwn) return -1;
  if (otherTeam.goalsOwn < team.goalsOwn) return 1;
  return 0;
});

export default class LeaderboardService {
  static async getAll() {
    const teams = await Teams.findAll();
    const resultAllFinishTeam = await Promise.all(
      teams.map(async (team) => {
        const matches = await Matches.findAll({ where: { homeTeam: team.id, inProgress: 0 } });
        const resultMatches = verifyVictory(matches);
        const sumResult = sumMatches(resultMatches);
        const sumGoalsTeam = totalGoals(resultMatches);
        return {
          name: team.teamName,
          ...sumResult,
          ...sumGoalsTeam,
          goalsBalance: sumGoalsTeam.goalsFavor - sumGoalsTeam.goalsOwn,
        };
      }),
    );
    return orderTeams(resultAllFinishTeam);
  }

  static async getAllByAway() {
    const teams = await Teams.findAll();
    const resultAllFinishTeam = await Promise.all(
      teams.map(async (team) => {
        const matches = await Matches.findAll({ where: { awayTeam: team.id, inProgress: 0 } });
        const resultMatches = verifyVictoryAway(matches);
        const sumResult = sumMatches(resultMatches);
        const sumGoalsTeam = totalGoalsAway(resultMatches);
        return {
          name: team.teamName,
          ...sumResult,
          ...sumGoalsTeam,
          goalsBalance: sumGoalsTeam.goalsFavor - sumGoalsTeam.goalsOwn,
        };
      }),
    );
    return orderTeams(resultAllFinishTeam);
  }

  static async getAllByGeral() {
    const teams = await Teams.findAll();
    const resultAllFinishTeam = await Promise.all(
      teams.map(async (team) => {
        const matches = await Matches.findAll(
          { where: { [Op.or]: [{ awayTeam: team.id }, { homeTeam: team.id }], inProgress: 0 } },
        );
        const resultMatches = verifyVictoryGeral(matches, team.id);
        const sumResult = sumMatches(resultMatches);
        const sumGoalsTeam = totalGoalsGeral(resultMatches);
        return {
          name: team.teamName,
          ...sumResult,
          ...sumGoalsTeam,
          goalsBalance: sumGoalsTeam.goalsFavor - sumGoalsTeam.goalsOwn,
        };
      }),
    );
    return orderTeams(resultAllFinishTeam);
  }
}
