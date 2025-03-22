# Extending the AI Prompt System

This guide explains how to extend and modify the prompt engineering system used for AI content generation.

## Prompt System Architecture

The Content Engine uses a sophisticated prompt assembly system to generate context-rich prompts for Claude AI. The system is designed to be modular and extensible.

### Key Components:

1. **Base Prompt Builder** (`src/utils/promptBuilder/basePromptBuilder.ts`)
   - Core prompt building functionality
   - Template management and assembly

2. **Content-Specific Sections** (`src/utils/promptBuilder/contentSpecificSections.ts`)
   - Content type-specific prompting structures
   - Specialized instructions for different content formats

3. **Best Practices** (`src/utils/promptBuilder/contentBestPractices.ts`)
   - Reusable content guidelines
   - Format-specific recommendations

4. **Prompt Assembly Hook** (`src/hooks/usePromptAssembly.tsx`)
   - Assembles relevant context (writing style, business context, etc.)
   - Constructs final prompt for Claude AI

## Adding New Content Types

To add support for a new content type (e.g., "social media story"):

### 1. Update Type Definitions

Add the new content type to `src/types/content.ts`:

```typescript
export type ContentType = "linkedin_post" | "blog_post" | "newsletter" | "social_media_story";
```

### 2. Add Content-Specific Prompt Sections

In `contentSpecificSections.ts`, add a new section for your content type:

```typescript
export const socialMediaStorySection = `
# Social Media Story Guidelines

Stories should be:
- Visual and engaging
- 15-20 seconds per frame
- Include a clear call to action
- Use vertical format optimized for mobile
`;
```

### 3. Add Best Practices

In `contentBestPractices.ts`, add best practices for your content type:

```typescript
export const socialMediaStoryBestPractices = `
- Use bold visuals that work without sound
- Front-load key information in the first 3 seconds
- Keep text concise (< 125 characters per frame)
- Include interactive elements (polls, questions)
- End with a clear CTA
`;
```

### 4. Update Prompt Assembly

Modify `usePromptAssembly.tsx` to handle the new content type:

```typescript
// Add case for new content type
switch (contentType) {
  case "social_media_story":
    promptSections.push(
      contentSpecificSections.socialMediaStorySection,
      contentBestPractices.socialMediaStoryBestPractices
    );
    break;
  // ... other cases
}
```

### 5. Update Generation UI

Ensure the UI allows selecting the new content type for generation.

## Customizing Existing Prompts

To modify an existing prompt:

1. Locate the relevant section in the prompt builder files
2. Update the template string with your modifications
3. Test the changes by generating content of that type

### Example: Enhancing LinkedIn Post Prompts

```typescript
// Original
export const linkedinPostSection = `
# LinkedIn Post Guidelines
...existing guidelines...
`;

// Enhanced version
export const linkedinPostSection = `
# LinkedIn Post Guidelines
...existing guidelines...

## Additional LinkedIn Algorithm Tips
- Posts with 'broetry' style line breaks tend to get more engagement
- Posts asking questions get 50% more comments
- Avoid more than 2 external links
`;
```

## Advanced: Creating Dynamic Prompts

For more complex scenarios, you can create dynamic prompt sections:

```typescript
export const createDynamicSection = (userData: UserData) => `
# Personalized Guidelines for ${userData.name}

Based on your previous content performance:
- Focus on ${userData.topPerformingTopic}
- Use ${userData.preferredStyle} writing style
- Target your ${userData.primaryAudience} audience
`;
```

Then use it in the prompt assembly:

```typescript
const dynamicSection = createDynamicSection(userData);
promptSections.push(dynamicSection);
```

## Testing Prompt Changes

Always test prompt changes before deployment:

1. Use the "Debug Prompt" feature in the UI to preview the assembled prompt
2. Generate test content with the modified prompt
3. Verify the output meets expectations
4. Consider A/B testing significant prompt changes

## Best Practices

- Keep prompt sections focused and modular
- Use clear formatting (headings, bullet points) for better AI interpretation
- Maintain consistent style across prompt sections
- Document the purpose of each prompt section
- Balance between specificity and flexibility in instructions
- Consider token usage - be concise but comprehensive
