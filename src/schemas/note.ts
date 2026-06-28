import { z } from 'zod'

export const noteSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required').max(10000),
  subjectId: z.string().uuid().optional(),
  tags: z.array(z.string().max(50)).max(10).default([]),
})

export type NoteFormData = z.infer<typeof noteSchema>
