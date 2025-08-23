import { IUser } from '@common/interfaces/User.interface';
import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    this.logger.log('JWT Auth Guard - Checking authentication');
    return super.canActivate(context);
  }

  handleRequest<TUser = IUser>(
    err: Error | null,
    user: TUser | null,
    info: string | null
  ): TUser {
    if (err || user === null) {
      this.logger.warn('JWT Auth Guard - Authentication failed', {
        error: err,
        info,
      });
      throw new UnauthorizedException('Authentication required');
    }

    this.logger.log(
      `JWT Auth Guard - Authentication successful for user: ${(user as IUser).id}`
    );
    return user;
  }
}
