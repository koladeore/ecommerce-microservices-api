import { UserRole } from '../users/dto/create-user.dto';

export interface JwtPayloadUser {
  userId: number | string;
  email: string;
  role: UserRole;
}
