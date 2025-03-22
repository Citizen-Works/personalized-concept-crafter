
# Content Engine Codebase Standards

This document outlines the standardized patterns, data models, and component architecture to be followed in the Content Engine application.

## Status Types

### Content Idea Statuses
Content ideas follow a simple workflow represented by these statuses:

- `unreviewed`: New ideas that need review
- `approved`: Ideas that have been approved for content creation
- `rejected`: Ideas that have been rejected

### Draft Statuses
Content drafts have a more complex lifecycle:

- `draft`: Initial draft being worked on
- `ready`: Draft is ready to be published
- `published`: Draft has been published
- `archived`: Draft has been archived

### Valid Status Transitions

#### Content Idea Status Transitions:
- `unreviewed` → `approved` or `rejected`
- `approved` → `rejected`
- `rejected` → `approved`

#### Draft Status Transitions:
- `draft` → `ready` or `archived`
- `ready` → `published`, `draft`, or `archived`
- `published` → `archived`
- `archived` → `draft`

## Component Architecture

### Shared Components

1. **StatusBadge**: Used for displaying any status type with appropriate styling
2. **ContentCard**: Base card component that can be used for ideas, drafts, etc.
3. **TypeBadge**: For displaying content types
4. **SourceBadge**: For displaying content sources

### Component Organization

- Components should be organized by feature first, then by type
- Shared components should be in `src/components/shared`
- UI primitives should be in `src/components/ui`

## Data Models

### Content Idea
```typescript
interface ContentIdea {
  id: string;
  userId: string;
  title: string;
  description: string;
  notes: string;
  source: ContentSource;
  meetingTranscriptExcerpt?: string;
  sourceUrl?: string;
  status: ContentStatus;
  hasBeenUsed: boolean;
  createdAt: Date;
  contentPillarIds?: string[];
  targetAudienceIds?: string[];
}
```

### Content Draft
```typescript
interface ContentDraft {
  id: string;
  contentIdeaId: string;
  content: string;
  contentType: ContentType;
  contentGoal?: string;
  version: number;
  feedback: string;
  status: DraftStatus;
  createdAt: Date;
}
```

## Code Style Guidelines

1. Use TypeScript interfaces for all data models
2. Use enums or string literal types for all status values
3. Create reusable utility functions for common operations
4. Prefer custom hooks for shared logic
5. Use the model factory functions for creating new objects

## State Management

1. Use local component state for UI-only state
2. Use custom hooks for shared state
3. Use React Query for server state
4. Use context only when state needs to be shared across multiple routes

## Standardized API Calls

1. Use the `useContentApi` hooks for all API calls
2. Handle loading and error states consistently
3. Use the model factory functions to create payloads

## Naming Conventions

1. Component files: PascalCase.tsx
2. Hook files: camelCase.ts(x)
3. Utility files: camelCase.ts
4. Interfaces: PascalCase
5. Status properties: Always named `status`
6. ID properties: Always named with the pattern `entityId` (e.g., `contentIdeaId`)

## Testing Standards

1. Test all utility functions
2. Test all custom hooks
3. Test critical component rendering and interactions
4. Use mock data consistent with the data models

## Documentation

1. Document all interfaces and type definitions
2. Document complex business logic
3. Document component props
4. Keep this standards document updated as patterns evolve
