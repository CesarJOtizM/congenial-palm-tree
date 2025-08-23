import { vi } from 'vitest';

// Mock global functions that might not be available in test environment
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: vi.fn(),
  // debug: vi.fn(),
  // info: vi.fn(),
  // warn: vi.fn(),
  // error: vi.fn(),
};

// Mock process.env if needed
process.env.NODE_ENV = 'test';

// Global test setup
beforeAll(() => {
  // Setup any global test configuration
});

afterAll(() => {
  // Cleanup any global test configuration
});

// Global beforeEach setup
beforeEach(() => {
  // Reset mocks before each test
  vi.clearAllMocks();
});

// Global afterEach setup
afterEach(() => {
  // Cleanup after each test
});
