import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayloadUser } from './jwt-payload-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  private matchRoles(roles: string[], userRole: string | undefined): boolean {
    return !!userRole && roles.includes(userRole);
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<{ user: JwtPayloadUser }>();
    const user = request.user;

    if (!user || !user.role) {
      throw new UnauthorizedException('User or user role not found');
    }

    const hasRole = this.matchRoles(requiredRoles, user.role);
    if (!hasRole) {
      throw new UnauthorizedException('User does not have required role');
    }

    return true;
  }
}
