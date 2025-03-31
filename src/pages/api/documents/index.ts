import { NextApiRequest, NextApiResponse } from 'next'
import { validateRequest } from '@/middleware/validationMiddleware'
import { documentCreateSchema } from '@/utils/validation'
import { createWrappedSupabaseClient } from '@/integrations/supabase/client'
import { handleApiError } from '@/utils/errorHandling'
import { Database } from '@/types/database'
import { z } from 'zod'

type Document = Database['public']['Tables']['documents']['Row']
type DocumentInsert = Database['public']['Tables']['documents']['Insert']
type ValidatedDocument = z.infer<typeof documentCreateSchema>

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get authenticated user
    const supabase = createWrappedSupabaseClient()
    const user = await supabase.getUser()

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Validate request body
    const validatedData = await documentCreateSchema.parseAsync({
      ...req.body,
      user_id: user.id
    }) as ValidatedDocument
    // Create document in database with required fields
    const documentData: DocumentInsert = {
      user_id: user.id,
      title: validatedData.title,
      type: validatedData.type,
      purpose: validatedData.purpose,
      content: validatedData.content,
      status: 'active', 
      processing_status: 'idle',
      has_ideas: false,
      ideas_count: 0
    }

    const document = await supabase.documents.insert(documentData)

    if (!document) {
      throw new Error('Failed to create document')
    }

    return res.status(201).json(document)
  } catch (error) {
    const { statusCode, message } = handleApiError(error)
    return res.status(statusCode).json({ error: message })
  }
} 