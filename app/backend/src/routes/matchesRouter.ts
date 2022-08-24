import { Router } from 'express';
import MatchesController from '../controllers/matchesController';

const routerMatches = Router();
const matchesController = new MatchesController();

routerMatches.get('/', (req, res) => matchesController.getAll(req, res));
routerMatches.post('/', (req, res) => matchesController.create(req, res));
routerMatches.patch('/:id', (req, res) => matchesController.update(req, res));
routerMatches.patch('/:id/finish', (req, res) => matchesController.finishProgress(req, res));

export default routerMatches;
