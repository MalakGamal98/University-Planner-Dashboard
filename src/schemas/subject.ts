import { z } from 'zod'

export const subjectSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Subject name is required').max(100),
  code: z.string().min(1, 'Subject code is required').max(20),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  credits: z.number().int().min(1).max(30),
  professor: z.string().max(100).optional(),
  schedule: z.string().max(200).optional(),
})

export type SubjectFormData = z.infer<typeof subjectSchema>
