
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
async function generateIdeasFromDocument(documentId: string, userId: string, type: string = 'extract_ideas', content?: string, title?: string) {
  try {
    console.log(`Processing document ${documentId} for user ${userId} with type ${type}`);

    // Only fetch the document if content wasn't provided
    let document: any = null;
    
    if (!content) {
      // Fetch the document directly using a string-based query without assuming UUID format
      console.log(`Fetching document with ID: ${documentId}`);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .eq('user_id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching document:', error);
        throw new Error(`Failed to fetch document: ${error.message}`);
      }

      if (!data || !data.content) {
        throw new Error('Document not found or has no content');
      }
      
      document = data;
      content = data.content;
      title = data.title;
      type = data.type || type;
    } else {
      // Create a temporary document object if content was provided directly
      document = {
        id: documentId,
        title: title || 'Document',
        content,
        type: type || 'generic'
      };
    }

    console.log(`Processing document: ${title} (${type})`);

    // For demo purposes, let's generate some simple ideas from the document
    // In a real implementation, you would use AI with higher temperature here
    const ideas = generateSimpleIdeas(content, title || 'Document', type);
    console.log(`Generated ${ideas.length} ideas for document ${documentId}`);

    // Save the generated ideas if we have a valid document ID
    let savedCount = 0;
    
    // Only save ideas to database if given a real document ID (not when content was provided directly)
    if (!content || (document && document.id)) {
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
        } else {
          savedCount++;
        }
      }

      console.log(`Successfully saved ${savedCount} of ${ideas.length} ideas`);

      // Update the document to mark that ideas have been generated
      try {
        const { error: updateError } = await supabase
          .from('documents')
          .update({
            processing_status: 'completed',
            has_ideas: true,
            ideas_count: savedCount,
          })
          .eq('id', documentId);
  
        if (updateError) {
          console.error('Error updating document status:', updateError);
          // Log but don't throw to ensure we still return ideas
          console.log(`Warning: Could not update document status: ${updateError.message}`);
        }
      } catch (updateError) {
        console.error('Error during document update:', updateError);
        console.log(`Warning: Could not update document status due to exception: ${updateError instanceof Error ? updateError.message : 'Unknown error'}`);
      }
    }

    console.log(`Successfully generated ${ideas.length} ideas from document ${documentId}`);
    return { success: true, ideasCount: ideas.length, ideas };

  } catch (error) {
    console.error('Error processing document:', error);
    
    // Only update document status if we're working with a stored document
    if (!content) {
      try {
        await supabase
          .from('documents')
          .update({
            processing_status: 'failed'
          })
          .eq('id', documentId);
        
        console.log(`Updated document ${documentId} status to 'failed'`);
      } catch (updateError) {
        console.error('Error updating document status after failure:', updateError);
      }
    }
      
    throw error;
  }
}

// Simplified idea generation function that adapts to different document types
// In a real implementation, this would use Claude API with higher temperature
function generateSimpleIdeas(content: string, title: string, docType: string) {
  const ideas = [];
  const contentSample = content.substring(0, 500); // Take just a sample for simple processing
  
  // Generate ideas based on document type
  if (docType === 'transcript') {
    ideas.push({
      title: `Key insights from "${title}" transcript`,
      description: `Extract the main insights and learnings from this meeting transcript. The document contains valuable information that can be transformed into actionable content.`
    });
    
    ideas.push({
      title: `How to apply learnings from "${title}" meeting`,
      description: `Create a practical guide based on the information in this meeting transcript. Focus on implementation steps and real-world applications.`
    });
  } 
  else if (docType === 'blog') {
    ideas.push({
      title: `Expand on "${title}" for deeper audience engagement`,
      description: `Take the key points from this blog post and develop them into more comprehensive content. Focus on providing additional value and insights.`
    });
    
    ideas.push({
      title: `Turn "${title}" into a series`,
      description: `Identify subtopics within this blog post that could be expanded into a multi-part series, increasing engagement and content depth.`
    });
  }
  else if (docType === 'whitepaper') {
    ideas.push({
      title: `Key takeaways from "${title}" whitepaper`,
      description: `Extract and simplify the most important points from this technical whitepaper to create more accessible content for a broader audience.`
    });
    
    ideas.push({
      title: `Case study based on "${title}"`,
      description: `Transform the theoretical concepts in this whitepaper into a real-world case study showing practical applications and results.`
    });
  }
  else {
    // Generic ideas for any document type
    ideas.push({
      title: `Key insights from "${title}"`,
      description: `Extract the main points and insights from this document to create valuable, shareable content.`
    });
    
    ideas.push({
      title: `How to apply concepts from "${title}"`,
      description: `Create a practical guide based on the information in this document. Focus on implementation steps and real-world applications.`
    });
  }
  
  // Add a generic third idea for all document types
  ideas.push({
    title: `Questions raised by "${title}"`,
    description: `Identify and explore important questions that emerge from this material. This could form the basis for a thought-provoking article or discussion.`
  });
  
  return ideas;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const requestBody = await req.json();
    const { documentId, userId, type, content, title } = requestBody;
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Document ID is required unless content is directly provided
    if (!documentId && !content) {
      return new Response(
        JSON.stringify({ error: 'Either Document ID or content is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Received request to process ${content ? 'direct content' : `document ${documentId}`} for user ${userId}`);
    
    // Process the document to generate ideas
    const result = await generateIdeasFromDocument(documentId, userId, type, content, title);
    
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
