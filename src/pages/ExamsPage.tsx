import { EmptyState } from '@/components/EmptyState'
import { IoSchoolOutline } from 'react-icons/io5'

export function ExamsPage() {
  return (
    <EmptyState
      icon={<IoSchoolOutline className="h-8 w-8" />}
      title="No exams scheduled"
      subtitle="Exam tracking will be available in a future phase."
    />
  )
}
