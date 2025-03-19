
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const CLAUDE_API_KEY = Deno.env.get('CLAUDE_API_KEY');
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type UserProfile = {
  name?: string;
  businessName?: string;
  businessDescription?: string;
  jobTitle?: string;
  linkedinUrl?: string;
};

type ContentPillar = {
  name: string;
  description: string;
};

type TargetAudience = {
  name: string;
  description: string;
  painPoints: string[];
  goals: string[];
};

type WritingStyleProfile = {
  voiceAnalysis: string;
  generalStyleGuide: string;
  linkedinStyleGuide: string;
  newsletterStyleGuide: string;
  marketingStyleGuide: string;
  vocabularyPatterns: string;
  avoidPatterns: string;
};

type ProfileData = {
  userProfile: UserProfile;
  contentPillars: ContentPillar[];
  targetAudiences: TargetAudience[];
  writingStyle: WritingStyleProfile;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!CLAUDE_API_KEY) {
      throw new Error('CLAUDE_API_KEY is not set');
    }

    const requestData = await req.json();
    const { messages, userId, existingProfileData, extractProfile } = requestData;

    console.log(`Processing onboarding assistant request for user ${userId}`);
    console.log(`Extract profile: ${extractProfile}`);

    let systemPrompt = `You are an expert marketing and strategy consultant interviewing clients to develop their content strategy.

Your approach is consultative, probing, and challenging - you're here to help users refine and improve their business and content strategy, not just collect information. Ask thought-provoking questions that make users think deeper about their business, goals, and audiences.

IMPORTANT GUIDELINES:
- Take an active consultant role - challenge vague or generic answers and push for specificity
- Ask probing questions like "What makes your approach unique?" or "How does that differentiate you from competitors?"
- Provide specific examples and suggestions to help users clarify their thinking
- Use the Socratic method - guide users to their own insights rather than just collecting information
- Connect what they say about their business to potential content strategy implications
- Be warm and supportive, but don't hesitate to professionally challenge unclear thinking

The conversation should cover:
1. Business context & goals - What they do, who they serve, what outcome they're trying to drive
2. Content pillars - Key topics they should create content about (be specific, not generic)
3. Target audiences - Specific personas with clear pain points and goals 
4. Writing style preferences - Tone, voice, examples they like
5. Goals for different content types - LinkedIn, newsletters, marketing copy

If the user appears to be updating existing information, begin by asking what they'd like to get out of the conversation, offering suggestions like "improve your content strategy," "refine your target audience definitions," or "update your business information."

Remember: Your job is not just to collect information but to be a strategic partner who helps refine and improve their content strategy. Think like a high-end consultant who asks questions that lead to valuable insights.`;

    // If this is a request to extract profile data from the conversation
    if (extractProfile) {
      console.log("Extracting profile data from conversation history");
      
      // Modify the system prompt for the extraction task
      systemPrompt = `You are a data extraction assistant. Review the previous conversation between a user and an AI assistant.
The conversation was about setting up the user's profile for a content generation platform.

Extract the following information into a structured format:

1. User Profile:
   - Name (if mentioned)
   - Business name
   - Business description
   - Job title (if mentioned)
   - LinkedIn URL (if mentioned)

2. Content Pillars (2-5):
   For each pillar:
   - Name
   - Description

3. Target Audiences (1-3):
   For each audience:
   - Name
   - Description
   - Pain points (list)
   - Goals (list)

4. Writing Style Preferences:
   - Voice analysis (overall tone and style of writing)
   - General style guide (general writing guidelines)
   - LinkedIn specific style (how LinkedIn content should differ)
   - Newsletter specific style (how newsletter content should differ)
   - Marketing copy specific style (how marketing copy should differ)
   - Vocabulary patterns (phrases, words, terminology to use)
   - Patterns to avoid (phrases, words, terminology to avoid)

Only extract information that was clearly stated or implied in the conversation. If information for a field wasn't discussed, leave it empty.
Format your response as a valid JSON object with the following structure:
{
  "userProfile": {
    "name": "",
    "businessName": "",
    "businessDescription": "",
    "jobTitle": "",
    "linkedinUrl": ""
  },
  "contentPillars": [
    {
      "name": "",
      "description": ""
    }
  ],
  "targetAudiences": [
    {
      "name": "",
      "description": "",
      "painPoints": ["", ""],
      "goals": ["", ""]
    }
  ],
  "writingStyle": {
    "voiceAnalysis": "",
    "generalStyleGuide": "",
    "linkedinStyleGuide": "",
    "newsletterStyleGuide": "",
    "marketingStyleGuide": "",
    "vocabularyPatterns": "",
    "avoidPatterns": ""
  }
}`;
    }

    // If we have existing profile data, provide it to Claude
    if (existingProfileData && !extractProfile) {
      const profileContext = `
The user already has some profile information in our system that you should be aware of:

${existingProfileData.userProfile?.businessName ? `Business name: ${existingProfileData.userProfile.businessName}` : ''}
${existingProfileData.userProfile?.businessDescription ? `Business description: ${existingProfileData.userProfile.businessDescription}` : ''}
${existingProfileData.userProfile?.jobTitle ? `Job title: ${existingProfileData.userProfile.jobTitle}` : ''}

${existingProfileData.contentPillars && existingProfileData.contentPillars.length > 0 ? 
  `Content Pillars:
${existingProfileData.contentPillars.map((pillar, i) => `${i+1}. ${pillar.name}: ${pillar.description}`).join('\n')}` : ''}

${existingProfileData.targetAudiences && existingProfileData.targetAudiences.length > 0 ? 
  `Target Audiences:
${existingProfileData.targetAudiences.map((audience, i) => 
  `${i+1}. ${audience.name}: ${audience.description}
   Pain points: ${audience.painPoints.join(', ')}
   Goals: ${audience.goals.join(', ')}`
).join('\n')}` : ''}

${existingProfileData.writingStyle?.voiceAnalysis ? `Writing Style - Voice Analysis: ${existingProfileData.writingStyle.voiceAnalysis}` : ''}
${existingProfileData.writingStyle?.generalStyleGuide ? `Writing Style - General Guide: ${existingProfileData.writingStyle.generalStyleGuide}` : ''}

Since the user already has some information in their profile, begin by asking what they'd like to get out of this conversation. Offer specific options like:
- "Would you like to refine your current content strategy?"
- "Would you like to update your business information?"
- "Would you like to explore new target audiences?"
- "Would you like to refine your content pillars?"
- "Would you like assistance with your writing style?"

Based on their response, focus the conversation accordingly. Remember to reference their existing information when relevant but don't overwhelm them with all this data at once.`;

      systemPrompt += '\n\n' + profileContext;
    }

    // We need to separate the system message from the user/assistant messages
    // As Claude API expects system as a top-level parameter
    console.log(`Sending ${messages.length} messages to Claude`);
    
    // Make request to Claude API
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 4000,
        system: systemPrompt,
        messages: messages
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Claude API error:', data);
      throw new Error(`Claude API error: ${data.error?.message || 'Unknown error'}`);
    }

    let result = {};
    
    if (extractProfile) {
      try {
        // Extract the JSON from Claude's response
        const responseText = data.content[0].text;
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}') + 1;
        
        if (jsonStart >= 0 && jsonEnd > jsonStart) {
          const jsonStr = responseText.substring(jsonStart, jsonEnd);
          const profileData = JSON.parse(jsonStr);
          
          result = {
            message: data.content[0].text,
            profileData
          };
        } else {
          console.error('Could not find JSON in Claude response');
          result = {
            message: data.content[0].text,
            error: 'Could not extract structured profile data'
          };
        }
      } catch (error) {
        console.error('Error parsing profile data JSON:', error);
        result = {
          message: data.content[0].text,
          error: 'Error parsing profile data'
        };
      }
    } else {
      // Regular chat response
      result = {
        message: data.content[0].text
      };
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in onboarding-assistant function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
