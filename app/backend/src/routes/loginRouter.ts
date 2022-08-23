import { Router } from 'express';
import LoginController from '../controllers/loginController';

const routerLogin = Router();
const loginController = new LoginController();

routerLogin.post('/', (req, res) => loginController.login(req, res));

export default routerLogin;
