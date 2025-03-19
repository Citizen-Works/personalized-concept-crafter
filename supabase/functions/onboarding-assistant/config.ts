
// API configuration and constants
export const CLAUDE_API_KEY = Deno.env.get('CLAUDE_API_KEY');
export const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
export const MODEL_NAME = "claude-3-sonnet-20240229";
export const MAX_TOKENS = 4000;

// CORS headers for cross-origin requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation function for required configuration
export function validateConfig() {
  if (!CLAUDE_API_KEY) {
    throw new Error('CLAUDE_API_KEY is not set');
  }
}
