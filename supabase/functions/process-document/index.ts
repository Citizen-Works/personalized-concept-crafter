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
    let document;
    
    // Fetch user's business context, ICPs, and content pillars
    const { data: userContext, error: contextError } = await supabase
      .from('user_context')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (contextError) {
      console.error('Error fetching user context:', contextError);
      // Continue without context but log the error
    }

    const { data: contentPillars, error: pillarsError } = await supabase
      .from('content_pillars')
      .select('*')
      .eq('user_id', userId)
      .eq('is_archived', false)
      .order('display_order', { ascending: true });
      
    if (pillarsError) {
      console.error('Error fetching content pillars:', pillarsError);
      // Continue without pillars but log the error
    }

    const { data: targetAudiences, error: audiencesError } = await supabase
      .from('target_audiences')
      .select('*')
      .eq('user_id', userId)
      .eq('is_archived', false);
      
    if (audiencesError) {
      console.error('Error fetching target audiences:', audiencesError);
      // Continue without audiences but log the error
    }
    
    if (!content) {
      // Fetch document with extra debugging for mobile
      console.log(`Fetching document with ID: ${documentId}, type=${typeof documentId}`);
      
      try {
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
        
        console.log(`Document fetch successful: ${title} (${type})`);
      } catch (fetchError) {
        console.error('Document fetch error:', fetchError);
        throw fetchError;
      }
    } else {
      document = {
        id: documentId,
        title: title || 'Document',
        content,
        type: type || 'generic'
      };
    }

    console.log(`Processing document: ${title} (${type})`);

    // Call Claude API to generate ideas
    const { data: claudeResponse, error: claudeError } = await supabase.functions.invoke(
      "generate-with-claude",
      {
        body: {
          prompt: `You are an expert content strategist and writer tasked with identifying high-value content opportunities from source material. Your goal is to find SPECIFIC insights that would be valuable to the target audience.

BUSINESS CONTEXT:
${userContext?.business_context || 'No specific business context provided'}

CONTENT PILLARS:
${contentPillars?.map(pillar => `- ${pillar.name}: ${pillar.description}`).join('\n') || 'No specific content pillars defined'}

TARGET AUDIENCES (ICPs):
${targetAudiences?.map(icp => `- ${icp.name}: ${icp.description}`).join('\n') || 'No specific target audiences defined'}

SOURCE MATERIAL (${type}):
---
${content}
---

EVALUATION INSTRUCTIONS:
1. Carefully analyze the source material for SPECIFIC insights, examples, or learnings that would be valuable to the target audience
2. Only generate ideas if you find concrete, unique value that aligns with the business context and content pillars
3. If you don't find any strong, specific opportunities, return an empty array []
4. Each idea must be based on a specific quote, example, or insight from the source material
5. Avoid generic, surface-level observations that could apply to any content
6. Focus on unique angles and specific details that make the content valuable

OUTPUT FORMAT:
Generate 2-3 high-value content ideas in this exact JSON format:
[
  {
    "title": "Clear, specific, SEO-optimized title that communicates unique value (NOT generic like 'Key insights from X')",
    "description": "Detailed writer brief that includes:
    - Specific insights/examples from the source material (with context)
    - Clear angle and unique value proposition
    - Key points to be developed
    - Supporting evidence/quotes
    - Target audience and their pain points
    - How this aligns with business goals
    The description should give writers everything needed without referencing the original material."
  }
]

CRITICAL REQUIREMENTS:
1. NO generic titles like 'Key insights from X' or 'Questions raised by X'
2. Each idea MUST be based on SPECIFIC content from the source material
3. Ideas MUST clearly align with at least one content pillar and target audience
4. Descriptions must be comprehensive writer briefs
5. Return ONLY the JSON array
6. Return [] if no strong, specific opportunities exist
7. Each idea must include at least one specific quote or example from the source material
8. Avoid surface-level observations that could apply to any content
9. Focus on unique angles and specific details that make the content valuable`,
          contentType: "ideas",
          task: "content_analysis",
          idea: { title }
        }
      }
    );

    if (claudeError) {
      console.error('Error calling Claude API:', claudeError);
      throw new Error(`Failed to generate ideas: ${claudeError.message}`);
    }

    if (!claudeResponse || !claudeResponse.content) {
      throw new Error('Invalid response from Claude API');
    }

    // Parse the ideas from Claude's response
    let ideas;
    try {
      ideas = JSON.parse(claudeResponse.content);
      if (!Array.isArray(ideas)) {
        throw new Error('Claude response is not a valid array');
      }
      
      // If no ideas were generated, that's valid - just return early
      if (ideas.length === 0) {
        console.log('No valuable content opportunities identified');
        
        // Update document status
        if (!content || (document && document.id)) {
          try {
            await supabase
              .from('documents')
              .update({
                processing_status: 'completed',
                has_ideas: false,
                ideas_count: 0,
              })
              .eq('id', documentId);
          } catch (updateError) {
            console.error('Error updating document status:', updateError);
          }
        }
        
        return { 
          success: true, 
          ideasCount: 0, 
          ideas: [],
          message: 'No valuable content opportunities identified that align with business goals and context.'
        };
      }
      
      // Validate each idea has required fields
      ideas.forEach((idea, index) => {
        if (!idea.title || !idea.description) {
          console.error(`Idea ${index} is missing required fields:`, idea);
          throw new Error(`Idea ${index} is missing required fields`);
        }
      });
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError);
      console.error('Raw response:', claudeResponse.content);
      throw new Error('Failed to parse ideas from Claude response');
    }

    console.log(`Generated ${ideas.length} ideas for document ${documentId}`);

    // Save the generated ideas if we have a valid document ID
    let savedCount = 0;
    
    // Only save ideas to database if given a real document ID
    if (!content || (document && document.id)) {
      for (const idea of ideas) {
        try {
          const { error: ideaError } = await supabase
            .from('content_ideas')
            .insert({
              user_id: userId,
              title: idea.title,
              description: idea.description,
              source: 'source_material',
              source_url: document.id,
              status: 'unreviewed',
              has_been_used: false
            });

          if (ideaError) {
            console.error('Error saving idea:', ideaError);
          } else {
            savedCount++;
          }
        } catch (insertError) {
          console.error('Exception during idea save:', insertError);
        }
      }

      console.log(`Successfully saved ${savedCount} of ${ideas.length} ideas`);

      // Update the document to mark that ideas have been generated
      try {
        const { error: updateError } = await supabase
          .from('documents')
          .update({
            processing_status: 'completed',
            has_ideas: savedCount > 0,
            ideas_count: savedCount,
          })
          .eq('id', documentId);
  
        if (updateError) {
          console.error('Error updating document status:', updateError);
          console.log(`Warning: Could not update document status: ${updateError.message}`);
        }
      } catch (updateError) {
        console.error('Error during document update:', updateError);
        console.log(`Warning: Could not update document status due to exception: ${updateError instanceof Error ? updateError.message : 'Unknown error'}`);
      }
    }

    console.log(`Successfully generated ${ideas.length} ideas from document ${documentId}`);
    return { 
      success: true, 
      ideasCount: ideas.length, 
      ideas,
      message: ideas.length > 0 ? 'Successfully generated content ideas.' : 'No valuable content opportunities identified.'
    };

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Enhanced error handling for parsing request body (common mobile issue)
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid request body format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { documentId, userId, type, content, title } = requestBody;
    
    console.log(`Request parameters: documentId=${documentId}, userId=${userId}, type=${type}`);
    
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
      JSON.stringify({ 
        error: error.message || 'Unknown error occurred',
        stack: error.stack || 'No stack trace available' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
