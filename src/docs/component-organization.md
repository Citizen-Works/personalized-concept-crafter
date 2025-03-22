
# Component Organization

This document outlines the component organization strategy for the Content Engine application.

## Component Structure

Components are organized by feature rather than type, following a domain-driven approach. This makes it easier to find related components and understand how they interact.

### Feature-based Organization

Each feature has its own directory under `src/components/`:

```
src/components/
├── ideas/            # Components related to content ideas
├── drafts/           # Components related to content drafts
├── pipeline/         # Content pipeline components
├── writing-style/    # Writing style management components
├── ...
```

### Shared Components

Shared components that are used across features are placed in:

```
src/components/ui/     # UI components (buttons, cards, etc.)
src/components/layout/ # Layout components (sidebar, headers, etc.)
```

## Component Composition

We follow these principles for component composition:

1. **Single Responsibility**: Each component should do one thing well
2. **Small Components**: Keep components under 150 lines of code
3. **Container/Presentational Pattern**: Separate data fetching from rendering
4. **Props Standardization**: Use consistent prop naming conventions

## Refactoring Guidelines

When a component grows too large:

1. Identify logical groupings of functionality
2. Extract those groups into separate components
3. Use composition to combine them
4. Consider creating custom hooks for complex logic

### Example: Kanban View Refactoring

The Kanban view was refactored from a monolithic component into:

- `KanbanView`: Main component managing data flow
- `KanbanGrid`: Handles the layout of columns
- `KanbanColumn`: Renders an individual status column
- `IdeaCard`: Renders a single content idea

This separation improves:
- Code maintainability
- Component reusability
- Testing isolation
- Performance optimization opportunities

## Best Practices

- Use TypeScript interfaces for prop definitions
- Implement proper error handling and loading states
- Maintain clear component boundaries
- Document complex components with JSDoc comments
- Follow the shadcn/ui component patterns
