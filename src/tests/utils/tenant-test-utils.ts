
import { vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock tenant data for testing
export const mockTenant = {
  id: 'test-tenant-id',
  name: 'Test Tenant',
  domain: 'example.com',
  isActive: true,
  settings: {}
};

// Create a wrapper with QueryClient provider for testing hooks
export const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {},
    },
  });
};

export const createWrapper = () => {
  const queryClient = createTestQueryClient();
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// Create a properly formatted Supabase User type for testing
export const createMockSupabaseUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2023-01-01T00:00:00.000Z',
  confirmed_at: '2023-01-01T00:00:00.000Z',
  last_sign_in_at: '2023-01-01T00:00:00.000Z',
  role: '',
  updated_at: '2023-01-01T00:00:00.000Z',
  ...overrides
});
