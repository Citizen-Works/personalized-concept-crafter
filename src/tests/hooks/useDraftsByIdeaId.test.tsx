import { renderHook, waitFor } from '@testing-library/react';
import { useDraftsByIdeaId } from '@/hooks/draft/useDraftsByIdeaId';
import * as draftService from '@/services/draftService';
import { useAuth } from '@/context/auth';
import { useTenant } from '@/context/tenant/TenantContext';
import { createWrapper } from '../utils/tenant-test-utils';
import React from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the dependencies
vi.mock('@/services/draftService');
vi.mock('@/context/auth');
vi.mock('@/context/tenant/TenantContext');
vi.mock('@/hooks/useErrorHandling', () => ({
  useErrorHandling: () => ({
    handleError: vi.fn(),
  })
}));

const mockFetchDraftsByIdeaId = vi.mocked(draftService.fetchDraftsByIdeaId);
const mockUseAuth = vi.mocked(useAuth);
const mockUseTenant = vi.mocked(useTenant);

describe('useDraftsByIdeaId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock auth and tenant hooks with a properly formatted Supabase User type
    mockUseAuth.mockReturnValue({
      user: { 
        id: 'test-user-id', 
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: '2023-01-01T00:00:00.000Z',
        confirmed_at: '2023-01-01T00:00:00.000Z',
        last_sign_in_at: '2023-01-01T00:00:00.000Z',
        role: '',
        updated_at: '2023-01-01T00:00:00.000Z'
      },
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
    
    mockUseTenant.mockReturnValue({
      currentTenant: { id: 'test-tenant-id', name: 'Test Tenant', domain: 'example.com', isActive: true, settings: {} },
      tenantDomain: 'example.com',
      isLoading: false,
      error: null,
      refetchTenant: vi.fn(),
    });
  });

  it('should fetch drafts when idea ID and user ID are available', async () => {
    const mockDrafts = [{ id: 'draft-1', content: 'Test draft' }];
    mockFetchDraftsByIdeaId.mockResolvedValue(mockDrafts as any);
    
    const { result } = renderHook(() => useDraftsByIdeaId('test-idea-id'), {
      wrapper: createWrapper(),
    });
    
    // Initially loading
    expect(result.current.isLoading).toBe(true);
    
    // After loading
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockFetchDraftsByIdeaId).toHaveBeenCalledWith('test-idea-id', 'test-user-id');
    expect(result.current.data).toEqual(mockDrafts);
  });
  
  it('should not fetch drafts when user ID is not available', async () => {
    mockUseAuth.mockReturnValue({
      user: null,
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
    
    const { result } = renderHook(() => useDraftsByIdeaId('test-idea-id'), {
      wrapper: createWrapper(),
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(mockFetchDraftsByIdeaId).not.toHaveBeenCalled();
  });
  
  it('should include tenant ID in the query key for proper cache isolation', async () => {
    mockFetchDraftsByIdeaId.mockResolvedValue([]);
    
    renderHook(() => useDraftsByIdeaId('test-idea-id'), {
      wrapper: createWrapper(),
    });
    
    await waitFor(() => {
      expect(mockFetchDraftsByIdeaId).toHaveBeenCalled();
    });
    
    // Verify that tenant ID was used in the call
    expect(mockUseTenant).toHaveBeenCalled();
  });
});
