import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../database/prisma.service';

import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { UserResponseDto } from './dto/UserResponse.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new user
   */
  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.log(`Creating user with email: ${createUserDto.email}`);

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      this.logger.warn(`User with email ${createUserDto.email} already exists`);
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds
    );

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        fullName: createUserDto.fullName,
      },
    });

    this.logger.log(`User created successfully with ID: ${user.id}`);

    return this.mapToUserResponse(user);
  }

  /**
   * Find user by ID
   */
  async findUserById(id: string): Promise<UserResponseDto> {
    this.logger.log(`Finding user by ID: ${id}`);

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException('User not found');
    }

    return this.mapToUserResponse(user);
  }

  /**
   * Find user by email
   */
  async findUserByEmail(email: string): Promise<UserResponseDto | null> {
    this.logger.log(`Finding user by email: ${email}`);

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? this.mapToUserResponse(user) : null;
  }

  /**
   * Find user by email for authentication (includes password)
   */
  async findUserByEmailForAuth(email: string) {
    this.logger.log(`Finding user by email for auth: ${email}`);

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  /**
   * Update user
   */
  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    this.logger.log(`Updating user with ID: ${id}`);

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      this.logger.warn(`User with ID ${id} not found for update`);
      throw new NotFoundException('User not found');
    }

    // Check if email is being changed and if it's already taken
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (emailExists) {
        this.logger.warn(`Email ${updateUserDto.email} is already taken`);
        throw new ConflictException('Email is already taken');
      }
    }

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    this.logger.log(`User updated successfully with ID: ${id}`);

    return this.mapToUserResponse(updatedUser);
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    this.logger.log(`Deleting user with ID: ${id}`);

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      this.logger.warn(`User with ID ${id} not found for deletion`);
      throw new NotFoundException('User not found');
    }

    // Check if user has active debts
    const activeDebts = await this.prisma.debt.findMany({
      where: {
        OR: [
          { creditorId: id, isPaid: false },
          { debtorId: id, isPaid: false },
        ],
      },
    });

    if (activeDebts.length > 0) {
      this.logger.warn(`Cannot delete user ${id} with active debts`);
      throw new BadRequestException('Cannot delete user with active debts');
    }

    // Delete user
    await this.prisma.user.delete({
      where: { id },
    });

    this.logger.log(`User deleted successfully with ID: ${id}`);
  }

  /**
   * Get all users with pagination
   */
  async getAllUsers(page: number = 1, limit: number = 10, search?: string) {
    this.logger.log(
      `Getting users - page: ${page}, limit: ${limit}, search: ${search}`
    );

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { fullName: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          fullName: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users: users.map(user => this.mapToUserResponse(user)),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Update user refresh token
   */
  async updateRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    this.logger.log(`Updating refresh token for user: ${userId}`);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  /**
   * Remove user refresh token
   */
  async removeRefreshToken(userId: string): Promise<void> {
    this.logger.log(`Removing refresh token for user: ${userId}`);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  /**
   * Map Prisma user to UserResponseDto
   */
  private mapToUserResponse(user: {
    id: string;
    email: string;
    fullName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
