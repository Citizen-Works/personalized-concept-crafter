
# Content Engine

A comprehensive content management and generation platform that helps businesses streamline their content creation process from ideation to publication.

## 🚀 Features

- **Content Pipeline Management**: Track content from ideas to published pieces
- **Kanban-style Content Organization**: Visual workflow management
- **AI-Assisted Content Generation**: Leverage AI to create draft content
- **Multi-tenant Architecture**: Secure isolation between client organizations
- **Writing Style Management**: Define and maintain consistent brand voice
- **Target Audience Segmentation**: Tailor content to specific audience needs
- **Personal Story Library**: Build a repository of usable personal anecdotes
- **Source Material Management**: Organize and reference your content sources
- **Integrated Document Processing**: Extract insights from uploaded documents

## 🛠️ Technologies

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **State Management**: TanStack React Query
- **Backend**: Supabase (Auth, Storage, Database, Edge Functions)
- **AI Integration**: Claude AI for content generation
- **Build Tool**: Vite

## 📋 Project Structure

```
src/
├── components/     # UI components organized by feature
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── services/       # API service functions
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## 🏗️ Architecture

The Content Engine employs a robust architecture:

1. **Multi-tenant System**: Isolates data between different organizations based on email domains
2. **Document Processing System**: Converts uploaded documents into structured content ideas
3. **AI Prompt Engineering**: Sophisticated system to generate context-aware prompts for Claude AI
4. **Content Pipeline**: Manages the flow of content from ideas through drafting to publication
5. **Custom Hooks Layer**: Abstracts API calls and business logic from the UI components

See [Architecture Overview](./src/docs/architecture-overview.md) for a detailed explanation.

## 📚 Documentation

For more detailed documentation:

- [Architecture Overview](./src/docs/architecture-overview.md)
- [Multi-tenant Architecture](./src/docs/multi-tenant-architecture.md)
- [Component Organization](./src/docs/component-organization.md)
- [Error Handling](./src/docs/error-handling.md)
- [Testing Strategy](./src/docs/testing-strategy.md)
- [Performance Optimizations](./src/docs/performance-optimizations.md)

## 🚦 Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd content-engine
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:8080`

## 🧪 Testing

Run the test suite with:

```bash
npm test
```

## 🚀 Deployment

This project is set up for easy deployment with Netlify or Vercel. Connect your repository to your preferred hosting service and follow their deployment instructions.

## 📝 License

[MIT](LICENSE)
