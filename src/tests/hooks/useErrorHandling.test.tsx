
import { renderHook, act } from '@testing-library/react';
import { useErrorHandling } from '@/hooks/useErrorHandling';
import { toast } from 'sonner';

// Mock the toast library
jest.mock('sonner', () => ({
  error: jest.fn(),
  warning: jest.fn(),
  info: jest.fn(),
}));

// Mock console.error to prevent test noise
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe('useErrorHandling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle errors with the correct severity', () => {
    const { result } = renderHook(() => useErrorHandling('TestComponent'));
    
    // Test error severity
    act(() => {
      result.current.handleError(new Error('Test error'), 'test action', 'error');
    });
    expect(toast.error).toHaveBeenCalledWith('test action failed: Test error');
    
    // Test warning severity
    act(() => {
      result.current.handleError(new Error('Test warning'), 'test warning', 'warning');
    });
    expect(toast.warning).toHaveBeenCalledWith('Test warning');
    
    // Test info severity
    act(() => {
      result.current.handleError(new Error('Test info'), 'test info', 'info');
    });
    expect(toast.info).toHaveBeenCalledWith('Test info');
  });

  it('should wrap async functions with error handling', async () => {
    const { result } = renderHook(() => useErrorHandling('TestComponent'));
    
    const successFn = jest.fn().mockResolvedValue('success');
    const failureFn = jest.fn().mockRejectedValue(new Error('Async error'));
    
    // Test successful function
    const wrappedSuccess = result.current.withErrorHandling(successFn, 'success action');
    await expect(wrappedSuccess()).resolves.toBe('success');
    expect(successFn).toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
    
    // Test failing function
    const wrappedFailure = result.current.withErrorHandling(failureFn, 'failure action');
    await expect(wrappedFailure()).resolves.toBeUndefined();
    expect(failureFn).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('failure action failed: Async error');
  });

  it('should store and clear the last error', () => {
    const { result } = renderHook(() => useErrorHandling('TestComponent'));
    const testError = new Error('Test last error');
    
    act(() => {
      result.current.handleError(testError, 'test action');
    });
    expect(result.current.lastError).toBe(testError);
    
    act(() => {
      result.current.clearLastError();
    });
    expect(result.current.lastError).toBeNull();
  });
});
