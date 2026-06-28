export type AssignmentPriority = 'low' | 'medium' | 'high'
export type AssignmentStatus = 'todo' | 'in-progress' | 'completed'

export interface Assignment {
  id: string
  title: string
  description?: string
  subjectId: string
  dueDate: string
  priority: AssignmentPriority
  status: AssignmentStatus
  createdAt: string
  updatedAt: string
}
