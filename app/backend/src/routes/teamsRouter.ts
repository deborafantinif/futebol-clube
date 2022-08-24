import { Router } from 'express';
import TeamsController from '../controllers/teamsController';

const routerTeams = Router();
const teamsController = new TeamsController();

routerTeams.get('/', (req, res) => teamsController.getAll(req, res));
routerTeams.get('/:id', (req, res) => teamsController.getById(req, res));

export default routerTeams;
