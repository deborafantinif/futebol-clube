import { Router } from 'express';
import MatchesController from '../controllers/matchesController';

const routerMatches = Router();
const matchesController = new MatchesController();

routerMatches.get('/', (req, res) => matchesController.getAll(req, res));
// routerTeams.get('/:id', (req, res) => teamsController.getById(req, res));

export default routerMatches;
