// import { compare } from 'bcryptjs';
import 'dotenv/config';
import { sign } from 'jsonwebtoken';
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
    // const isCorrectPassword = await compare(password, user?.password as string);
    if (!user) return { code: 404, data: { message: 'User not found' } };
    const token = sign({ email, id: user.id }, process.env.JWT_SECRET as string);
    return { code: 200, data: { token } };
  }
}
