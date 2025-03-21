
import { renderHook, act } from '@testing-library/react';
import { useErrorHandling } from '@/hooks/useErrorHandling';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth';
import { createMockSupabaseUser } from '../utils/tenant-test-utils';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn()
  }
}));

vi.mock('@/context/auth', () => ({
  useAuth: vi.fn()
}));

const mockToast = vi.mocked(toast);
const mockUseAuth = vi.mocked(useAuth);

describe('useErrorHandling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
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
  });

  it('should handle error objects correctly', () => {
    const { result } = renderHook(() => useErrorHandling('TestComponent'));
    const testError = new Error('Test error message');
    
    // Test handling an Error object
    result.current.handleError(testError, 'testing error handling');
    
    // Check that toast.error was called with the appropriate message
    expect(mockToast.error).toHaveBeenCalledWith('testing error handling failed: Test error message');
    
    // Check that the error was stored
    expect(result.current.lastError).toBe(testError);
  });

  it('should handle string errors correctly', () => {
    const { result } = renderHook(() => useErrorHandling('TestComponent'));
    
    // Test handling a string error
    result.current.handleError('String error message', 'operation', 'warning');
    
    // Check that toast.warning was called with the correct message
    expect(mockToast.warning).toHaveBeenCalledWith('String error message');
  });

  it('should include tenant ID in error metadata', () => {
    // Create a spy on console.error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const { result } = renderHook(() => useErrorHandling('TestComponent'));
    const testError = new Error('Test error');
    
    result.current.handleError(testError, 'testing tenant metadata');
    
    // Check that the tenant ID was included in the console error call
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy.mock.calls[0][2]).toHaveProperty('tenantId', 'example.com');
    
    consoleErrorSpy.mockRestore();
  });

  it('should wrap async functions with error handling', async () => {
    const { result } = renderHook(() => useErrorHandling('TestComponent'));
    const successFn = vi.fn().mockResolvedValue('success result');
    const failureFn = vi.fn().mockRejectedValue(new Error('Async error'));
    
    // Test successful function
    const wrappedSuccess = result.current.withErrorHandling(successFn, 'async operation');
    const successResult = await wrappedSuccess('arg1', 'arg2');
    
    expect(successFn).toHaveBeenCalledWith('arg1', 'arg2');
    expect(successResult).toBe('success result');
    
    // Test function that throws
    const wrappedFailure = result.current.withErrorHandling(failureFn, 'failing operation');
    const failureResult = await wrappedFailure('arg1');
    
    expect(failureFn).toHaveBeenCalledWith('arg1');
    expect(failureResult).toBeUndefined();
    expect(mockToast.error).toHaveBeenCalledWith('failing operation failed: Async error');
  });
});
