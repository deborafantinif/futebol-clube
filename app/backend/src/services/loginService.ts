import { compare } from 'bcryptjs';
import 'dotenv/config';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import Users from '../database/models/users';

export interface ILoginService {
  login({ email, password }: any): Promise<ILoginResponse>
}

export interface ILoginResponse {
  code: number
  data: object
}

export default class LoginService {
  static async login({ email, password }: any): Promise<ILoginResponse> {
    if (!email || !password) return { code: 400, data: { message: 'All fields must be filled' } };
    const user = await Users.findOne({ where: { email } });
    const isCorrectPassword = await compare(password, user?.password as string);
    if (!user || isCorrectPassword) {
      return {
        code: 401, data: { message: 'Incorrect email or password' },
      };
    }
    const token = sign({ email, id: user.id }, process.env.JWT_SECRET as string);
    return { code: 200, data: { token } };
  }

  static async validate(token: string): Promise<string> {
    const tokenUser = verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    const user = await Users.findByPk(tokenUser.id) as Users;
    return user.role;
  }
}
