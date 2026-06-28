import { EmptyState } from '@/components/EmptyState'
import { IoBookOutline } from 'react-icons/io5'

export function SubjectsPage() {
  return (
    <EmptyState
      icon={<IoBookOutline className="h-8 w-8" />}
      title="No subjects added"
      subtitle="Subject management will be available in a future phase."
    />
  )
}
