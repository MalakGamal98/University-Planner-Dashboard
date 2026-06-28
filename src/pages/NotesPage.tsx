import { EmptyState } from '@/components/EmptyState'
import { IoDocumentTextOutline } from 'react-icons/io5'

export function NotesPage() {
  return (
    <EmptyState
      icon={<IoDocumentTextOutline className="h-8 w-8" />}
      title="No notes yet"
      subtitle="Your study notes will live here in a future phase."
    />
  )
}
