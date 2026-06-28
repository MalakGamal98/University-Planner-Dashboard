import { IoBookOutline, IoCalendarOutline, IoPersonOutline, IoPencilOutline, IoTrashOutline } from 'react-icons/io5'
import type { Subject } from '@/types/subject'
import { Card, Button } from '@/components/ui'
import { motion } from 'framer-motion'

interface SubjectCardProps {
  subject: Subject
  assignmentCount: number
  completionPercentage: number
  onEdit: (subject: Subject) => void
  onDelete: (id: string) => void
}

export function SubjectCard({
  subject,
  assignmentCount,
  completionPercentage,
  onEdit,
  onDelete,
}: SubjectCardProps) {
  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-md border-l-4" style={{ borderLeftColor: subject.color }}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: subject.color }} />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{subject.code}</span>
          </div>
          <h3 className="text-lg font-bold text-foreground line-clamp-1">{subject.name}</h3>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(subject)} title="Edit subject" aria-label="Edit subject" className="cursor-pointer">
            <IoPencilOutline className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(subject.id)} className="text-error hover:bg-error-bg cursor-pointer" title="Delete subject" aria-label="Delete subject">
            <IoTrashOutline className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-y-2 text-xs text-muted">
        {subject.professor && (
          <div className="flex items-center gap-1.5 min-w-0">
            <IoPersonOutline className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{subject.professor}</span>
          </div>
        )}
        {subject.schedule && (
          <div className="flex items-center gap-1.5 min-w-0">
            <IoCalendarOutline className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{subject.schedule}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 col-span-2">
          <IoBookOutline className="h-3.5 w-3.5 shrink-0" />
          <span>{subject.credits} {subject.credits === 1 ? 'credit' : 'credits'}</span>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-muted-foreground">{assignmentCount} {assignmentCount === 1 ? 'assignment' : 'assignments'}</span>
          <span className="text-foreground">{completionPercentage}% complete</span>
        </div>
        <div className="h-2 w-full rounded-full bg-border overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: subject.color }}
          />
        </div>
      </div>
    </Card>
  )
}
