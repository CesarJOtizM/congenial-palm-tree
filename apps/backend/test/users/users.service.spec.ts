import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@users/users.service';
import { vi } from 'vitest';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UserRepository',
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('service instantiation', () => {
    it('should be defined', () => {
      // Arrange & Act
      const usersService = service;

      // Assert
      expect(usersService).toBeDefined();
    });
  });

  describe('methods existence', () => {
    it('should have createUser method', () => {
      // Arrange & Act
      const hasCreateUserMethod = typeof service.createUser === 'function';

      // Assert
      expect(hasCreateUserMethod).toBe(true);
    });

    it('should have findUserById method', () => {
      // Arrange & Act
      const hasFindUserByIdMethod = typeof service.findUserById === 'function';

      // Assert
      expect(hasFindUserByIdMethod).toBe(true);
    });

    it('should have findUserByEmail method', () => {
      // Arrange & Act
      const hasFindUserByEmailMethod =
        typeof service.findUserByEmail === 'function';

      // Assert
      expect(hasFindUserByEmailMethod).toBe(true);
    });

    it('should have findUserByEmailForAuth method', () => {
      // Arrange & Act
      const hasFindUserByEmailForAuthMethod =
        typeof service.findUserByEmailForAuth === 'function';

      // Assert
      expect(hasFindUserByEmailForAuthMethod).toBe(true);
    });

    it('should have updateUser method', () => {
      // Arrange & Act
      const hasUpdateUserMethod = typeof service.updateUser === 'function';

      // Assert
      expect(hasUpdateUserMethod).toBe(true);
    });

    it('should have updateRefreshToken method', () => {
      // Arrange & Act
      const hasUpdateRefreshTokenMethod =
        typeof service.updateRefreshToken === 'function';

      // Assert
      expect(hasUpdateRefreshTokenMethod).toBe(true);
    });
  });
});
