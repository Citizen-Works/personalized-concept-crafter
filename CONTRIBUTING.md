
# Contributing to Content Engine

Thank you for your interest in contributing to Content Engine! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) in all your interactions with the project.

## How Can I Contribute?

### Reporting Bugs

- Use the issue tracker to report bugs
- Describe the bug in detail including steps to reproduce
- Include browser/OS information
- If applicable, include screenshots

### Suggesting Enhancements

- Use the issue tracker to suggest enhancements
- Clearly describe the enhancement and its benefits
- Provide any relevant examples or mockups

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and ensure they pass
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

Follow these steps to set up your development environment:

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env.local` file based on `.env.example`
4. Run the development server with `npm run dev`

## Coding Guidelines

### General Guidelines

- Follow the existing code style
- Write clean, readable, and well-documented code
- Keep components small and focused (under 150 lines)
- Create new components rather than extending existing ones
- Add tests for new features

### TypeScript

- Use TypeScript for all new code
- Define interfaces for component props
- Avoid using `any` type
- Use proper type imports

### Component Structure

- Follow the feature-based organization pattern
- Place reusable UI components in the `src/components/ui` directory
- Create custom hooks for complex logic in `src/hooks`

### Styling

- Use Tailwind CSS for styling
- Follow the shadcn/ui component patterns
- Maintain responsive design across all components

### Testing

- Write tests for all new components and features
- Follow the testing patterns in existing tests
- Test both success and error states

## Commit Message Guidelines

Follow these guidelines for commit messages:

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests after the first line

## Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Add relevant tests for your changes
4. Your PR needs approval from at least one maintainer
5. Squash commits before merging

## License

By contributing to Content Engine, you agree that your contributions will be licensed under the project's MIT license.
