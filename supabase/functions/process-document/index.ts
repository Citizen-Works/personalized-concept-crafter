
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.4.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Generate content ideas from document
async function generateIdeasFromDocument(documentId: string, userId: string, type: string = 'extract_ideas') {
  try {
    console.log(`Processing document ${documentId} for user ${userId} with type ${type}`);

    // Fetch the document
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', userId)
      .single();

    if (docError) {
      console.error('Error fetching document:', docError);
      throw new Error('Failed to fetch document');
    }

    if (!document || !document.content) {
      throw new Error('Document not found or has no content');
    }

    // For demo purposes, let's generate some simple ideas from the document
    // In a real implementation, you would use AI with higher temperature here
    const ideas = generateSimpleIdeas(document.content, document.title);

    // Save the generated ideas
    for (const idea of ideas) {
      const { error: ideaError } = await supabase
        .from('content_ideas')
        .insert({
          user_id: userId,
          title: idea.title,
          description: idea.description,
          source: 'source_material',
          source_url: document.id
        });

      if (ideaError) {
        console.error('Error saving idea:', ideaError);
      }
    }

    // Update the document to mark that ideas have been generated
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        processing_status: 'idle',
        has_ideas: true,
        ideas_count: ideas.length,
      })
      .eq('id', documentId);

    if (updateError) {
      console.error('Error updating document status:', updateError);
      throw new Error('Failed to update document status');
    }

    console.log(`Successfully generated ${ideas.length} ideas from document ${documentId}`);
    return { success: true, ideasCount: ideas.length };

  } catch (error) {
    console.error('Error processing document:', error);
    
    // Update the document status to show processing has failed
    await supabase
      .from('documents')
      .update({
        processing_status: 'idle'
      })
      .eq('id', documentId);
      
    throw error;
  }
}

// Simplified idea generation function
// In a real implementation, this would use Claude API with higher temperature
function generateSimpleIdeas(content: string, title: string) {
  const ideas = [];
  const contentSample = content.substring(0, 500); // Take just a sample for simple processing
  
  // Generate 3 simple ideas
  ideas.push({
    title: `Key insights from "${title}"`,
    description: `Extract the main insights and learnings from ${title}. The document contains valuable information that can be transformed into actionable content.`
  });
  
  ideas.push({
    title: `How to apply learnings from "${title}"`,
    description: `Create a practical guide based on the information in ${title}. Focus on implementation steps and real-world applications.`
  });
  
  ideas.push({
    title: `Questions raised by "${title}"`,
    description: `Identify and explore important questions that emerge from ${title}. This could form the basis for a thought-provoking article or discussion.`
  });
  
  return ideas;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { documentId, userId, type } = await req.json();
    
    if (!documentId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Document ID and User ID are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Process the document to generate ideas
    const result = await generateIdeasFromDocument(documentId, userId, type);
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
