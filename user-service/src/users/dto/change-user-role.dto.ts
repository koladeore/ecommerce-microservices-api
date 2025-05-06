import { IsEnum } from 'class-validator';
import { UserRole } from './create-user.dto';

export class ChangeUserRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}
