
type WebhookService = "otter" | "fathom" | "read" | "fireflies";

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
      return {
        ...baseTranscript,
        title: requestData.meeting_title || requestData.title || "Read.AI Transcript",
        content: requestData.content || requestData.transcript || requestData.transcript_text || ""
      };
      
    case 'fireflies':
      return {
        ...baseTranscript,
        title: requestData.title || requestData.meeting_title || requestData.name || "Fireflies.ai Transcript",
        content: requestData.transcript || requestData.content || requestData.text || ""
      };
      
    default:
      return {
        ...baseTranscript,
        title: "Meeting Transcript",
        content: JSON.stringify(requestData)
      };
  }
}
