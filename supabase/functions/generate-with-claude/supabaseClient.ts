
// Simple Supabase client for edge functions
// This doesn't use the JavaScript client as the context is different in edge functions

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

export const supabaseClient = {
  // Basic fetch wrapper for making requests to Supabase
  async fetch(path: string, options: RequestInit = {}) {
    const url = `${SUPABASE_URL}${path}`;
    const headers = {
      ...options.headers,
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    };

    return fetch(url, {
      ...options,
      headers,
    });
  },
  
  // Update document status after processing
  async updateDocumentStatus(userId: string, documentId: string, status: string, metaData = {}) {
    const response = await this.fetch(`/rest/v1/documents`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        processing_status: status,
        ...metaData 
      }),
      headers: {
        'Prefer': 'return=minimal',
      },
    });
    
    return response.ok;
  }
};
