
/**
 * Types for transcript processing functionality
 */
import { ContentType } from '@/types/content';

export interface ContentIdea {
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

export interface IdeaResponse {
  message: string;
  ideas: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}
