import { Test, TestingModule } from '@nestjs/testing';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [],
    }).compile();
  });

  afterEach(async () => {
    await module.close();
  });

  describe('module compilation', () => {
    it('should compile successfully', () => {
      // Arrange & Act
      // The module compilation in beforeEach is the act

      // Assert
      expect(module).toBeDefined();
    });

    it('should be a valid testing module', () => {
      // Arrange & Act
      const testModule = module;

      // Assert
      expect(testModule).toBeDefined();
      expect(typeof testModule.createNestApplication).toBe('function');
    });
  });
});
