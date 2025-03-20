
/**
 * Returns the full webhook URL for a service based on a token
 * @param token - The unique token part of the webhook URL
 * @returns Full webhook URL including domain 
 */
export const getFullWebhookUrl = (token: string): string => {
  // Check if token already contains the full URL
  if (token.includes('http')) {
    return token;
  }
  
  // Ensure the token is clean (no slashes)
  const cleanToken = token.replace(/^\/+|\/+$/g, '');
  
  // Build the full URL
  return `${window.location.origin}/api/webhook/${cleanToken}`;
};

/**
 * Parses a webhook URL to extract the token part
 * @param url - The full webhook URL
 * @returns The token part of the URL
 */
export const parseWebhookToken = (url: string): string | null => {
  if (!url) return null;
  
  try {
    // Try to parse as a URL first
    const urlObj = new URL(url);
    // Extract token from the end of the pathname
    const pathParts = urlObj.pathname.split('/');
    return pathParts[pathParts.length - 1] || null;
  } catch (e) {
    // If not a valid URL, try extracting from string directly
    const parts = url.split('/');
    return parts[parts.length - 1] || null;
  }
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
    'fireflies': 'Fireflies.ai',
    'zapier': 'Zapier',
    'make': 'Make.com'
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

/**
 * Tests a Zapier webhook connection
 * @param webhookUrl - The Zapier webhook URL
 * @returns A promise that resolves if the webhook is successfully triggered
 */
export const testZapierWebhook = async (webhookUrl: string): Promise<Response> => {
  if (!webhookUrl) {
    throw new Error("Webhook URL is required");
  }
  
  return fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "no-cors", // Handle CORS for external services
    body: JSON.stringify({
      event: "test_connection",
      timestamp: new Date().toISOString(),
      source: "content_platform_webhook_settings",
      data: {
        message: "This is a test connection from your content platform"
      }
    }),
  });
};

/**
 * Tests a Make.com webhook connection
 * @param webhookUrl - The Make.com webhook URL
 * @returns A promise that resolves if the webhook is successfully triggered
 */
export const testMakeWebhook = async (webhookUrl: string): Promise<Response> => {
  if (!webhookUrl) {
    throw new Error("Webhook URL is required");
  }
  
  return fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "no-cors", // Handle CORS for external services
    body: JSON.stringify({
      event: "test_connection",
      timestamp: new Date().toISOString(),
      source: "content_platform_webhook_settings",
      data: {
        message: "This is a test connection from your content platform"
      }
    }),
  });
};
