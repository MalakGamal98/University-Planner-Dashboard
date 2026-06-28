import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSubjectStore } from '@/store/subjectStore'
import { Input, Textarea, Button } from '@/components/ui'
import { cn } from '@/lib/cn'

// Local form input schema to validate date and time separately
const examFormInputSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  subjectId: z.string().uuid('Please select a subject'),
  date: z.string().min(1, 'Exam date is required'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().max(200).optional(),
  duration: z.number().int().min(15).max(480).optional(),
  notes: z.string().max(2000).optional(),
})

type ExamFormInput = z.infer<typeof examFormInputSchema>

interface ExamFormProps {
  defaultValues?: {
    id?: string
    title?: string
    subjectId?: string
    date?: string // combined date from store (e.g. 2026-06-30T10:00)
    location?: string
    duration?: number
    notes?: string
  }
  onSubmit: (data: {
    title: string
    subjectId: string
    date: string // combined datetime output string
    location?: string
    duration?: number
    notes?: string
  }) => void
  loading?: boolean
}

export function ExamForm({ defaultValues, onSubmit, loading = false }: ExamFormProps) {
  const subjects = useSubjectStore((s) => s.subjects)

  // Split target datetime string for separate inputs
  let initialDate = ''
  let initialTime = ''
  if (defaultValues?.date) {
    const [d, t] = defaultValues.date.split('T')
    initialDate = d || ''
    initialTime = t ? t.substring(0, 5) : ''
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExamFormInput>({
    resolver: zodResolver(examFormInputSchema) as any,
    defaultValues: {
      title: defaultValues?.title || '',
      subjectId: defaultValues?.subjectId || subjects[0]?.id || '',
      date: initialDate,
      time: initialTime,
      location: defaultValues?.location || '',
      duration: defaultValues?.duration || undefined,
      notes: defaultValues?.notes || '',
    },
  })

  const handleFormSubmit = (data: ExamFormInput) => {
    onSubmit({
      title: data.title,
      subjectId: data.subjectId,
      date: `${data.date}T${data.time}`,
      location: data.location || undefined,
      duration: data.duration || undefined,
      notes: data.notes || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Exam Title"
        placeholder="e.g., Final Exam, Midterm"
        error={errors.title?.message}
        {...register('title')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="subjectId" className="text-sm font-medium text-foreground">
            Subject
          </label>
          <select
            id="subjectId"
            className={cn(
              'h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer',
              errors.subjectId && 'border-error focus:border-error focus:ring-error/20'
            )}
            {...register('subjectId')}
          >
            <option value="" disabled>Select a subject</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name} ({sub.code})
              </option>
            ))}
          </select>
          {errors.subjectId?.message && (
            <p className="text-xs text-error">{String(errors.subjectId.message)}</p>
          )}
        </div>

        <Input
          label="Location"
          placeholder="e.g., Hall A, Room 102"
          error={errors.location?.message}
          {...register('location')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          label="Exam Date"
          type="date"
          error={errors.date?.message}
          {...register('date')}
        />

        <Input
          label="Time"
          type="time"
          error={errors.time?.message}
          {...register('time')}
        />

        <Input
          label="Duration (mins)"
          type="number"
          placeholder="e.g., 90"
          error={errors.duration?.message}
          {...register('duration', { valueAsNumber: true })}
        />
      </div>

      <Textarea
        label="Notes"
        placeholder="Add special instructions, topics covered, etc..."
        error={errors.notes?.message}
        {...register('notes')}
        rows={3}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button type="submit" loading={loading}>
          {defaultValues?.id ? 'Save Changes' : 'Add Exam'}
        </Button>
      </div>
    </form>
  )
}
