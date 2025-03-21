
export const CLAUDE_API_KEY = Deno.env.get('CLAUDE_API_KEY');
export const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
export const MODEL_NAME = 'claude-3-opus-20240229';
export const MAX_TOKENS = 4000;
export const DEFAULT_TEMPERATURE = 0.7;
export const IDEAS_TEMPERATURE = 0.9; // Higher temperature for more creative idea generation

// CORS headers for Edge Function
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
