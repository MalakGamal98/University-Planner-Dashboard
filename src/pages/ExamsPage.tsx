import { useState, useMemo } from 'react'
import { IoSchoolOutline, IoAdd, IoCalendarOutline, IoLocationOutline } from 'react-icons/io5'
import { motion } from 'framer-motion'
import { EmptyState } from '@/components/EmptyState'
import { Button, Modal } from '@/components/ui'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { ExamCard } from '@/components/ExamCard'
import { ExamForm } from '@/components/ExamForm'
import { useExamStore } from '@/store/examStore'
import { useSubjectStore } from '@/store/subjectStore'
import { useCountdown } from '@/hooks/useCountdown'
import { toast } from '@/store/toastStore'
import { formatDate } from '@/lib/utils'
import type { Exam } from '@/types/exam'
import { useNavigate } from 'react-router-dom'
import type { Subject } from '@/types/subject'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } },
}

function NearestExamHero({ exam, subject }: { exam: Exam; subject?: Subject }) {
  const { days, hours, minutes, seconds } = useCountdown(exam.date)

  const examTime = new Date(exam.date).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-600 to-indigo-700 p-6 md:p-8 text-white shadow-lg">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/5 blur-2xl -mr-10 -mt-10" />

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between relative z-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-xs animate-pulse">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
            <span>Nearest Upcoming Exam</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-left">{exam.title}</h2>
          {subject && (
            <p className="text-sm text-primary-100 font-medium text-left">
              {subject.name} &bull; {subject.code}
            </p>
          )}

          <div className="flex flex-wrap gap-4 text-xs text-primary-100 mt-2">
            <div className="flex items-center gap-1.5">
              <IoCalendarOutline className="h-4 w-4" />
              <span>{formatDate(exam.date)} at {examTime}</span>
            </div>
            {exam.location && (
              <div className="flex items-center gap-1.5">
                <IoLocationOutline className="h-4 w-4" />
                <span>{exam.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Large Countdown display */}
        <div className="flex gap-2.5 md:gap-4 justify-start md:justify-end">
          <div className="flex flex-col items-center justify-center h-16 w-16 md:h-20 md:w-20 rounded-xl bg-white/10 backdrop-blur-md shadow-inner">
            <span className="text-lg md:text-2xl font-bold font-mono">{days.toString().padStart(2, '0')}</span>
            <span className="text-[10px] md:text-xs text-primary-100 font-medium uppercase mt-0.5">Days</span>
          </div>
          <div className="flex flex-col items-center justify-center h-16 w-16 md:h-20 md:w-20 rounded-xl bg-white/10 backdrop-blur-md shadow-inner">
            <span className="text-lg md:text-2xl font-bold font-mono">{hours.toString().padStart(2, '0')}</span>
            <span className="text-[10px] md:text-xs text-primary-100 font-medium uppercase mt-0.5">Hours</span>
          </div>
          <div className="flex flex-col items-center justify-center h-16 w-16 md:h-20 md:w-20 rounded-xl bg-white/10 backdrop-blur-md shadow-inner">
            <span className="text-lg md:text-2xl font-bold font-mono">{minutes.toString().padStart(2, '0')}</span>
            <span className="text-[10px] md:text-xs text-primary-100 font-medium uppercase mt-0.5">Mins</span>
          </div>
          <div className="flex flex-col items-center justify-center h-16 w-16 md:h-20 md:w-20 rounded-xl bg-white/10 backdrop-blur-md shadow-inner border border-white/10">
            <span className="text-lg md:text-2xl font-bold font-mono text-emerald-300">{seconds.toString().padStart(2, '0')}</span>
            <span className="text-[10px] md:text-xs text-emerald-200 font-medium uppercase mt-0.5">Secs</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ExamsPage() {
  const { exams, addExam, updateExam, deleteExam } = useExamStore()
  const subjects = useSubjectStore((s) => s.subjects)
  const navigate = useNavigate()

  // Modals & Dialogs
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExam, setEditingExam] = useState<Exam | null>(null)
  const [examToDelete, setExamToDelete] = useState<string | null>(null)

  // Map subjects for easy lookup
  const subjectMap = useMemo(() => {
    return new Map(subjects.map((s) => [s.id, s]))
  }, [subjects])

  // Nearest upcoming exam
  const nearestExam = useMemo(() => {
    const future = exams.filter((e) => new Date(e.date).getTime() > Date.now())
    future.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    return future[0]
  }, [exams])

  // All other exams sorted (upcoming first, then past)
  const sortedExams = useMemo(() => {
    const future = exams.filter((e) => new Date(e.date).getTime() > Date.now())
    const past = exams.filter((e) => new Date(e.date).getTime() <= Date.now())

    future.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // latest past first

    return [...future, ...past]
  }, [exams])

  const handleAddClick = () => {
    setEditingExam(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (exam: Exam) => {
    setEditingExam(exam)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setExamToDelete(id)
  }

  const handleConfirmDelete = () => {
    if (examToDelete) {
      deleteExam(examToDelete)
      toast.success('Exam deleted successfully')
      setExamToDelete(null)
    }
  }

  const handleFormSubmit = (data: {
    title: string
    subjectId: string
    date: string
    location?: string
    duration?: number
    notes?: string
  }) => {
    if (editingExam) {
      updateExam(editingExam.id, data)
      toast.success('Exam updated successfully')
    } else {
      addExam(data)
      toast.success('Exam added successfully')
    }
    setIsModalOpen(false)
    setEditingExam(null)
  }

  const hasSubjects = subjects.length > 0

  return (
    <div className="space-y-6 text-left">
      {/* Top action bar */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-foreground">Exams Schedule</h2>
        <Button onClick={handleAddClick} disabled={!hasSubjects}>
          <IoAdd className="h-5 w-5" />
          Add Exam
        </Button>
      </div>

      {/* Main content grid */}
      {!hasSubjects ? (
        <EmptyState
          icon={<IoSchoolOutline className="h-8 w-8" />}
          title="Create a subject first"
          subtitle="You need to create at least one subject before you can schedule exams."
          actionLabel="Go to Subjects"
          onAction={() => navigate('/subjects')}
        />
      ) : exams.length === 0 ? (
        <EmptyState
          icon={<IoSchoolOutline className="h-8 w-8" />}
          title="No exams yet"
          subtitle="Schedule upcoming exams, tests, and finals to stay prepared and count down live."
          actionLabel="Add Exam"
          onAction={handleAddClick}
        />
      ) : (
        <div className="space-y-8">
          {/* Prominent Nearest Exam countdown banner */}
          {nearestExam && (
            <NearestExamHero exam={nearestExam} subject={subjectMap.get(nearestExam.subjectId)} />
          )}

          {/* Staggered Grid List */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">All scheduled exams</h3>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {sortedExams.map((exam) => (
                <motion.div key={exam.id} variants={itemVariants}>
                  <ExamCard
                    exam={exam}
                    subject={subjectMap.get(exam.subjectId)}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExam ? 'Edit Exam' : 'Add Exam'}
        description={editingExam ? 'Modify exam date, location, or notes.' : 'Schedule a new test or exam.'}
      >
        <ExamForm
          defaultValues={editingExam || undefined}
          onSubmit={handleFormSubmit}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={examToDelete !== null}
        onClose={() => setExamToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Exam?"
        description="Are you sure you want to delete this exam? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}
