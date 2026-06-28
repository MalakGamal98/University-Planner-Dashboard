import { z } from 'zod'

export const assignmentPrioritySchema = z.enum(['low', 'medium', 'high'])
export const assignmentStatusSchema = z.enum(['todo', 'in-progress', 'completed'])

export const assignmentSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  subjectId: z.string().uuid('Please select a subject'),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: assignmentPrioritySchema,
  status: assignmentStatusSchema,
})

export type AssignmentFormData = z.infer<typeof assignmentSchema>
