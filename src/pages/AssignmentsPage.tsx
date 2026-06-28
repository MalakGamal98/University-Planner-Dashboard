import { useState, useMemo } from 'react'
import { IoClipboardOutline, IoAdd, IoSearchOutline, IoFilterOutline } from 'react-icons/io5'
import { motion } from 'framer-motion'
import { EmptyState } from '@/components/EmptyState'
import { Button, Modal } from '@/components/ui'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { AssignmentCard } from '@/components/AssignmentCard'
import { AssignmentForm } from '@/components/AssignmentForm'
import { useAssignmentStore } from '@/store/assignmentStore'
import { useSubjectStore } from '@/store/subjectStore'
import { toast } from '@/store/toastStore'
import type { Assignment } from '@/types/assignment'
import type { AssignmentFormData } from '@/schemas/assignment'
import { useNavigate } from 'react-router-dom'

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

export function AssignmentsPage() {
  const { assignments, addAssignment, updateAssignment, deleteAssignment, markComplete } = useAssignmentStore()
  const subjects = useSubjectStore((s) => s.subjects)
  const navigate = useNavigate()

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDateAsc')

  // Modals & Dialogs
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null)
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null)

  // Map subjects for easy lookup
  const subjectMap = useMemo(() => {
    return new Map(subjects.map((s) => [s.id, s]))
  }, [subjects])

  // Filtered & Sorted Assignments
  const filteredAndSortedAssignments = useMemo(() => {
    let result = [...assignments]

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((a) => a.title.toLowerCase().includes(q))
    }

    // Status Filter
    if (statusFilter !== 'all') {
      result = result.filter((a) => a.status === statusFilter)
    }

    // Priority Filter
    if (priorityFilter !== 'all') {
      result = result.filter((a) => a.priority === priorityFilter)
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'dueDateAsc') {
        return a.dueDate.localeCompare(b.dueDate)
      }
      if (sortBy === 'dueDateDesc') {
        return b.dueDate.localeCompare(a.dueDate)
      }
      if (sortBy === 'priority') {
        const priorityWeights = { high: 3, medium: 2, low: 1 }
        return priorityWeights[b.priority] - priorityWeights[a.priority] // high priority first
      }
      if (sortBy === 'subject') {
        const nameA = subjectMap.get(a.subjectId)?.name || ''
        const nameB = subjectMap.get(b.subjectId)?.name || ''
        return nameA.localeCompare(nameB)
      }
      return 0
    })

    return result
  }, [assignments, searchQuery, statusFilter, priorityFilter, sortBy, subjectMap])

  const handleAddClick = () => {
    setEditingAssignment(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (assignment: Assignment) => {
    setEditingAssignment(assignment)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setAssignmentToDelete(id)
  }

  const handleConfirmDelete = () => {
    if (assignmentToDelete) {
      deleteAssignment(assignmentToDelete)
      toast.success('Assignment deleted successfully')
      setAssignmentToDelete(null)
    }
  }

  const handleMarkComplete = (id: string) => {
    markComplete(id)
    toast.success('Assignment marked complete')
  }

  const handleFormSubmit = (data: AssignmentFormData) => {
    if (editingAssignment) {
      updateAssignment(editingAssignment.id, data)
      toast.success('Assignment updated successfully')
    } else {
      addAssignment(data)
      toast.success('Assignment added successfully')
    }
    setIsModalOpen(false)
    setEditingAssignment(null)
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setPriorityFilter('all')
    setSortBy('dueDateAsc')
  }

  const hasSubjects = subjects.length > 0

  return (
    <div className="space-y-6">
      {/* Top action/filter toolbar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted">
              <IoSearchOutline className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-surface pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <Button onClick={handleAddClick} disabled={!hasSubjects}>
            <IoAdd className="h-5 w-5" />
            Add Assignment
          </Button>
        </div>

        {/* Filters and Sorting bar */}
        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:flex-wrap">
          <div className="flex flex-col gap-1.5 sm:min-w-[140px]">
            <span className="text-xs font-semibold text-muted">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="todo">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 sm:min-w-[140px]">
            <span className="text-xs font-semibold text-muted">Priority</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 sm:min-w-[160px] col-span-2">
            <span className="text-xs font-semibold text-muted">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
            >
              <option value="dueDateAsc">Deadline (Soonest first)</option>
              <option value="dueDateDesc">Deadline (Latest first)</option>
              <option value="priority">Priority (High first)</option>
              <option value="subject">Subject Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      {!hasSubjects ? (
        <EmptyState
          icon={<IoClipboardOutline className="h-8 w-8" />}
          title="Create a subject first"
          subtitle="You need to create at least one subject before you can manage coursework or assignments."
          actionLabel="Go to Subjects"
          onAction={() => navigate('/subjects')}
        />
      ) : assignments.length === 0 ? (
        <EmptyState
          icon={<IoClipboardOutline className="h-8 w-8" />}
          title="No assignments yet"
          subtitle="Add assignments and tasks to start planning and staying on top of deadlines."
          actionLabel="Add Assignment"
          onAction={handleAddClick}
        />
      ) : filteredAndSortedAssignments.length === 0 ? (
        <EmptyState
          icon={<IoFilterOutline className="h-8 w-8" />}
          title="No results match filters"
          subtitle="Try adjusting or clearing your search query and filters."
          actionLabel="Clear Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredAndSortedAssignments.map((assignment) => (
            <motion.div key={assignment.id} variants={itemVariants}>
              <AssignmentCard
                assignment={assignment}
                subject={subjectMap.get(assignment.subjectId)}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onMarkComplete={handleMarkComplete}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAssignment ? 'Edit Assignment' : 'Add Assignment'}
        description={editingAssignment ? 'Modify task details or change the status.' : 'Define a new assignment with due dates and priority.'}
      >
        <AssignmentForm
          defaultValues={editingAssignment || undefined}
          onSubmit={handleFormSubmit}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={assignmentToDelete !== null}
        onClose={() => setAssignmentToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Assignment?"
        description="Are you sure you want to delete this assignment? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}
