import { BaseResponseDto } from '@common/dto/BaseResponse.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '@users/dto/CreateUser.dto';

import { IUser, IUserResponse } from '../common/interfaces/User.interface';

import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/CurrentUser.decorator';
import { AuthResponseDto } from './dto/AuthResponse.dto';
import { LoginRequestDto } from './dto/LoginRequest.dto';
import { RefreshTokenDto } from './dto/RefreshToken.dto';
import { JwtAuthGuard } from './guards/JwtAuth.guard';
import { LocalAuthGuard } from './guards/LocalAuth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: BaseResponseDto<AuthResponseDto>,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - User already exists',
  })
  async register(
    @Body() createUserDto: CreateUserDto
  ): Promise<BaseResponseDto<AuthResponseDto>> {
    const result = await this.authService.register(createUserDto);
    return BaseResponseDto.success('User registered successfully', result);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: BaseResponseDto<AuthResponseDto>,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  async login(
    @CurrentUser() user: IUser,
    @Body() loginRequestDto: LoginRequestDto
  ): Promise<BaseResponseDto<AuthResponseDto>> {
    const result = await this.authService.login(loginRequestDto);
    return BaseResponseDto.success('User logged in successfully', result);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: BaseResponseDto<AuthResponseDto>,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid refresh token',
  })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<BaseResponseDto<AuthResponseDto>> {
    const result = await this.authService.refreshToken(refreshTokenDto);
    return BaseResponseDto.success('Token refreshed successfully', result);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async logout(@CurrentUser() user: IUser): Promise<BaseResponseDto<void>> {
    await this.authService.logout(user.id);
    return BaseResponseDto.success('User logged out successfully');
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async getProfile(
    @CurrentUser() user: IUser
  ): Promise<BaseResponseDto<IUserResponse>> {
    return BaseResponseDto.success('Profile retrieved successfully', {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
