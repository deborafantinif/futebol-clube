import { compareSync } from 'bcryptjs';
// import 'dotenv/config';
// import { JwtPayload, sign, verify } from 'jsonwebtoken';
import Users from '../database/models/users';
import JwtService from './jwtService';

export interface ILoginResponse {
  code: number
  data: object
}

export default class LoginService {
  static async login({ email, password }: any): Promise<ILoginResponse> {
    if (!email || !password) return { code: 400, data: { message: 'All fields must be filled' } };
    const user = await Users.findOne({ where: { email } });
    if (!user) return { code: 401, data: { message: 'Incorrect email or password' } };

    const isCorrectPassword = compareSync(password, user?.password as string);
    if (!isCorrectPassword) {
      return {
        code: 401, data: { message: 'Incorrect email or password' },
      };
    }

    const token = JwtService.sign({ email, id: user.id });
    return { code: 200, data: { token } };
  }

  static async validate(token: string): Promise<string> {
    const tokenUser = JwtService.verify(token);
    const user = await Users.findByPk(tokenUser.id) as Users;
    return user.role;
  }
}
