
/**
 * Returns the full webhook URL for a service based on a token
 * @param token - The unique token part of the webhook URL
 * @returns Full webhook URL including domain 
 */
export const getFullWebhookUrl = (token: string): string => {
  // Ensure the URL has the /api/webhook/ path prefix
  return `${window.location.origin}/api/webhook/${token}`;
};

/**
 * Parses a webhook URL to extract the token part
 * @param url - The full webhook URL
 * @returns The token part of the URL
 */
export const parseWebhookToken = (url: string): string | null => {
  // Extract token from the end of the URL
  const parts = url.split('/');
  return parts[parts.length - 1] || null;
};

/**
 * Format a webhook service name for display
 * @param serviceName - The internal service name
 * @returns Formatted service name for display
 */
export const formatServiceName = (serviceName: string): string => {
  const names: Record<string, string> = {
    'otter': 'Otter.ai',
    'fathom': 'Fathom',
    'read': 'Read.AI',
    'fireflies': 'Fireflies.ai'
  };
  
  return names[serviceName] || serviceName;
};

/**
 * Generates a cryptographically secure token for webhooks
 * @returns A secure random token
 */
export const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Validates that a webhook token meets security requirements
 * @param token - The token to validate
 * @returns Whether the token is valid
 */
export const isValidToken = (token: string): boolean => {
  // Token should be at least 32 characters long and contain only hexadecimal characters
  return /^[0-9a-f]{32,}$/i.test(token);
};
