import { Router } from 'express';
import LeaderboardController from '../controllers/leaderboardController';

const routerLeaderboard = Router();
const leaderboardController = new LeaderboardController();

routerLeaderboard.get('/', (req, res) => leaderboardController.getAllByGeral(req, res));
routerLeaderboard.get('/home', (req, res) => leaderboardController.getAll(req, res));
routerLeaderboard.get('/away', (req, res) => leaderboardController.getAllByAway(req, res));

export default routerLeaderboard;
