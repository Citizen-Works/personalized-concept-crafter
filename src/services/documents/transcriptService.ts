import { processDocumentForIdeas } from '@/utils/documentProcessing';

export { 
  processDocumentForIdeas as processTranscriptForIdeas,
};

// Re-export types
export type { ContentIdea, IdeaResponse } from './transcript/types';
