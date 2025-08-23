import { Test, TestingModule } from '@nestjs/testing';

describe('DebtsService', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [],
    }).compile();
  });

  afterEach(() => {
    // Cleanup after each test
  });

  describe('service', () => {
    it('should have a valid testing module', () => {
      // Arrange & Act
      const testModule = module;

      // Assert
      expect(testModule).toBeDefined();
      expect(typeof testModule.createNestApplication).toBe('function');
    });

    it('should be able to create application', () => {
      // Arrange & Act
      const app = module.createNestApplication();

      // Assert
      expect(app).toBeDefined();
    });
  });
});
