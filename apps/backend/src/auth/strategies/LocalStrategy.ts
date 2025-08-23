import { IUser } from '@common/interfaces/User.interface';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '@users/users.service';
import * as bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private readonly usersService: UsersService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<IUser> {
    this.logger.log(`Attempting local authentication for email: ${email}`);

    try {
      const user = await this.usersService.findUserByEmailForAuth(email);

      if (!user) {
        this.logger.warn(
          `Local authentication failed - user not found: ${email}`
        );
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.isActive) {
        this.logger.warn(
          `Local authentication failed - inactive user: ${email}`
        );
        throw new UnauthorizedException('Account is inactive');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        this.logger.warn(
          `Local authentication failed - invalid password: ${email}`
        );
        throw new UnauthorizedException('Invalid credentials');
      }

      this.logger.log(`Local authentication successful for user: ${email}`);

      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      this.logger.error(
        `Local authentication error for email: ${email}`,
        error
      );
      throw error;
    }
  }
}
