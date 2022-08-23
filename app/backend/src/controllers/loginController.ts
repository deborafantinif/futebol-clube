import { Request, Response } from 'express';
import LoginService from '../services/loginService';

export default class LoginController {
  // constructor(private loginService: LoginService) {}

  loginService = LoginService;
  async login(req: Request, res: Response): Promise<void> {
    const { code, data } = await this.loginService.login(req.body);
    res.status(code).json(data);
  }
}
