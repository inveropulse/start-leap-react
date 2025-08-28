import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
export const uuidSchema = z.string().uuid('Invalid UUID format');

// Utility functions for validation
export function createValidationError(message: string, path?: string[]): z.ZodError {
  return new z.ZodError([
    {
      code: z.ZodIssueCode.custom,
      message,
      path: path || []
    }
  ]);
}

export function formatValidationError(error: z.ZodError): Record<string, string> {
  return error.errors.reduce((acc, curr) => {
    const path = curr.path.join('.');
    acc[path] = curr.message;
    return acc;
  }, {} as Record<string, string>);
}

// Safe parsing utility
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: formatValidationError(result.error)
  };
}