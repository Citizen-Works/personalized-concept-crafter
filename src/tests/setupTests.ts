
// Import jest-dom additions
import '@testing-library/jest-dom';

// Mock the matchMedia function for tests
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {},
    addEventListener: function() {},
    removeEventListener: function() {},
    dispatchEvent: function() {
      return true;
    },
  };
};

// Mock global fetch if needed
global.fetch = jest.fn();
