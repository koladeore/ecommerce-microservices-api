import { UserRole } from '../users/dto/create-user.dto';

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}
