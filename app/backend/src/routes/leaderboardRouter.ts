import { Router } from 'express';
import LeaderboardController from '../controllers/leaderboardController';

const routerLeaderboard = Router();
const leaderboardController = new LeaderboardController();

routerLeaderboard.get('/home', (req, res) => leaderboardController.getAll(req, res));
routerLeaderboard.get('/away', (req, res) => leaderboardController.getAll(req, res));

export default routerLeaderboard;
