import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { assignmentSchema, type AssignmentFormData } from '@/schemas/assignment'
import { useSubjectStore } from '@/store/subjectStore'
import { Input, Textarea, Button } from '@/components/ui'
import { cn } from '@/lib/cn'

interface AssignmentFormProps {
  defaultValues?: Partial<AssignmentFormData>
  onSubmit: (data: AssignmentFormData) => void
  loading?: boolean
}

export function AssignmentForm({
  defaultValues,
  onSubmit,
  loading = false,
}: AssignmentFormProps) {
  const subjects = useSubjectStore((s) => s.subjects)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema) as any,
    defaultValues: {
      title: '',
      description: '',
      subjectId: defaultValues?.subjectId || subjects[0]?.id || '',
      dueDate: '',
      priority: 'medium',
      status: 'todo',
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Assignment Title"
        placeholder="e.g., Midterm Project"
        error={errors.title?.message}
        {...register('title')}
      />

      <Textarea
        label="Description"
        placeholder="Provide some details about the assignment..."
        error={errors.description?.message}
        {...register('description')}
        rows={3}
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
          label="Due Date"
          type="date"
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="priority" className="text-sm font-medium text-foreground">
            Priority
          </label>
          <select
            id="priority"
            className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
            {...register('priority')}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-sm font-medium text-foreground">
            Status
          </label>
          <select
            id="status"
            className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
            {...register('status')}
          >
            <option value="todo">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button type="submit" loading={loading}>
          {defaultValues?.id ? 'Save Changes' : 'Add Assignment'}
        </Button>
      </div>
    </form>
  )
}
