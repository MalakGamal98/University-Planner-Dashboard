import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { noteSchema, type NoteFormData } from '@/schemas/note'
import { Input, Textarea, Button } from '@/components/ui'

interface NoteFormProps {
  defaultValues?: Partial<NoteFormData>
  onSubmit: (data: NoteFormData) => void
  loading?: boolean
}

export function NoteForm({ defaultValues, onSubmit, loading = false }: NoteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema) as any,
    defaultValues: {
      title: '',
      content: '',
      tags: [],
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Title"
        placeholder="e.g., Lecture 1 Notes"
        error={errors.title?.message}
        {...register('title')}
      />

      <Textarea
        label="Content"
        placeholder="Type note content here..."
        error={errors.content?.message}
        {...register('content')}
        rows={6}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button type="submit" loading={loading}>
          {defaultValues?.id ? 'Save Changes' : 'Add Note'}
        </Button>
      </div>
    </form>
  )
}
