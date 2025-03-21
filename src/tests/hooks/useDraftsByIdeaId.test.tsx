
import { renderHook, waitFor } from '@testing-library/react';
import { useDraftsByIdeaId } from '@/hooks/draft/useDraftsByIdeaId';
import * as draftService from '@/services/draftService';
import { useAuth } from '@/context/auth';
import { useTenant } from '@/context/tenant/TenantContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock the dependencies
jest.mock('@/services/draftService');
jest.mock('@/context/auth');
jest.mock('@/context/tenant/TenantContext');
jest.mock('@/hooks/useErrorHandling', () => ({
  useErrorHandling: () => ({
    handleError: jest.fn(),
  })
}));

const mockFetchDraftsByIdeaId = draftService.fetchDraftsByIdeaId as jest.MockedFunction<typeof draftService.fetchDraftsByIdeaId>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseTenant = useTenant as jest.MockedFunction<typeof useTenant>;

// Create a wrapper with the necessary providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useDraftsByIdeaId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock auth and tenant hooks
    mockUseAuth.mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
      session: null,
      loading: false,
      isAdmin: false,
      signIn: jest.fn(),
      signInWithGoogle: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      logout: jest.fn(),
      refreshAdminStatus: jest.fn(),
    });
    
    mockUseTenant.mockReturnValue({
      currentTenant: { id: 'test-tenant-id', name: 'Test Tenant', domain: 'example.com', isActive: true, settings: {} },
      tenantDomain: 'example.com',
      isLoading: false,
      error: null,
      refetchTenant: jest.fn(),
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
      signIn: jest.fn(),
      signInWithGoogle: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      logout: jest.fn(),
      refreshAdminStatus: jest.fn(),
    });
    
    const { result } = renderHook(() => useDraftsByIdeaId('test-idea-id'), {
      wrapper: createWrapper(),
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(mockFetchDraftsByIdeaId).not.toHaveBeenCalled();
  });
  
  it('should include tenant ID in the query key for proper cache isolation', async () => {
    mockFetchDraftsByIdeaId.mockResolvedValue([]);
    
    const { result } = renderHook(() => useDraftsByIdeaId('test-idea-id'), {
      wrapper: createWrapper(),
    });
    
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // The query key should include the tenant ID for proper cache isolation
    expect(result.current.queryKey).toEqual(["drafts", "idea", "test-idea-id", "test-user-id", "test-tenant-id"]);
  });
});
