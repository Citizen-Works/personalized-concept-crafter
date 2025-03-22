
# Architecture Overview

The Content Engine employs a modern, scalable architecture designed to support content creation workflows for multiple client organizations.

## System Overview

![Architecture Diagram](../assets/architecture-diagram.png)

The system consists of several interconnected components:

1. **React Frontend**: UI layer built with React, TypeScript, and Tailwind CSS
2. **Custom Hooks Layer**: Business logic and state management
3. **Services Layer**: API interfaces and external service integrations
4. **Supabase Backend**: Authentication, database, and storage
5. **Edge Functions**: Serverless processing for specialized operations
6. **Claude AI Integration**: Content generation capabilities

## Data Flow

### Content Idea Generation Flow
1. User uploads or enters source material (documents, transcripts)
2. Source material is processed by Edge Functions using Claude AI
3. Extracted ideas are stored in the database
4. Ideas appear in the content pipeline for further processing

### Content Draft Generation Flow
1. User selects a content idea for drafting
2. System assembles relevant context (writing style, target audience, etc.)
3. Context and idea are sent to Claude AI via Edge Functions
4. Generated draft is stored and presented to the user for editing

## Key Subsystems

### Multi-tenant System
- Email domain-based tenant identification
- Row-level security policies in Supabase
- Tenant-aware React Query context
- See [Multi-tenant Architecture](./multi-tenant-architecture.md) for details

### Document Processing System
- Supports multiple document types (text, transcripts, PDFs)
- Extracts business context and writing examples
- Processes meeting transcripts into content ideas

### AI Prompt Engineering System
- Dynamic prompt assembly based on content type
- Incorporates writing style, target audience, and business context
- Configurable templates for different content generation needs

### Custom Hooks Layer
- Abstracts API calls from UI components
- Centralizes error handling and loading states
- Manages tenant-awareness for data operations
- Implements React Query for efficient caching and refetching

## Database Design

The database schema is designed around these main entities:

- **Tenants**: Organization-level configuration
- **Profiles**: User information
- **Documents**: Source materials and references
- **Content Ideas**: Content topics with metadata
- **Content Drafts**: Generated content drafts
- **Writing Style Profiles**: Style preferences
- **Target Audiences**: Defined audience segments
- **Content Pillars**: Core themes for content

## Security Architecture

- Authentication via Supabase Auth
- Role-based access control
- Row-level security policies
- Tenant isolation

## Edge Functions

Supabase Edge Functions handle specialized operations:
- `generate-with-claude`: Content generation with Claude AI
- `onboarding-assistant`: Interactive onboarding experience
- `process-document`: Document parsing and idea extraction
- `transcribe-audio`: Audio transcription service

## Performance Considerations

The application implements several performance optimizations:
- Efficient caching with React Query
- Code splitting and lazy loading
- Optimized database queries
- See [Performance Optimizations](./performance-optimizations.md) for details

## Development Workflow

1. **Component Development**: UI components in `src/components/`
2. **Hook Development**: Business logic in `src/hooks/`
3. **Service Development**: API interfaces in `src/services/`
4. **Testing**: Unit and integration tests
5. **Deployment**: CI/CD pipeline to production

## Extending the System

See the following guides for extending specific parts of the system:
- [Adding New Document Types](./guides/adding-document-types.md)
- [Extending the AI Prompt System](./guides/extending-prompts.md)
- [Working with Edge Functions](./guides/edge-functions.md)
