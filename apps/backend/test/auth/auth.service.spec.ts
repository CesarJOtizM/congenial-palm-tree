import { AuthService } from '@auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@users/users.service';
import { vi } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            createUser: vi.fn(),
            findUserByEmailForAuth: vi.fn(),
            updateRefreshToken: vi.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: vi.fn(),
            verify: vi.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('service instantiation', () => {
    it('should be defined', () => {
      // Arrange & Act
      const authService = service;

      // Assert
      expect(authService).toBeDefined();
    });

    it('should have required dependencies', () => {
      // Arrange & Act
      const hasUsersService = !!usersService;
      const hasJwtService = !!jwtService;
      const hasConfigService = !!configService;

      // Assert
      expect(hasUsersService).toBe(true);
      expect(hasJwtService).toBe(true);
      expect(hasConfigService).toBe(true);
    });
  });

  describe('register method', () => {
    it('should have register method', () => {
      // Arrange & Act
      const hasRegisterMethod = typeof service.register === 'function';

      // Assert
      expect(hasRegisterMethod).toBe(true);
    });
  });

  describe('login method', () => {
    it('should have login method', () => {
      // Arrange & Act
      const hasLoginMethod = typeof service.login === 'function';

      // Assert
      expect(hasLoginMethod).toBe(true);
    });
  });

  describe('refreshToken method', () => {
    it('should have refreshToken method', () => {
      // Arrange & Act
      const hasRefreshTokenMethod = typeof service.refreshToken === 'function';

      // Assert
      expect(hasRefreshTokenMethod).toBe(true);
    });
  });
});
