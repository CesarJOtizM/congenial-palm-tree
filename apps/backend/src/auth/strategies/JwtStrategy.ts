import { PrismaService } from '@database/prisma.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    this.logger.log(`Validating JWT payload for user: ${payload.sub}`);

    try {
      // Check if user exists and is active
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          fullName: true,
          isActive: true,
        },
      });

      if (!user) {
        this.logger.warn(`User not found for JWT payload: ${payload.sub}`);
        throw new UnauthorizedException('User not found');
      }

      if (!user.isActive) {
        this.logger.warn(`Inactive user attempting to access: ${payload.sub}`);
        throw new UnauthorizedException('User account is inactive');
      }

      this.logger.log(`JWT validation successful for user: ${payload.sub}`);

      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        isActive: user.isActive,
      };
    } catch (error) {
      this.logger.error(
        `JWT validation failed for user: ${payload.sub}`,
        error
      );
      throw new UnauthorizedException('Invalid token');
    }
  }
}
