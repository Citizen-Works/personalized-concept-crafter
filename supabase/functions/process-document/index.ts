import { serve, createClient, CORS_HEADERS } from "./deps.ts";
import type { ConnInfo, SupabaseClient } from "./deps.ts";

interface ProcessDocumentRequest {
  content: string;
  title: string;
  type: string;
  userId: string;
  businessContext?: string;
  documentId: string;
}

serve(async (req: Request, connInfo: ConnInfo) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    const { content, title, type, userId, businessContext, documentId } = await req.json() as ProcessDocumentRequest;

    if (!content || !title || !type || !userId || !documentId) {
      throw new Error('Missing required fields');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Call the generate-with-claude function to process the document
    const { data: claudeResponse, error: claudeError } = await supabaseClient.functions.invoke(
      "generate-with-claude",
      {
        body: {
          prompt: content,
          taskType: "generate-ideas",
          apiKey: Deno.env.get('CLAUDE_API_KEY')
        }
      }
    );

    if (claudeError) {
      throw new Error(`Failed to process document: ${claudeError.message}`);
    }

    return new Response(JSON.stringify({ success: true, data: claudeResponse }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      }
    );
  }
});
