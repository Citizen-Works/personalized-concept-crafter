
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { createIdea } from "@/hooks/ideas/ideaApi";
import { ContentSource, ContentStatus, ContentType } from "@/types";

interface ContentIdea {
  topic: string;
  topicDetails: {
    targetIcp: string;
    contentPillar: string;
    coreInsight: string;
    businessImpact: string;
    employeeImpact: string;
    strategicImpact: string;
    keyPoints: string[];
    specificExamples: string;
    uniqueAngle: string;
    practicalTakeaway: string;
    ctaSuggestion: string;
  };
  transcriptExcerpt?: string;
}

/**
 * Processes a transcript to extract content ideas
 */
export const processTranscriptForIdeas = async (
  userId: string, 
  documentId: string
): Promise<string> => {
  if (!userId) throw new Error("User not authenticated");

  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .eq("user_id", userId)
    .single();

  if (docError || !document) {
    toast.error("Failed to retrieve document");
    throw docError || new Error("Document not found");
  }

  try {
    // Get user's business info from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("business_name, business_description")
      .eq("id", userId)
      .single();
      
    if (profileError) {
      console.warn("Could not retrieve user business info:", profileError);
    }
    
    // Prepare business context
    const businessContext = profileData ? 
      `\nBusiness Context:
      Business Name: ${profileData.business_name || 'Not specified'}
      Business Description: ${profileData.business_description || 'Not specified'}\n` : '';

    // Sanitize transcript content to prevent HTML/XML confusion
    const sanitizedContent = document.content 
      ? document.content.replace(/<[^>]*>/g, '') // Remove any HTML-like tags
      : '';

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
        idea: { title: document.title },
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
      return `Failed to parse ideas from AI response. Raw response: ${data.content.substring(0, 500)}...`;
    }

    // If no ideas were generated, return a message
    if (contentIdeas.length === 0) {
      return "No valuable content ideas were identified in this transcript.";
    }

    // Save each idea to the database
    const savedIdeas = await Promise.all(contentIdeas.map(async (idea) => {
      try {
        // Map the AI response to our database schema
        const ideaData = {
          title: idea.topic,
          description: idea.topicDetails.coreInsight,
          notes: JSON.stringify({
            targetIcp: idea.topicDetails.targetIcp,
            contentPillar: idea.topicDetails.contentPillar,
            businessImpact: idea.topicDetails.businessImpact,
            employeeImpact: idea.topicDetails.employeeImpact,
            strategicImpact: idea.topicDetails.strategicImpact,
            keyPoints: idea.topicDetails.keyPoints,
            specificExamples: idea.topicDetails.specificExamples,
            uniqueAngle: idea.topicDetails.uniqueAngle,
            practicalTakeaway: idea.topicDetails.practicalTakeaway,
            ctaSuggestion: idea.topicDetails.ctaSuggestion,
          }),
          source: "transcript" as ContentSource,
          meetingTranscriptExcerpt: idea.transcriptExcerpt || "",
          sourceUrl: "",
          status: "idea" as ContentStatus,
          contentType: "blog_post" as ContentType, // Default, can be changed by user
        };

        // Save to database
        const savedIdea = await createIdea(ideaData, userId);
        return savedIdea;
      } catch (error) {
        console.error("Error saving idea to database:", error);
        throw error;
      }
    }));

    // Build a summary of the ideas that were created
    const ideasSummary = `${savedIdeas.length} content ideas were created from this transcript:
    
${savedIdeas.map(idea => `- ${idea.title}`).join('\n')}

The ideas have been saved to your content ideas library. You can view and edit them in the Ideas section.`;

    return ideasSummary;
  } catch (error) {
    console.error("Error processing transcript:", error);
    toast.error("Failed to process transcript for ideas");
    throw error;
  }
};
