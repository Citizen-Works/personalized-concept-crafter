
# Working with Edge Functions

This guide explains how to work with Supabase Edge Functions in the Content Engine.

## Edge Functions Overview

The Content Engine uses Supabase Edge Functions for serverless processing that requires:

1. External API access (Claude AI, transcription services)
2. Intensive processing outside the client
3. Secure handling of API keys and sensitive operations

## Current Edge Functions

The system uses several edge functions:

1. **generate-with-claude**: Generates content using Claude AI
2. **onboarding-assistant**: Powers the interactive onboarding experience
3. **process-document**: Processes documents and extracts content ideas
4. **transcribe-audio**: Handles audio transcription

## Edge Function Architecture

Each edge function follows a similar structure:

- `index.ts`: Entry point that handles requests
- `handler.ts`: Core business logic
- `config.ts`: Configuration and constants
- Service-specific files: Integration with external APIs

## Developing Edge Functions

### Local Development

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Start local development:
   ```bash
   supabase functions serve --env-file .env.local
   ```

3. Test your function:
   ```bash
   curl -i --location --request POST 'http://localhost:54321/functions/v1/your-function' \
   --header 'Authorization: Bearer your-anon-key' \
   --header 'Content-Type: application/json' \
   --data '{"param1": "value1"}'
   ```

### Creating a New Edge Function

1. Create a new function:
   ```bash
   supabase functions new my-new-function
   ```

2. Implement the function:
   ```typescript
   // supabase/functions/my-new-function/index.ts
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
   import { corsHeaders } from "./config.ts";
   
   serve(async (req) => {
     // Handle CORS
     if (req.method === 'OPTIONS') {
       return new Response(null, { headers: corsHeaders });
     }
     
     try {
       const { param1 } = await req.json();
       
       // Your function logic here
       const result = { processed: param1 };
       
       return new Response(
         JSON.stringify(result),
         { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     } catch (error) {
       return new Response(
         JSON.stringify({ error: error.message }),
         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
   });
   ```

3. Create supporting files:
   - `config.ts` for configuration
   - `handler.ts` for core logic
   - Service files for external integrations

### Connecting to External APIs

To connect to external APIs (like Claude):

```typescript
// Example claude integration
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': Deno.env.get('CLAUDE_API_KEY'),
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: "claude-3-opus-20240229",
    max_tokens: 4000,
    messages: [
      { role: "user", content: prompt }
    ]
  })
});
```

### Error Handling

Implement proper error handling:

```typescript
try {
  // Function logic
} catch (error) {
  console.error(`[${requestId}] Error:`, error);
  return new Response(
    JSON.stringify({ 
      error: error.message || 'Unknown error',
      requestId,
      timestamp: new Date().toISOString()
    }),
    { 
      status: error.status || 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}
```

### Calling Edge Functions from the Frontend

Use the Supabase client to invoke functions:

```typescript
// src/services/myService.ts
import { supabase } from '@/integrations/supabase/client';

export async function callMyFunction(data: MyFunctionData): Promise<MyFunctionResult> {
  const { data: result, error } = await supabase.functions.invoke('my-new-function', {
    body: JSON.stringify(data)
  });
  
  if (error) {
    console.error('Error calling my-new-function:', error);
    throw new Error(error.message || 'Failed to process request');
  }
  
  return result;
}
```

## Deploying Edge Functions

1. Deploy to Supabase:
   ```bash
   supabase functions deploy my-new-function
   ```

2. Set environment variables:
   ```bash
   supabase secrets set MY_API_KEY=your-api-key
   ```

## Best Practices

- Keep functions focused on a single responsibility
- Implement CORS handling for all functions
- Use structured error responses
- Log key events and errors with request IDs
- Validate input data before processing
- Handle timeouts gracefully (functions have execution limits)
- Store sensitive values as environment secrets
- Document function parameters and return values
- Include proper type definitions for request/response data
