import { IoCalendarOutline, IoCheckmarkCircleOutline, IoPencilOutline, IoTrashOutline, IoWarningOutline } from 'react-icons/io5'
import type { Assignment } from '@/types/assignment'
import type { Subject } from '@/types/subject'
import { Card, Button, Badge } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/cn'

interface AssignmentCardProps {
  assignment: Assignment
  subject?: Subject
  onEdit: (assignment: Assignment) => void
  onDelete: (id: string) => void
  onMarkComplete: (id: string) => void
}

export function AssignmentCard({
  assignment,
  subject,
  onEdit,
  onDelete,
  onMarkComplete,
}: AssignmentCardProps) {
  const todayStr = new Date().toISOString().split('T')[0]
  const isOverdue = assignment.dueDate < todayStr && assignment.status !== 'completed'

  const priorityColors = {
    low: 'bg-primary-50 text-primary-700 border-primary-100 dark:bg-primary-900/20 dark:text-primary-300 dark:border-primary-900/30',
    medium: 'bg-warning-bg text-warning border-amber-100 dark:border-warning/10',
    high: 'bg-error-bg text-error border-red-100 dark:border-error/10',
  }

  const statusColors = {
    todo: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    'in-progress': 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/30',
    completed: 'bg-success-bg text-success border-emerald-100 dark:border-success/10',
  }

  const statusLabels = {
    todo: 'Pending',
    'in-progress': 'In Progress',
    completed: 'Completed',
  }

  return (
    <Card
      className={cn(
        'relative border-l-4 transition-all duration-300 hover:shadow-md flex flex-col justify-between min-h-[220px]',
        isOverdue 
          ? 'border-l-error bg-error-bg/10 dark:bg-error-bg/5' 
          : subject ? '' : 'border-l-slate-300',
      )}
      style={!isOverdue && subject ? { borderLeftColor: subject.color } : undefined}
    >
      <div className="space-y-3">
        {/* Top Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            {/* Subject Indicator */}
            {subject ? (
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: subject.color }} />
                <span className="text-muted-foreground">{subject.name} ({subject.code})</span>
              </div>
            ) : (
              <span className="text-xs font-semibold text-muted-foreground">Unknown Subject</span>
            )}
            <h3 className={cn("text-base font-bold text-foreground line-clamp-2 text-left", assignment.status === 'completed' && 'line-through opacity-60')}>
              {assignment.title}
            </h3>
          </div>
          
          <div className="flex gap-1 shrink-0">
            <Button variant="ghost" size="sm" onClick={() => onEdit(assignment)} title="Edit assignment" aria-label="Edit assignment" className="cursor-pointer">
              <IoPencilOutline className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(assignment.id)} className="text-error hover:bg-error-bg cursor-pointer" title="Delete assignment" aria-label="Delete assignment">
              <IoTrashOutline className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Description */}
        {assignment.description && (
          <p className={cn("text-sm text-muted line-clamp-2 text-left", assignment.status === 'completed' && 'opacity-60')}>
            {assignment.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border space-y-3">
        {/* Badges row */}
        <div className="flex flex-wrap gap-2 items-center">
          <Badge className={cn('capitalize text-xs px-2 py-0.5 border', priorityColors[assignment.priority])}>
            {assignment.priority} Priority
          </Badge>
          <Badge className={cn('capitalize text-xs px-2 py-0.5 border', statusColors[assignment.status])}>
            {statusLabels[assignment.status]}
          </Badge>
          {isOverdue && (
            <Badge className="bg-error text-white text-xs px-2 py-0.5 flex items-center gap-1 animate-pulse">
              <IoWarningOutline className="h-3 w-3" />
              Overdue
            </Badge>
          )}
        </div>

        {/* Bottom row: Due Date and Actions */}
        <div className="flex justify-between items-center text-xs">
          <div className={cn("flex items-center gap-1.5", isOverdue ? "text-error font-semibold" : "text-muted-foreground")}>
            <IoCalendarOutline className="h-4 w-4" />
            <span>Due {formatDate(assignment.dueDate)}</span>
          </div>

          {assignment.status !== 'completed' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkComplete(assignment.id)}
              className="text-primary-600 hover:bg-primary-50 p-1 h-auto text-xs flex items-center gap-1 cursor-pointer"
            >
              <IoCheckmarkCircleOutline className="h-4 w-4" />
              <span>Mark Complete</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
