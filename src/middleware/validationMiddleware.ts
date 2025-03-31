import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { ValidationError } from '@/utils/validation'

export function validateRequest(schema: z.ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      const validatedData = await schema.parseAsync(req.body)
      req.body = validatedData
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = new ValidationError(error)
        const formattedErrors = validationError.getFormattedErrors()
        
        res.status(400).json({
          error: 'Validation failed',
          details: formattedErrors
        })
        return
      }
      
      next(error)
    }
  }
}

export function validateQueryParams(schema: z.ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate query parameters
      const validatedData = await schema.parseAsync(req.query)
      req.query = validatedData
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = new ValidationError(error)
        const formattedErrors = validationError.getFormattedErrors()
        
        res.status(400).json({
          error: 'Invalid query parameters',
          details: formattedErrors
        })
        return
      }
      
      next(error)
    }
  }
}

export function validatePathParams(schema: z.ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate path parameters
      const validatedData = await schema.parseAsync(req.params)
      req.params = validatedData
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = new ValidationError(error)
        const formattedErrors = validationError.getFormattedErrors()
        
        res.status(400).json({
          error: 'Invalid path parameters',
          details: formattedErrors
        })
        return
      }
      
      next(error)
    }
  }
}

// Example usage in an API route:
/*
import { validateRequest, validateQueryParams, validatePathParams } from '@/middleware/validationMiddleware'
import { documentCreateSchema, idSchema } from '@/utils/validation'

router.post(
  '/documents',
  validateRequest(documentCreateSchema),
  async (req, res) => {
    // Handle document creation
  }
)

router.get(
  '/documents/:id',
  validatePathParams(z.object({ id: idSchema })),
  validateQueryParams(z.object({ include: z.enum(['ideas', 'metadata']).optional() })),
  async (req, res) => {
    // Handle document retrieval
  }
)
*/ 