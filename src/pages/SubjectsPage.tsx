import { useState } from 'react'
import { IoBookOutline, IoAdd, IoSearchOutline } from 'react-icons/io5'
import { motion } from 'framer-motion'
import { EmptyState } from '@/components/EmptyState'
import { Button, Modal } from '@/components/ui'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { SubjectCard } from '@/components/SubjectCard'
import { SubjectForm } from '@/components/SubjectForm'
import { useSubjectStore } from '@/store/subjectStore'
import { useAssignmentStore } from '@/store/assignmentStore'
import { toast } from '@/store/toastStore'
import type { Subject } from '@/types/subject'
import type { SubjectFormData } from '@/schemas/subject'

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

export function SubjectsPage() {
  const { subjects, addSubject, updateSubject, deleteSubject } = useSubjectStore()
  const assignments = useAssignmentStore((s) => s.assignments)

  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null)

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddClick = () => {
    setEditingSubject(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (subject: Subject) => {
    setEditingSubject(subject)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setSubjectToDelete(id)
  }

  const handleConfirmDelete = () => {
    if (subjectToDelete) {
      deleteSubject(subjectToDelete)
      toast.success('Subject deleted successfully')
      setSubjectToDelete(null)
    }
  }

  const handleFormSubmit = (data: SubjectFormData) => {
    if (editingSubject) {
      updateSubject(editingSubject.id, data)
      toast.success('Subject updated successfully')
    } else {
      addSubject(data)
      toast.success('Subject added successfully')
    }
    setIsModalOpen(false)
    setEditingSubject(null)
  }

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted">
            <IoSearchOutline className="h-5 w-5" />
          </span>
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-surface pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        <Button onClick={handleAddClick} className="self-end sm:self-auto">
          <IoAdd className="h-5 w-5" />
          Add Subject
        </Button>
      </div>

      {/* Grid List */}
      {subjects.length === 0 ? (
        <EmptyState
          icon={<IoBookOutline className="h-8 w-8" />}
          title="No subjects added"
          subtitle="Add your subjects to start tracking course assignments and details."
          actionLabel="Add Subject"
          onAction={handleAddClick}
        />
      ) : filteredSubjects.length === 0 ? (
        <EmptyState
          icon={<IoSearchOutline className="h-8 w-8" />}
          title="No results found"
          subtitle={`No subjects match the search query "${searchQuery}"`}
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredSubjects.map((subject) => {
            const subjectAssignments = assignments.filter((a) => a.subjectId === subject.id)
            const count = subjectAssignments.length
            const completed = subjectAssignments.filter((a) => a.status === 'completed').length
            const pct = count > 0 ? Math.round((completed / count) * 100) : 0

            return (
              <motion.div key={subject.id} variants={itemVariants}>
                <SubjectCard
                  subject={subject}
                  assignmentCount={count}
                  completionPercentage={pct}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? 'Edit Subject' : 'Add Subject'}
        description={editingSubject ? 'Update details for this subject.' : 'Create a new subject for the dashboard.'}
      >
        <SubjectForm
          defaultValues={editingSubject || undefined}
          onSubmit={handleFormSubmit}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={subjectToDelete !== null}
        onClose={() => setSubjectToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Subject?"
        description="This will permanently delete this subject. This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}
