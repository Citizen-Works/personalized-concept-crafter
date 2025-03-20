
type WebhookService = "otter" | "fathom" | "read" | "fireflies" | "zapier";

// Process transcript data based on service type
export function processTranscriptData(serviceName: WebhookService, requestData: any, userId: string): any {
  console.log(`Processing ${serviceName} webhook data:`, JSON.stringify(requestData).substring(0, 200) + "...");
  
  const baseTranscript = {
    title: "Untitled Meeting",
    content: "",
    type: "transcript",
    purpose: "business_context",
    status: "active",
    content_type: "general",
    user_id: userId
  };
  
  switch (serviceName) {
    case 'otter':
      return {
        ...baseTranscript,
        title: requestData.title || requestData.meeting_name || requestData.meeting_title || "Otter.ai Transcript",
        content: requestData.transcript || requestData.text || requestData.content || ""
      };
      
    case 'fathom':
      return {
        ...baseTranscript,
        title: requestData.meeting_name || requestData.title || requestData.name || "Fathom Transcript",
        content: requestData.transcript_text || requestData.transcript || requestData.content || ""
      };
      
    case 'read':
      // Enhanced Read.ai handler with specific field mapping based on their documentation
      console.log("Processing Read.ai payload with keys:", Object.keys(requestData));
      
      // Attempt to extract transcript from various possible locations in the payload structure
      let transcript = "";
      
      // First try the direct transcript field
      if (requestData.transcript) {
        console.log("Found direct transcript field");
        transcript = requestData.transcript;
      } 
      // Try transcript within session data
      else if (requestData.session_id && requestData.transcript) {
        console.log("Found transcript in session data");
        transcript = requestData.transcript;
      }
      // Try as part of a nested structure
      else if (requestData.data?.transcript) {
        console.log("Found transcript in data.transcript");
        transcript = requestData.data.transcript;
      }
      // Try in deeper nested structures
      else if (requestData.payload?.transcript) {
        console.log("Found transcript in payload.transcript");
        transcript = requestData.payload.transcript;
      }
      // Try other common locations
      else if (requestData.content) {
        console.log("Using content field as transcript");
        transcript = requestData.content;
      }
      else if (requestData.text) {
        console.log("Using text field as transcript");
        transcript = requestData.text;
      }
      else {
        // If we still can't find it, log the full payload for debugging
        console.log("Could not locate transcript in Read.ai payload. Full payload:", JSON.stringify(requestData));
        
        // As a fallback, convert the entire payload to a string
        transcript = JSON.stringify(requestData);
      }
      
      // For title, try multiple possible locations
      const title = 
        requestData.title || 
        requestData.meeting_title || 
        (requestData.metadata?.title) || 
        (requestData.metadata?.meeting_title) || 
        (requestData.meta?.title) || 
        `Read.ai Meeting (${new Date().toLocaleString()})`;
      
      console.log(`Extracted title: "${title}", transcript length: ${transcript.length} characters`);
      
      return {
        ...baseTranscript,
        title: title,
        content: transcript
      };
      
    case 'fireflies':
      return {
        ...baseTranscript,
        title: requestData.title || requestData.meeting_title || requestData.name || "Fireflies.ai Transcript",
        content: requestData.transcript || requestData.content || requestData.text || ""
      };
      
    case 'zapier':
      // Handle data coming from Zapier
      console.log("Processing Zapier payload with keys:", Object.keys(requestData));
      
      let zapierTranscript = "";
      let zapierTitle = "Zapier Integration";
      
      // Try to extract the transcript content based on common field patterns
      if (requestData.transcript || requestData.content || requestData.text || requestData.meeting_transcript) {
        zapierTranscript = requestData.transcript || requestData.content || requestData.text || requestData.meeting_transcript;
      } 
      // Check for nested data which Zapier often uses
      else if (requestData.data && typeof requestData.data === 'object') {
        const data = requestData.data;
        zapierTranscript = data.transcript || data.content || data.text || data.meeting_transcript || JSON.stringify(data);
      }
      // If nothing extractable, use entire payload as string
      else {
        zapierTranscript = JSON.stringify(requestData);
      }
      
      // Extract title if available
      zapierTitle = 
        requestData.title || 
        requestData.meeting_title || 
        requestData.meeting_name ||
        (requestData.data?.title) ||
        (requestData.data?.meeting_title) ||
        (requestData.data?.meeting_name) ||
        `Meeting Transcript from Zapier (${new Date().toLocaleString()})`;
        
      console.log(`Extracted Zapier title: "${zapierTitle}", transcript length: ${zapierTranscript.length} characters`);
      
      return {
        ...baseTranscript,
        title: zapierTitle,
        content: zapierTranscript
      };
      
    default:
      return {
        ...baseTranscript,
        title: "Meeting Transcript",
        content: JSON.stringify(requestData)
      };
  }
}
