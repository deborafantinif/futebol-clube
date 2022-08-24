import { Router } from 'express';
import TeamsController from '../controllers/teamsController';

const routerTeams = Router();
const teamsController = new TeamsController();

routerTeams.get('/', (req, res) => teamsController.getAll(req, res));

export default routerTeams;
