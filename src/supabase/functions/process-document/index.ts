import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'
import { handleApiError } from '../../../utils/errorHandling.ts'
import type { Database } from '../../../types/database.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProcessDocumentPayload {
  documentId: string
  userId: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get the request payload
    const payload: ProcessDocumentPayload = await req.json()
    const { documentId, userId } = payload

    // Fetch the document
    const { data: document, error: fetchError } = await supabaseClient
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', userId)
      .single()

    if (fetchError) {
      throw fetchError
    }

    if (!document) {
      return new Response(
        JSON.stringify({ error: 'Document not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update document status to processing
    const { error: updateError } = await supabaseClient
      .from('documents')
      .update({ processing_status: 'processing' })
      .eq('id', documentId)

    if (updateError) {
      throw updateError
    }

    // Process the document content here
    // ... your document processing logic ...

    // Update document status to completed
    const { error: finalUpdateError } = await supabaseClient
      .from('documents')
      .update({ 
        processing_status: 'completed',
        has_ideas: true,
        ideas_count: 1 // Update this based on actual ideas generated
      })
      .eq('id', documentId)

    if (finalUpdateError) {
      throw finalUpdateError
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    const { message } = handleApiError(error)
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}) 