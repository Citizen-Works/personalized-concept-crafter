
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

    // Get the Supabase anon key from the window environment
    const supabaseAnonKey = window.location.hostname.includes('localhost') 
      ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2YmpvZmpzbWhuYXRteml4cWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNjgwNDIsImV4cCI6MjA1Nzc0NDA0Mn0.vW7uUXyXRIRLB6HAm_lKcV-ACx7OWiGObiHgktb9fYs'
      : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2YmpvZmpzbWhuYXRteml4cWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNjgwNDIsImV4cCI6MjA1Nzc0NDA0Mn0.vW7uUXyXRIRLB6HAm_lKcV-ACx7OWiGObiHgktb9fYs';

    console.log(`Making request to ${window.location.origin}/api/functions/generate-with-claude`);
    
    const response = await fetch(`${window.location.origin}/api/functions/generate-with-claude`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({
        prompt: `You are an expert content strategist tasked with identifying potential content ideas from meeting transcripts. 
        
        Analyze the following meeting transcript and extract 3-5 potential content ideas. For each idea:
        1. Provide a clear, concise title
        2. Write a brief description explaining what the content would cover
        3. Identify which sections of the transcript support this idea (include relevant quotes)
        
        ${businessContext}
        
        If the transcript doesn't contain any valuable content ideas that would be relevant to the business context, respond with "No valuable content ideas found in this transcript." and a brief explanation why.
        
        Meeting Transcript:
        ${sanitizedContent}`,
        contentType: "content_ideas",
        idea: { title: document.title },
        task: "transcript_analysis"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from claude function:", errorText);
      throw new Error(`Error processing transcript: ${response.statusText}`);
    }

    let result;
    try {
      result = await response.json();
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      const responseText = await response.text();
      console.error("Raw response:", responseText);
      throw new Error("Failed to parse response from AI service");
    }

    return result.content;
  } catch (error) {
    console.error("Error processing transcript:", error);
    toast.error("Failed to process transcript for ideas");
    throw error;
  }
};
