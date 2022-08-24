import { Request, Response } from 'express';
import LoginService from '../services/loginService';

export default class LoginController {
  loginService = LoginService;

  async login(req: Request, res: Response): Promise<void> {
    const { code, data } = await this.loginService.login(req.body);
    res.status(code).json(data);
  }

  async validate(req: Request, res: Response): Promise<void> {
    if (!req.headers.authorization) {
      res.status(404).json({ message: 'Not found token authorization' });
    }
    const role = await this.loginService.validate(req.headers.authorization as string);
    res.json({ role });
  }
}
