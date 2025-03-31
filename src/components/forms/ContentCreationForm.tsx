import { useState } from 'react'
import { useFormValidation, useFormError } from '@/hooks/useFormValidation'
import { documentCreateSchema } from '@/utils/validation'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

type FormData = {
  title: string
  content: string
  type: 'blog' | 'newsletter' | 'whitepaper' | 'case-study' | 'transcript' | 'other'
  purpose: 'writing_sample' | 'content_idea' | 'research'
  content_type: 'linkedin' | 'newsletter' | 'marketing' | 'general' | null
}

interface ContentCreationFormProps {
  userId: string
  onSuccess?: () => void
}

export function ContentCreationForm({ userId, onSuccess }: ContentCreationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useFormValidation(documentCreateSchema)

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)
      
      const document = await supabase.from('documents').insert({
        ...data,
        user_id: userId,
        status: 'active',
        processing_status: 'idle',
        has_ideas: false,
        ideas_count: 0
      })

      if (!document) {
        throw new Error('Failed to create document')
      }

      toast.success('Content created successfully')
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error('Error creating content:', error)
      toast.error('Failed to create content')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Content</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...form.register('title')}
              placeholder="Enter content title"
            />
            {useFormError(form, 'title') && (
              <p className="text-sm text-red-500">{useFormError(form, 'title')}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              {...form.register('content')}
              placeholder="Enter your content"
              rows={5}
            />
            {useFormError(form, 'content') && (
              <p className="text-sm text-red-500">{useFormError(form, 'content')}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Content Type</Label>
            <Select
              onValueChange={(value) => form.setValue('type', value as FormData['type'])}
              defaultValue={form.getValues('type')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blog">Blog Post</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="whitepaper">Whitepaper</SelectItem>
                <SelectItem value="case-study">Case Study</SelectItem>
                <SelectItem value="transcript">Transcript</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {useFormError(form, 'type') && (
              <p className="text-sm text-red-500">{useFormError(form, 'type')}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Select
              onValueChange={(value) => form.setValue('purpose', value as FormData['purpose'])}
              defaultValue={form.getValues('purpose')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="writing_sample">Writing Sample</SelectItem>
                <SelectItem value="content_idea">Content Idea</SelectItem>
                <SelectItem value="research">Research</SelectItem>
              </SelectContent>
            </Select>
            {useFormError(form, 'purpose') && (
              <p className="text-sm text-red-500">{useFormError(form, 'purpose')}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content_type">Content Category</Label>
            <Select
              onValueChange={(value) => form.setValue('content_type', value as FormData['content_type'])}
              defaultValue={form.getValues('content_type')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select content category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
            {useFormError(form, 'content_type') && (
              <p className="text-sm text-red-500">{useFormError(form, 'content_type')}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Content'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 