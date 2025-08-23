import { IUser } from '@common/interfaces/User.interface';
import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  private readonly logger = new Logger(LocalAuthGuard.name);

  canActivate(context: ExecutionContext) {
    this.logger.log('Local Auth Guard - Checking local authentication');
    return super.canActivate(context);
  }

  handleRequest<TUser = IUser>(
    err: Error | null,
    user: TUser | null,
    info: string | null
  ): TUser {
    if (err || user === null) {
      this.logger.warn('Local Auth Guard - Authentication failed', {
        error: err,
        info,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(
      `Local Auth Guard - Authentication successful for user: ${(user as IUser).id}`
    );
    return user;
  }
}
