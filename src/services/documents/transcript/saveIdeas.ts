
import { ContentIdea } from "./types";
import { createIdea } from "@/hooks/ideas/ideaApi";
import { ContentSource, ContentStatus } from "@/types";

/**
 * Saves generated content ideas to the database
 */
export const saveIdeas = async (
  contentIdeas: ContentIdea[],
  userId: string
): Promise<Array<{ id: string; title: string; description: string }>> => {
  // Save each idea to the database
  return Promise.all(contentIdeas.map(async (idea) => {
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
        // Don't specify contentType, so it will be NULL by default
      };

      // Save to database
      const savedIdea = await createIdea(ideaData, userId);
      return {
        id: savedIdea.id,
        title: savedIdea.title,
        description: savedIdea.description
      };
    } catch (error) {
      console.error("Error saving idea to database:", error);
      throw error;
    }
  }));
};
