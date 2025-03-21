
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { 
  recordPerformanceMetric, 
  measurePerformance,
  recordError,
  getPerformanceMetrics,
  getErrorMetrics,
  resetMetrics
} from '@/utils/monitoringUtils';

describe('monitoringUtils', () => {
  beforeEach(() => {
    // Reset metrics before each test
    resetMetrics();
    vi.clearAllMocks();
  });

  it('should record and retrieve performance metrics', () => {
    // Record some sample metrics
    recordPerformanceMetric('test-operation', 100);
    recordPerformanceMetric('test-operation', 200);
    recordPerformanceMetric('test-operation', 150);
    
    // Record a different operation
    recordPerformanceMetric('another-operation', 50);
    
    // Get metrics summary
    const metrics = getPerformanceMetrics();
    
    // Check test-operation metrics
    expect(metrics['test-operation']).toEqual({
      avg: 150,
      min: 100,
      max: 200,
      count: 3,
      p95: 200
    });
    
    // Check another-operation metrics
    expect(metrics['another-operation']).toEqual({
      avg: 50,
      min: 50,
      max: 50,
      count: 1,
      p95: 50
    });
  });

  it('should measure performance of async functions', async () => {
    // Create a mock function that takes time
    const mockFn = vi.fn().mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve('result'), 10);
      });
    });
    
    // Measure its performance
    const result = await measurePerformance('async-operation', mockFn);
    
    // Check result
    expect(result).toBe('result');
    expect(mockFn).toHaveBeenCalled();
    
    // Check metrics were recorded
    const metrics = getPerformanceMetrics();
    expect(metrics['async-operation']).toBeDefined();
    expect(metrics['async-operation'].count).toBe(1);
  });

  it('should record and retrieve error metrics', () => {
    // Record some errors
    recordError('api-error', new Error('API failed'));
    recordError('api-error', new Error('Another API error'));
    recordError('validation-error', new Error('Invalid input'));
    
    // Get error metrics
    const errors = getErrorMetrics();
    
    // Check error counts
    expect(errors['api-error']).toBe(2);
    expect(errors['validation-error']).toBe(1);
  });

  it('should reset all metrics', () => {
    // Record some metrics
    recordPerformanceMetric('test-operation', 100);
    recordError('api-error', new Error('API failed'));
    
    // Reset metrics
    resetMetrics();
    
    // Check metrics are empty
    expect(getPerformanceMetrics()).toEqual({});
    expect(getErrorMetrics()).toEqual({});
  });
});
