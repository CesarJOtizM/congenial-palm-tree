import { CurrentUser } from '@auth/decorators/CurrentUser.decorator';
import { JwtAuthGuard } from '@auth/guards/JwtAuth.guard';
import { BaseResponseDto } from '@common/dto/BaseResponse.dto';
import { IUser } from '@common/interfaces/User.interface';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { UserResponseDto } from './dto/UserResponse.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: BaseResponseDto<UserResponseDto>,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - User already exists',
  })
  async createUser(
    @Body() createUserDto: CreateUserDto
  ): Promise<BaseResponseDto<UserResponseDto>> {
    const user = await this.usersService.createUser(createUserDto);
    return BaseResponseDto.success('User created successfully', user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async getAllUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string
  ) {
    const result = await this.usersService.getAllUsers(page, limit, search);
    return BaseResponseDto.success('Users retrieved successfully', result);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: BaseResponseDto<UserResponseDto>,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUserById(
    @Param('id') id: string
  ): Promise<BaseResponseDto<UserResponseDto>> {
    const user = await this.usersService.findUserById(id);
    return BaseResponseDto.success('User retrieved successfully', user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: BaseResponseDto<UserResponseDto>,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Email already taken',
  })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: IUser
  ): Promise<BaseResponseDto<UserResponseDto>> {
    // Only allow users to update their own profile or admin check could be added here
    if (currentUser.id !== id) {
      return BaseResponseDto.error('You can only update your own profile');
    }

    const user = await this.usersService.updateUser(id, updateUserDto);
    return BaseResponseDto.success('User updated successfully', user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - User has active debts',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async deleteUser(
    @Param('id') id: string,
    @CurrentUser() currentUser: IUser
  ): Promise<BaseResponseDto<void>> {
    // Only allow users to delete their own profile or admin check could be added here
    if (currentUser.id !== id) {
      return BaseResponseDto.error('You can only delete your own profile');
    }

    await this.usersService.deleteUser(id);
    return BaseResponseDto.success('User deleted successfully');
  }

  @Get('profile/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    type: BaseResponseDto<UserResponseDto>,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async getCurrentUserProfile(
    @CurrentUser() currentUser: IUser
  ): Promise<BaseResponseDto<UserResponseDto>> {
    const user = await this.usersService.findUserById(currentUser.id);
    return BaseResponseDto.success('Profile retrieved successfully', user);
  }
}
