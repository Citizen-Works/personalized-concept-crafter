
/**
 * Utility functions for application monitoring and metrics
 */

// Store performance metrics
const performanceMetrics: Record<string, number[]> = {};

// Store error counts by type
const errorCounts: Record<string, number> = {};

/**
 * Record a performance metric
 * 
 * @param name The name of the operation being measured
 * @param durationMs The duration of the operation in milliseconds
 * @param metadata Additional metadata about the operation
 */
export const recordPerformanceMetric = (
  name: string, 
  durationMs: number,
  metadata: Record<string, any> = {}
) => {
  if (!performanceMetrics[name]) {
    performanceMetrics[name] = [];
  }
  
  performanceMetrics[name].push(durationMs);
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${durationMs}ms`, metadata);
  }
  
  // In a real implementation, this would send to a monitoring service
};

/**
 * Measure the execution time of a function
 * 
 * @param name Name of the operation being measured
 * @param fn Function to measure
 * @param metadata Additional metadata
 * @returns The result of the function
 */
export async function measurePerformance<T>(
  name: string,
  fn: () => Promise<T>,
  metadata: Record<string, any> = {}
): Promise<T> {
  const start = performance.now();
  try {
    return await fn();
  } finally {
    const duration = performance.now() - start;
    recordPerformanceMetric(name, duration, metadata);
  }
}

/**
 * Record an error for monitoring
 * 
 * @param errorType Type of error
 * @param error The error object
 * @param metadata Additional information about the context
 */
export const recordError = (
  errorType: string,
  error: Error | unknown,
  metadata: Record<string, any> = {}
) => {
  // Increment error count
  errorCounts[errorType] = (errorCounts[errorType] || 0) + 1;
  
  // Log error with metadata
  console.error(`[Error] ${errorType}:`, error, metadata);
  
  // In a real implementation, this would send to an error monitoring service
};

/**
 * Get performance metrics summary
 */
export const getPerformanceMetrics = () => {
  const summary: Record<string, { 
    avg: number; 
    min: number; 
    max: number; 
    count: number;
    p95: number;
  }> = {};
  
  Object.entries(performanceMetrics).forEach(([name, values]) => {
    if (values.length === 0) return;
    
    const sorted = [...values].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    
    summary[name] = {
      avg: sum / values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      count: values.length,
      p95: sorted[Math.floor(sorted.length * 0.95)]
    };
  });
  
  return summary;
};

/**
 * Get error count metrics
 */
export const getErrorMetrics = () => {
  return { ...errorCounts };
};

/**
 * Reset all metrics (useful for testing)
 */
export const resetMetrics = () => {
  Object.keys(performanceMetrics).forEach(key => {
    performanceMetrics[key] = [];
  });
  
  Object.keys(errorCounts).forEach(key => {
    errorCounts[key] = 0;
  });
};
