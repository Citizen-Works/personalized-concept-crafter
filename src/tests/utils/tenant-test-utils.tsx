
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { User } from '@supabase/supabase-js';

/**
 * Creates a wrapper with the necessary providers for testing components
 * that use react-query hooks.
 */
export function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  // Return a function that wraps the children with the necessary providers
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

/**
 * Creates a mock Supabase user object for testing
 */
export function createMockSupabaseUser(overrides: Partial<User> = {}): User {
  return {
    id: 'test-user-id',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2023-01-01T00:00:00.000Z',
    confirmed_at: '2023-01-01T00:00:00.000Z',
    last_sign_in_at: '2023-01-01T00:00:00.000Z',
    role: '',
    updated_at: '2023-01-01T00:00:00.000Z',
    email: 'test@example.com',
    phone: '',
    ...overrides,
  };
}
