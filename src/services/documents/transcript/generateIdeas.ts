
import { supabase } from "@/integrations/supabase/client";
import { ContentIdea } from "./types";

/**
 * Calls the Claude AI service to generate content ideas from transcript text
 */
export const generateIdeas = async (
  sanitizedContent: string,
  businessContext: string,
  documentTitle: string
): Promise<ContentIdea[]> => {
  console.log("Calling Claude function via Supabase invocation");

  // Use supabase.functions.invoke to call the edge function
  const { data, error } = await supabase.functions.invoke("generate-with-claude", {
    body: {
      prompt: `You are an elite content strategist who transforms meeting insights into standout content.

      YOUR OBJECTIVE: Analyze the provided meeting transcript and extract the MOST VALUABLE content ideas. Format your response as a JSON array of content ideas.
      
      ${businessContext}
      
      OUTPUT INSTRUCTIONS:
      Generate 3 EXCEPTIONAL content ideas from the transcript, formatted as JSON objects with these detailed keys:
      
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
      
      If the transcript doesn't contain any valuable content ideas, respond with an empty array: []
      
      VERY IMPORTANT: Your response MUST be valid JSON that can be parsed directly. DO NOT include any text before or after the JSON array.
      
      Meeting Transcript:
      ${sanitizedContent}`,
      contentType: "structured_content_ideas",
      idea: { title: documentTitle },
      task: "transcript_analysis"
    }
  });

  if (error) {
    console.error("Error from Claude function:", error);
    throw new Error(`Failed to process transcript: ${error.message}`);
  }

  if (!data || !data.content) {
    console.error("Invalid response structure:", data);
    throw new Error("Invalid response from AI service");
  }

  // Parse the ideas from the JSON response
  let contentIdeas: ContentIdea[];
  try {
    contentIdeas = JSON.parse(data.content);
    if (!Array.isArray(contentIdeas)) {
      throw new Error("Response is not a valid array");
    }
  } catch (parseError) {
    console.error("Failed to parse content ideas:", parseError);
    console.error("Raw content:", data.content);
    return [];
  }

  return contentIdeas;
};
