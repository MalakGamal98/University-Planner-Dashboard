import { z } from 'zod'

export const examSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Title is required').max(200),
  subjectId: z.string().uuid('Please select a subject'),
  date: z.string().min(1, 'Exam date is required'),
  location: z.string().max(200).optional(),
  duration: z.number().int().min(15).max(480).optional(),
  notes: z.string().max(2000).optional(),
})

export type ExamFormData = z.infer<typeof examSchema>
