import { IoCalendarOutline, IoLocationOutline, IoTimeOutline, IoPencilOutline, IoTrashOutline } from 'react-icons/io5'
import type { Exam } from '@/types/exam'
import type { Subject } from '@/types/subject'
import { Card, Button } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import { useCountdown } from '@/hooks/useCountdown'
import { cn } from '@/lib/cn'

interface ExamCardProps {
  exam: Exam
  subject?: Subject
  onEdit: (exam: Exam) => void
  onDelete: (id: string) => void
}

export function ExamCard({ exam, subject, onEdit, onDelete }: ExamCardProps) {
  const { days, hours, minutes, seconds, isOver } = useCountdown(exam.date)

  const examTime = new Date(exam.date).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Card
      className={cn(
        'relative border-l-4 transition-all duration-300 hover:shadow-md flex flex-col justify-between min-h-[220px]',
        isOver
          ? 'border-l-slate-300 bg-slate-50/50 dark:bg-slate-900/10 opacity-60'
          : subject
          ? ''
          : 'border-l-slate-300',
      )}
      style={!isOver && subject ? { borderLeftColor: subject.color } : undefined}
    >
      <div className="space-y-3">
        {/* Top Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            {subject ? (
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: subject.color }} />
                <span className="text-muted-foreground">{subject.name} ({subject.code})</span>
              </div>
            ) : (
              <span className="text-xs font-semibold text-muted-foreground">Unknown Subject</span>
            )}
            <h3 className="text-base font-bold text-foreground line-clamp-2 text-left">
              {exam.title}
            </h3>
          </div>

          <div className="flex gap-1 shrink-0">
            <Button variant="ghost" size="sm" onClick={() => onEdit(exam)} title="Edit exam" aria-label="Edit exam" className="cursor-pointer">
              <IoPencilOutline className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(exam.id)} className="text-error hover:bg-error-bg cursor-pointer" title="Delete exam" aria-label="Delete exam">
              <IoTrashOutline className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Location & Duration */}
        <div className="grid grid-cols-1 gap-1 text-xs text-muted">
          {exam.location && (
            <div className="flex items-center gap-1.5 min-w-0">
              <IoLocationOutline className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{exam.location}</span>
            </div>
          )}
          {exam.duration && (
            <div className="flex items-center gap-1.5 min-w-0">
              <IoTimeOutline className="h-3.5 w-3.5 shrink-0" />
              <span>Duration: {exam.duration} mins</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border space-y-3">
        {/* Date Time info */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <IoCalendarOutline className="h-4 w-4" />
          <span>{formatDate(exam.date)} at {examTime}</span>
        </div>

        {/* Live Countdown Display */}
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-muted-foreground">Countdown:</span>
          {isOver ? (
            <span className="text-muted">Passed</span>
          ) : (
            <span className="text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md font-mono dark:bg-primary-900/20 dark:text-primary-300">
              {days > 0 && `${days}d `}
              {hours.toString().padStart(2, '0')}h{' '}
              {minutes.toString().padStart(2, '0')}m{' '}
              {seconds.toString().padStart(2, '0')}s
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}
