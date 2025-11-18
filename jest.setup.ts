import '@testing-library/jest-dom';
import * as React from 'react';

// Suppress act() warnings for async state updates in tests
// These warnings occur when promises resolve and update state,
// but waitFor already properly handles these updates
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('not wrapped in act(...)')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock Next.js Image
jest.mock('next/image', () => {
  const React = require('react');
  return {
    __esModule: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: function MockImage(props: any) {
      // Remove Next.js Image-specific props that regular img doesn't support
      const { fill, priority, sizes, ...imgProps } = props;
      return React.createElement('img', Object.assign({}, imgProps, { alt: 'test image', loading: 'lazy' }));
    },
  };
});

// Mock window.localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Only setup window/localStorage in jsdom environment
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  // Keep window.dispatchEvent for actual event dispatching in tests

  // Clean up localStorage between tests
  beforeEach(() => {
    localStorage.clear();
  });
}

