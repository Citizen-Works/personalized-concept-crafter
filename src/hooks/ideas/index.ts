
export * from './useIdeas';
export * from './types';

// Re-export useIdeasAdapter as useIdeas for future migration
export { useIdeasAdapter as useIdeas } from '../api/adapters/useIdeasAdapter';
