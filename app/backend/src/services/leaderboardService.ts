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

const verifyVitory = (matches: Matches[]): IPointsMatch[] => matches.map((match) => {
  let result;
  if (match.homeTeamGoals > match.awayTeamGoals) {
    result = 'vitory';
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

const totalGoals = (matches: IPointsMatch[]) => {
  let goalsFavor = 0;
  let goalsOwn = 0;
  matches.forEach((match) => {
    goalsFavor += match.homeTeamGoals;
    goalsOwn += match.awayTeamGoals;
  });
  return { goalsFavor, goalsOwn };
};

const totalResultMatch = (matches: IPointsMatch[]) => {
  let [totalVictories, totalDraws, totalLosses] = [0, 0, 0, 0];
  matches.forEach((match) => {
    switch (match.result) {
      case 'vitory':
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

// const orderTeamsByGoalsOwn = (resultTeam: IResultTeam[]) =>
//   resultTeam.sort((team, otherTem) => {
//     if (otherTem.goalsOwn < team.goalsOwn) {
//       return 1;
//     } if (otherTem.goalsOwn > team.goalsOwn) {
//       return -1;
//     }
//     return 0;
//   });

// const orderTeamsByGoalsFavor = (resultTeam: IResultTeam[]) =>
//   resultTeam.sort((team, otherTem) => {
//     if (otherTem.goalsFavor > team.goalsFavor) {
//       return 1;
//     } if (otherTem.goalsFavor < team.goalsFavor) {
//       return -1;
//     } if (otherTem.goalsFavor === team.goalsFavor) {
//       orderTeamsByGoalsOwn(resultTeam);
//     }
//     return 0;
//   });

// const orderTeamsByGoalsBalance = (resultTeam: IResultTeam[]) =>
//   resultTeam.sort((team, otherTem) => {
//     if (otherTem.goalsBalance < team.goalsBalance) {
//       return 1;
//     } if (otherTem.goalsBalance > team.goalsBalance) {
//       return -1;
//     } if (otherTem.goalsBalance === team.goalsBalance) {
//       orderTeamsByGoalsFavor(resultTeam);
//     }
//     return 0;
//   });

// const orderTeamsByVictories = (resultTeam: IResultTeam[]) =>
//   resultTeam.sort((team, otherTem) => {
//     if (otherTem.totalVictories > team.totalVictories) {
//       return 1;
//     } if (otherTem.totalVictories < team.totalVictories) {
//       return -1;
//     } if (otherTem.totalVictories === team.totalVictories) {
//       orderTeamsByGoalsBalance(resultTeam);
//     }
//     return 0;
//   });

// const orderTeamsByPoints = (resultTeam: IResultTeam[]) =>
//   resultTeam.sort((team, otherTem) => {
//     if (otherTem.totalPoints > team.totalPoints) {
//       return 1;
//     } if (otherTem.totalPoints < team.totalPoints) {
//       return -1;
//     } if (otherTem.totalPoints === team.totalPoints) {
//       orderTeamsByVictories(resultTeam);
//     }
//     return 0;
//   });

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
        const resultMatches = verifyVitory(matches);
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
}
