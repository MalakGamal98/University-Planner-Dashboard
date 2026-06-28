export interface Exam {
  id: string
  title: string
  subjectId: string
  date: string
  location?: string
  duration?: number
  notes?: string
  createdAt: string
  updatedAt: string
}
