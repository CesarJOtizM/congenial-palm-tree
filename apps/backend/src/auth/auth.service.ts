import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@users/dto/CreateUser.dto';
import { UsersService } from '@users/users.service';

import { AuthResponseDto } from './dto/AuthResponse.dto';
import { LoginRequestDto } from './dto/LoginRequest.dto';
import { RefreshTokenDto } from './dto/RefreshToken.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Register a new user
   */
  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    this.logger.log(`Registering new user with email: ${createUserDto.email}`);

    const user = await this.usersService.createUser(createUserDto);
    const tokens = await this.generateTokens(user.id, user.email);

    // Update user with refresh token
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

    this.logger.log(`User registered successfully: ${user.id}`);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        isActive: user.isActive,
      },
    };
  }

  /**
   * Login user
   */
  async login(loginRequestDto: LoginRequestDto): Promise<AuthResponseDto> {
    this.logger.log(`Login attempt for email: ${loginRequestDto.email}`);

    const user = await this.usersService.findUserByEmailForAuth(
      loginRequestDto.email
    );

    if (!user) {
      this.logger.warn(
        `Login failed - user not found: ${loginRequestDto.email}`
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      this.logger.warn(
        `Login failed - inactive user: ${loginRequestDto.email}`
      );
      throw new UnauthorizedException('Account is inactive');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    // Update user with refresh token
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

    this.logger.log(`User logged in successfully: ${user.id}`);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        isActive: user.isActive,
      },
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(
    refreshTokenDto: RefreshTokenDto
  ): Promise<AuthResponseDto> {
    this.logger.log('Attempting to refresh access token');

    try {
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const user = await this.usersService.findUserById(payload.sub);

      if (!user.isActive) {
        this.logger.warn(`Token refresh failed - inactive user: ${user.id}`);
        throw new UnauthorizedException('Account is inactive');
      }

      const tokens = await this.generateTokens(user.id, user.email);

      // Update user with new refresh token
      await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

      this.logger.log(
        `Access token refreshed successfully for user: ${user.id}`
      );

      return {
        ...tokens,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          isActive: user.isActive,
        },
      };
    } catch (error) {
      this.logger.error('Token refresh failed', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Logout user
   */
  async logout(userId: string): Promise<void> {
    this.logger.log(`Logging out user: ${userId}`);

    // Remove refresh token
    await this.usersService.removeRefreshToken(userId);

    this.logger.log(`User logged out successfully: ${userId}`);
  }

  /**
   * Validate JWT token
   */
  async validateToken(token: string): Promise<{ sub: string; email: string }> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      return payload;
    } catch (error) {
      this.logger.error('Token validation failed', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Generate JWT tokens
   */
  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const secret = this.configService.get<string>('JWT_SECRET');
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '24h';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret,
        expiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret,
        expiresIn: '7d', // Refresh token expires in 7 days
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.parseExpirationTime(expiresIn),
    };
  }

  /**
   * Parse expiration time to seconds
   */
  private parseExpirationTime(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 86400; // Default to 24 hours
    }

    const value = parseInt(match[1] || '24');
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 3600;
      case 'd':
        return value * 86400;
      default:
        return 86400;
    }
  }
}
