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
      // Validate and sanitize the idea data
      if (!idea.topic || !idea.topicDetails) {
        console.error("Invalid idea format:", idea);
        throw new Error("Invalid idea format: missing required fields");
      }

      // Map the AI response to our database schema with fallbacks
      const ideaData = {
        title: idea.topic,
        description: idea.topicDetails.coreInsight || "No core insight provided",
        notes: JSON.stringify({
          targetIcp: idea.topicDetails.targetIcp || "",
          contentPillar: idea.topicDetails.contentPillar || "",
          businessImpact: idea.topicDetails.businessImpact || "",
          employeeImpact: idea.topicDetails.employeeImpact || "",
          strategicImpact: idea.topicDetails.strategicImpact || "",
          keyPoints: Array.isArray(idea.topicDetails.keyPoints) ? idea.topicDetails.keyPoints : [],
          specificExamples: idea.topicDetails.specificExamples || "",
          uniqueAngle: idea.topicDetails.uniqueAngle || "",
          practicalTakeaway: idea.topicDetails.practicalTakeaway || "",
          ctaSuggestion: idea.topicDetails.ctaSuggestion || "",
        }),
        source: "transcript" as ContentSource,
        meetingTranscriptExcerpt: idea.transcriptExcerpt || "",
        sourceUrl: "",
        status: "unreviewed" as ContentStatus,
        hasBeenUsed: false
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
      // Instead of throwing, return a null value that we'll filter out
      return null;
    }
  })).then(results => results.filter((result): result is { id: string; title: string; description: string } => result !== null));
};
