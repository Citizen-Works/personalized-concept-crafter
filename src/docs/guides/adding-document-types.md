
# Adding New Document Types

This guide explains how to add new document types to the Content Engine.

## Document Type System Overview

The Content Engine supports different types of documents, each with specific processing and usage in the content generation pipeline. Documents have both a `type` (the format) and a `purpose` (how they're used in the system).

## Current Document Types

**Types**:
- `blog`: Blog post content
- `transcript`: Meeting or audio transcripts
- `whitepaper`: Technical or business whitepapers
- `other`: Miscellaneous documents

**Purposes**:
- `business_context`: Provides background information about the business
- `writing_sample`: Used as examples for AI to follow writing style
- `reference_material`: Used as factual sources

**Content Types** (for writing samples):
- `general`: General writing style
- `linkedin`: LinkedIn-specific style
- `newsletter`: Newsletter-specific style
- `marketing`: Marketing content style

## Adding a New Document Type

### 1. Update Type Definitions

First, update the TypeScript type definitions in `src/types/documents.ts`:

```typescript
export type DocumentType = "blog" | "transcript" | "whitepaper" | "other" | "your_new_type";
```

For a new content type (for writing samples):

```typescript
export type DocumentContentType = null | "general" | "linkedin" | "newsletter" | "marketing" | "your_new_content_type";
```

### 2. Update UI Components

Update any component that displays document type options:

- `src/components/source-materials/AddTextForm.tsx`
- `src/components/documents/DocumentFormFields.tsx`
- `src/components/source-materials/SourceMaterialsFilters.tsx`

### 3. Custom Processing (if needed)

If your new document type requires special processing:

1. Create a new processor in `src/services/documents/processors/`
2. Update the document processing logic in `src/services/documents/transcriptService.ts`

### 4. Update Prompt Assembly

To include your new document type in prompts:

1. Update `src/hooks/usePromptAssembly.tsx` to handle the new document type
2. Modify related prompt templates in `src/utils/promptBuilder/`

### 5. Testing

Create test cases for your new document type:

1. Create example documents
2. Test document upload and processing
3. Test document retrieval and display
4. Test inclusion in prompt assembly

## Example: Adding "Case Study" Document Type

Here's an example of adding a "Case Study" document type:

1. Update type definitions:
   ```typescript
   export type DocumentType = "blog" | "transcript" | "whitepaper" | "other" | "case_study";
   ```

2. Add to UI form options:
   ```tsx
   <option value="case_study">Case Study</option>
   ```

3. Update document filter components to include the new type

4. If special processing is needed, create a case study processor

5. Update prompt assembly to properly incorporate case studies in relevant prompts

6. Test the new document type through the entire workflow

## Best Practices

- Keep document type names consistent and lowercase
- Document all processing logic specific to the document type
- Consider how the document type will be used in prompts
- Update filters and sorting logic to properly handle the new type
- Ensure proper validation for the new document type
