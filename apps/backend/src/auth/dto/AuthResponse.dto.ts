import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken!: string;

  @ApiProperty({ description: 'JWT refresh token' })
  refreshToken!: string;

  @ApiProperty({ description: 'Token expiration time in seconds' })
  expiresIn!: number;

  @ApiProperty({ description: 'User information' })
  user!: {
    id: string;
    email: string;
    fullName: string;
    isActive: boolean;
  };
}
