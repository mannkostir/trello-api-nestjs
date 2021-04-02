import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  mixin,
} from '@nestjs/common';
import { Request } from 'express';
import { RequestWithUser } from 'src/auth/interfaces/requestWithUsers.interface';

@Injectable()
export class UserAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as RequestWithUser;

    if (+request.params?.userId !== request.user.id) {
      throw new ForbiddenException();
    }

    return true;
  }
}
