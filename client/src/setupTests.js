
import "@testing-library/jest-dom";

// Mock IntersectionObserver because Jest does not provide it by default.
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe() {}

  unobserve() {}

  disconnect() {}
};
