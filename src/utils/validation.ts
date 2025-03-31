import { z } from 'zod'
import { Database } from '@/types/database'

// Common validation schemas
export const idSchema = z.string().uuid()
export const emailSchema = z.string().email()
export const passwordSchema = z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
  message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
})

// Document schemas
export const documentTypeSchema = z.enum(['blog', 'newsletter', 'whitepaper', 'case-study', 'transcript', 'other'])
export const documentPurposeSchema = z.enum(['writing_sample', 'content_idea', 'research'])
export const documentStatusSchema = z.enum(['active', 'archived'])
export const documentContentTypeSchema = z.enum(['linkedin', 'newsletter', 'marketing', 'general']).nullable()
export const documentProcessingStatusSchema = z.enum(['idle', 'processing', 'completed', 'failed'])

export const documentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  content: z.string().nullable(),
  type: documentTypeSchema,
  purpose: documentPurposeSchema,
  status: documentStatusSchema,
  content_type: documentContentTypeSchema,
  processing_status: documentProcessingStatusSchema,
  has_ideas: z.boolean(),
  ideas_count: z.number().int().min(0)
})

export const documentCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  content: z.string().nullable(),
  type: documentTypeSchema,
  purpose: documentPurposeSchema,
  content_type: documentContentTypeSchema,
  user_id: z.string().uuid()
})

export const documentUpdateSchema = documentSchema.partial()

// Content Idea schemas
export const contentIdeaSourceSchema = z.enum(['transcript', 'manual', 'ai_generated'])
export const contentIdeaStatusSchema = z.enum(['unreviewed', 'approved', 'rejected'])

export const contentIdeaSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().min(1, 'Description is required'),
  source: contentIdeaSourceSchema,
  source_url: z.string().url().nullable(),
  status: contentIdeaStatusSchema,
  has_been_used: z.boolean()
})

export const contentIdeaCreateSchema = contentIdeaSchema.extend({
  user_id: z.string().uuid()
})

export const contentIdeaUpdateSchema = contentIdeaSchema.partial()

// User Context schemas
export const userContextSchema = z.object({
  business_name: z.string().min(1, 'Business name is required').max(255, 'Business name is too long'),
  business_description: z.string().min(1, 'Business description is required'),
  target_audience: z.string().min(1, 'Target audience is required'),
  content_pillars: z.array(z.string().min(1, 'Content pillar cannot be empty'))
})

export const userContextCreateSchema = userContextSchema.extend({
  user_id: z.string().uuid()
})

export const userContextUpdateSchema = userContextSchema.partial()

// Webhook Configuration schemas
export const webhookConfigSchema = z.object({
  service_name: z.string().min(1, 'Service name is required'),
  is_active: z.boolean()
})

export const webhookConfigCreateSchema = webhookConfigSchema.extend({
  user_id: z.string().uuid()
})

export const webhookConfigUpdateSchema = webhookConfigSchema.partial()

// Validation error handling
export class ValidationError extends Error {
  constructor(public errors: z.ZodError) {
    super('Validation failed')
    this.name = 'ValidationError'
  }

  getFormattedErrors(): Record<string, string[]> {
    return this.errors.errors.reduce((acc, error) => {
      const path = error.path.join('.')
      if (!acc[path]) {
        acc[path] = []
      }
      acc[path].push(error.message)
      return acc
    }, {} as Record<string, string[]>)
  }
}

// Validation helper functions
export const validateInput = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error)
    }
    throw error
  }
}

export const validatePartialInput = <T extends z.ZodObject<any>>(
  schema: T,
  data: unknown
): Partial<z.infer<T>> => {
  try {
    return schema.partial().parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error)
    }
    throw error
  }
} 