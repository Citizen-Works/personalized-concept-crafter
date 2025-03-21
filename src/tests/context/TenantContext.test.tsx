
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTenant, TenantProvider } from '@/context/tenant/TenantContext';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { createWrapper, createMockSupabaseUser } from '../utils/tenant-test-utils';
import React from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the dependencies
vi.mock('@/context/auth');
vi.mock('@/integrations/supabase/client');

const mockUseAuth = vi.mocked(useAuth);
const mockSupabase = vi.mocked(supabase);

describe('TenantContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock auth hook with a test user
    mockUseAuth.mockReturnValue({
      user: createMockSupabaseUser({ email: 'user@example.com' }),
      session: null,
      loading: false,
      isAdmin: false,
      signIn: vi.fn(),
      signInWithGoogle: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      logout: vi.fn(),
      refreshAdminStatus: vi.fn(),
    });
    
    // Mock Supabase response for tenant fetching
    mockSupabase.from = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: {
              id: 'test-tenant-id',
              name: 'Test Tenant',
              domain: 'example.com',
              is_active: true,
              settings: {}
            },
            error: null
          })
        })
      })
    } as any);
  });

  it('should fetch tenant info based on user email domain', async () => {
    const { result } = renderHook(() => useTenant(), {
      wrapper: ({ children }) => (
        <TenantProvider>{children}</TenantProvider>
      )
    });
    
    // Initially loading
    expect(result.current.isLoading).toBe(true);
    
    // Wait for tenant data to be loaded
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Check extracted domain from email
    expect(result.current.tenantDomain).toBe('example.com');
    
    // Check tenant data
    expect(result.current.currentTenant).toEqual({
      id: 'test-tenant-id',
      name: 'Test Tenant',
      domain: 'example.com',
      isActive: true,
      settings: {}
    });
    
    // Verify Supabase was called with correct parameters
    expect(mockSupabase.from).toHaveBeenCalledWith('tenants');
    expect(mockSupabase.from('tenants').select).toHaveBeenCalled();
  });

  it('should handle user without email', async () => {
    // Mock auth hook with a user without email
    mockUseAuth.mockReturnValue({
      user: createMockSupabaseUser({ email: undefined }),
      session: null,
      loading: false,
      isAdmin: false,
      signIn: vi.fn(),
      signInWithGoogle: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      logout: vi.fn(),
      refreshAdminStatus: vi.fn(),
    });
    
    const { result } = renderHook(() => useTenant(), {
      wrapper: ({ children }) => (
        <TenantProvider>{children}</TenantProvider>
      )
    });
    
    // Wait for tenant data loading to complete
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Should have no tenant if user has no email
    expect(result.current.tenantDomain).toBeNull();
    expect(result.current.currentTenant).toBeNull();
  });
});
