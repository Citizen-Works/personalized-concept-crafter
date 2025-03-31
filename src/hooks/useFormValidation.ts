import { useForm, UseFormProps, UseFormReturn, FieldError } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ValidationError } from '@/utils/validation'

export function useFormValidation<T extends z.ZodType>(
  schema: T,
  options?: Omit<UseFormProps<z.infer<T>>, 'resolver'>
): UseFormReturn<z.infer<T>> {
  return useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    ...options
  })
}

export function useFormError<T extends z.ZodType>(
  form: UseFormReturn<z.infer<T>>,
  fieldName: keyof z.infer<T>
): string | undefined {
  const error = form.formState.errors[fieldName]
  return typeof error?.message === 'string' ? error.message : undefined
}

export function useFormErrors<T extends z.ZodType>(
  form: UseFormReturn<z.infer<T>>
): Record<keyof z.infer<T>, string> {
  return Object.entries(form.formState.errors).reduce((acc, [key, error]) => {
    acc[key as keyof z.infer<T>] = typeof error.message === 'string' ? error.message : ''
    return acc
  }, {} as Record<keyof z.infer<T>, string>)
}

export function handleValidationError(error: unknown): Record<string, string[]> {
  if (error instanceof ValidationError) {
    return error.getFormattedErrors()
  }
  return {
    form: [error instanceof Error ? error.message : 'An unexpected error occurred']
  }
} 