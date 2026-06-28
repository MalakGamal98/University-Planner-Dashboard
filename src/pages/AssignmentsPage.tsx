import { EmptyState } from '@/components/EmptyState'
import { IoClipboardOutline } from 'react-icons/io5'

export function AssignmentsPage() {
  return (
    <EmptyState
      icon={<IoClipboardOutline className="h-8 w-8" />}
      title="No assignments yet"
      subtitle="Assignments will appear here once you add them in a future phase."
    />
  )
}
