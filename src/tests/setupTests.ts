
// Import jest-dom additions
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock the matchMedia function for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});

// Mock global fetch
global.fetch = vi.fn();

// Add any additional test setup here

