import { useState } from 'react'
import { IoDocumentTextOutline, IoAdd, IoSearchOutline } from 'react-icons/io5'
import { motion } from 'framer-motion'
import { EmptyState } from '@/components/EmptyState'
import { Button, Modal } from '@/components/ui'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { NoteCard } from '@/components/NoteCard'
import { NoteForm } from '@/components/NoteForm'
import { useNoteStore } from '@/store/noteStore'
import { toast } from '@/store/toastStore'
import type { Note } from '@/types/note'
import type { NoteFormData } from '@/schemas/note'

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

export function NotesPage() {
  const { notes, addNote, updateNote, deleteNote } = useNoteStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null)

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddClick = () => {
    setEditingNote(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (note: Note) => {
    setEditingNote(note)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setNoteToDelete(id)
  }

  const handleConfirmDelete = () => {
    if (noteToDelete) {
      deleteNote(noteToDelete)
      toast.success('Note deleted successfully')
      setNoteToDelete(null)
    }
  }

  const handleFormSubmit = (data: NoteFormData) => {
    if (editingNote) {
      updateNote(editingNote.id, data)
      toast.success('Note updated successfully')
    } else {
      addNote(data)
      toast.success('Note added successfully')
    }
    setIsModalOpen(false)
    setEditingNote(null)
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
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-surface pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        <Button onClick={handleAddClick} className="self-end sm:self-auto">
          <IoAdd className="h-5 w-5" />
          New Note
        </Button>
      </div>

      {/* Grid List */}
      {notes.length === 0 ? (
        <EmptyState
          icon={<IoDocumentTextOutline className="h-8 w-8" />}
          title="No notes yet"
          subtitle="Start creating study notes, flashcards, or reminders to stay organized."
          actionLabel="New Note"
          onAction={handleAddClick}
        />
      ) : filteredNotes.length === 0 ? (
        <EmptyState
          icon={<IoSearchOutline className="h-8 w-8" />}
          title="No results found"
          subtitle={`No notes match the search query "${searchQuery}"`}
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredNotes.map((note) => (
            <motion.div key={note.id} variants={itemVariants}>
              <NoteCard
                note={note}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingNote ? 'Edit Note' : 'New Note'}
        description={editingNote ? 'Modify the contents of your study note.' : 'Capture your thoughts, class summaries, or reminders.'}
      >
        <NoteForm
          defaultValues={editingNote || undefined}
          onSubmit={handleFormSubmit}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={noteToDelete !== null}
        onClose={() => setNoteToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Note?"
        description="Are you sure you want to delete this note? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}
