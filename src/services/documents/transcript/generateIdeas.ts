import { supabase } from "@/integrations/supabase/client";
import { ContentIdea } from "./types";
import { isMobileDevice } from "./processingUtils";

/**
 * Splits a long transcript into smaller chunks that won't exceed token limits
 * @param text - The transcript text to chunk
 * @param maxChunkLength - Maximum characters per chunk (default 6000)
 * @returns Array of text chunks
 */
function chunkTranscript(text: string, maxChunkLength: number = 6000): string[] {
  // If text is already small enough, return as single chunk
  if (text.length <= maxChunkLength) {
    return [text];
  }

  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    // Calculate end index for this chunk
    let endIndex = startIndex + maxChunkLength;
    
    // Try to end at a sentence or paragraph boundary if possible
    if (endIndex < text.length) {
      // Look for paragraph break
      const paragraphBreak = text.lastIndexOf('\n\n', endIndex);
      if (paragraphBreak > startIndex + maxChunkLength * 0.7) {
        endIndex = paragraphBreak + 2; // Include the newlines
      } else {
        // Look for sentence break (period followed by space)
        const sentenceBreak = text.lastIndexOf('. ', endIndex);
        if (sentenceBreak > startIndex + maxChunkLength * 0.7) {
          endIndex = sentenceBreak + 2; // Include the period and space
        }
      }
    } else {
      endIndex = text.length;
    }

    // Extract chunk and add to array
    chunks.push(text.substring(startIndex, endIndex));
    startIndex = endIndex;
  }

  console.log(`Split transcript into ${chunks.length} chunks for processing`);
  return chunks;
}

/**
 * Attempts to generate ideas via the Supabase edge function
 */
async function generateIdeasViaEdgeFunction(
  sanitizedContent: string,
  businessContext: string,
  documentTitle: string,
  documentId: string,
  userId: string,
  documentType?: string
): Promise<ContentIdea[]> {
  console.log(`Calling edge function to generate ideas for: ${documentTitle} (ID: ${documentId})`);
  
  // Enhanced edge function call with better error handling
  const response = await supabase.functions.invoke(
    "process-document", 
    {
      body: {
        documentId: documentId, 
        userId,
        content: sanitizedContent,
        title: documentTitle,
        type: documentType || 'generic'
      }
    }
  );
  
  if (response.error) {
    console.error("Edge function error:", response.error);
    throw new Error(`Edge function failed: ${response.error.message || 'Unknown error'}`);
  }
  
  if (!response.data) {
    console.error("Edge function returned no data");
    throw new Error("No data returned from edge function");
  }
  
  const contentIdeas = response.data?.ideas || [];
  console.log(`Generated ${contentIdeas.length} ideas via edge function`);
  
  return contentIdeas;
}

/**
 * Calls the Claude AI service to generate content ideas from transcript text
 */
export const generateIdeas = async (
  sanitizedContent: string,
  businessContext: string,
  documentTitle: string,
  documentId?: string,
  userId?: string,
  documentType?: string
): Promise<ContentIdea[]> => {
  console.log(`Processing transcript with length: ${sanitizedContent.length} characters`);

  // Split long transcripts into manageable chunks
  const chunks = chunkTranscript(sanitizedContent);
  console.log(`Processing transcript in ${chunks.length} chunks`);

  let allIdeas: ContentIdea[] = [];

  // Try to use the edge function if document ID and user ID are provided
  if (documentId && userId) {
    try {
      return await generateIdeasViaEdgeFunction(
        sanitizedContent, 
        businessContext, 
        documentTitle,
        documentId,
        userId,
        documentType
      );
    } catch (edgeFunctionError) {
      console.error("Edge function failed, falling back to local generation:", edgeFunctionError);
      // Continue with local generation below
    }
  }

  // Process each chunk separately
  for (let i = 0; i < chunks.length; i++) {
    console.log(`Processing chunk ${i+1} of ${chunks.length}, length: ${chunks[i].length} characters`);
    
    try {
      // Create a modified prompt that includes chunk context if using multiple chunks
      const chunkContext = chunks.length > 1 
        ? `NOTE: This is part ${i+1} of ${chunks.length} from the full transcript.` 
        : '';

      // Call Claude function via Supabase invocation
      const { data, error } = await supabase.functions.invoke("generate-with-claude", {
        body: {
          prompt: `You are an elite content strategist who transforms meeting insights into standout content.

YOUR OBJECTIVE: Analyze the provided meeting transcript and extract the MOST VALUABLE content ideas. Format your response as a JSON array of content ideas.

${businessContext}

${chunkContext}

OUTPUT INSTRUCTIONS:
Generate ${chunks.length > 1 ? '1-2' : '3'} EXCEPTIONAL content ideas from the transcript, formatted as JSON objects with these detailed keys:

[
  {
    "topic": "Compelling headline that captures the essence of the idea",
    "topicDetails": {
      "targetIcp": "Primary audience for this content (Operations, Marketing, Sales Leaders, etc)",
      "contentPillar": "Which content category this fits into (Strategic Automation, Employee Empowerment, Case Studies, etc)",
      "coreInsight": "The valuable perspective that addresses a specific pain point",
      "businessImpact": "The measurable outcomes this content addresses (time/cost/efficiency)",
      "employeeImpact": "How this affects team members and their work experience",
      "strategicImpact": "Longer-term competitive or operational advantages",
      "keyPoints": ["3-5 substantive points with actual value (including specific metrics)"],
      "specificExamples": "Real-world scenarios that demonstrate implementation",
      "uniqueAngle": "What makes this perspective different from standard advice",
      "practicalTakeaway": "The immediate, actionable step readers can implement",
      "ctaSuggestion": "A natural next step aligned with the target audience's goals"
    },
    "transcriptExcerpt": "Brief excerpt from the transcript that inspired this idea"
  }
]

CRITICAL FORMATTING REQUIREMENTS:
1. Each idea MUST have both 'topic' and 'topicDetails' fields
2. The 'topicDetails' object MUST contain ALL the fields shown in the example
3. The 'keyPoints' field MUST be an array of strings
4. Do not add any fields that are not shown in the example
5. Do not include any explanatory text before or after the JSON array
6. The response must be valid JSON that can be parsed directly

If the transcript doesn't contain any valuable content ideas, respond with an empty array: []

Meeting Transcript:
${sanitizedContent}`,
          contentType: "ideas",
          task: "transcript_analysis",
          idea: { title: documentTitle }
        }
      });

      if (error) {
        console.error(`Error from Claude function for chunk ${i+1}:`, error);
        continue; // Skip to next chunk on error but don't fail completely
      }

      if (!data || !data.content) {
        console.error(`Invalid response structure for chunk ${i+1}:`, data);
        continue;
      }

      // Parse the ideas from the JSON response
      let chunkIdeas: ContentIdea[];
      try {
        console.log(`Raw Claude response for chunk ${i+1}:`, data.content);
        
        // Try to parse the response
        chunkIdeas = JSON.parse(data.content);
        
        // Validate the response structure
        if (!Array.isArray(chunkIdeas)) {
          console.error("Response is not a valid array:", chunkIdeas);
          throw new Error("Response is not a valid array");
        }
        
        // Validate each idea
        chunkIdeas.forEach((idea, index) => {
          if (!idea.topic || !idea.topicDetails) {
            console.error(`Idea ${index} is missing required fields:`, idea);
            throw new Error(`Idea ${index} is missing required fields`);
          }
          
          // Check all required topicDetails fields
          const requiredFields = [
            'targetIcp',
            'contentPillar',
            'coreInsight',
            'businessImpact',
            'employeeImpact',
            'strategicImpact',
            'keyPoints',
            'specificExamples',
            'uniqueAngle',
            'practicalTakeaway',
            'ctaSuggestion'
          ];
          
          requiredFields.forEach(field => {
            if (!(field in idea.topicDetails)) {
              console.error(`Idea ${index} is missing required field ${field}:`, idea);
              throw new Error(`Idea ${index} is missing required field ${field}`);
            }
          });
          
          // Ensure keyPoints is an array
          if (!Array.isArray(idea.topicDetails.keyPoints)) {
            console.error(`Idea ${index} keyPoints is not an array:`, idea);
            throw new Error(`Idea ${index} keyPoints must be an array`);
          }
        });
        
        console.log(`Extracted ${chunkIdeas.length} valid ideas from chunk ${i+1}`);
        allIdeas = [...allIdeas, ...chunkIdeas];
      } catch (parseError) {
        console.error(`Failed to parse content ideas from chunk ${i+1}:`, parseError);
        console.error("Raw content:", data.content);
        // Continue with next chunk
      }
    } catch (chunkError) {
      console.error(`Error processing chunk ${i+1}:`, chunkError);
      // Continue with other chunks even if one fails
    }
  }

  // Ensure we don't return too many ideas (limit to the 5 most valuable)
  if (allIdeas.length > 5) {
    console.log(`Found ${allIdeas.length} ideas total, filtering to top 5`);
    allIdeas = allIdeas.slice(0, 5);
  }

  console.log(`Returning ${allIdeas.length} ideas from full transcript analysis`);
  return allIdeas;
};
