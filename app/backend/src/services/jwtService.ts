import 'dotenv/config';
import { JwtPayload, sign, verify } from 'jsonwebtoken';

export default class JwtService {
  static sign(payload: { id: number, email: string }): string {
    return sign(payload, process.env.JWT_SECRET as string);
  }

  static verify(token: string): JwtPayload {
    return verify(token, process.env.JWT_SECRET as string) as JwtPayload;
  }
}
