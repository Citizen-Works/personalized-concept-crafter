
import '@testing-library/jest-dom';

// Global setup for Vitest tests
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with React Testing Library matchers
expect.extend(matchers);

// Clean up after each test
afterEach(() => {
  cleanup();
});
