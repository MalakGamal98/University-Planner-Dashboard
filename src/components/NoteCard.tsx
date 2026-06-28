import { IoCalendarOutline, IoPencilOutline, IoTrashOutline } from 'react-icons/io5'
import type { Note } from '@/types/note'
import { Card, Button } from '@/components/ui'
import { formatDate } from '@/lib/utils'

interface NoteCardProps {
  note: Note
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  return (
    <Card className="flex flex-col justify-between h-[200px] hover:shadow-md transition-all duration-300">
      <div className="space-y-2 overflow-hidden">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-base font-bold text-foreground line-clamp-1">{note.title}</h3>
          <div className="flex gap-1 shrink-0">
            <Button variant="ghost" size="sm" onClick={() => onEdit(note)} aria-label="Edit note">
              <IoPencilOutline className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(note.id)} className="text-error hover:bg-error-bg" aria-label="Delete note">
              <IoTrashOutline className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted line-clamp-4 whitespace-pre-wrap text-left">{note.content}</p>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-4 border-t border-border mt-auto">
        <IoCalendarOutline className="h-3.5 w-3.5" />
        <span>{formatDate(note.createdAt)}</span>
      </div>
    </Card>
  )
}
