import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { subjectSchema, type SubjectFormData } from '@/schemas/subject'
import { Input, Button } from '@/components/ui'
import { IoCheckmark } from 'react-icons/io5'
import { cn } from '@/lib/cn'

interface SubjectFormProps {
  defaultValues?: Partial<SubjectFormData>
  onSubmit: (data: SubjectFormData) => void
  loading?: boolean
}

const PRESET_COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f43f5e', // Rose
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#d946ef', // Fuchsia
]

export function SubjectForm({ defaultValues, onSubmit, loading = false }: SubjectFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: '',
      code: '',
      color: PRESET_COLORS[0],
      credits: 3,
      professor: '',
      schedule: '',
      ...defaultValues,
    },
  })

  const selectedColor = watch('color')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Subject Name"
          placeholder="e.g., Introduction to Computer Science"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Subject Code"
          placeholder="e.g., CS101"
          error={errors.code?.message}
          {...register('code')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Credits"
          type="number"
          placeholder="e.g., 3"
          error={errors.credits?.message}
          {...register('credits', { valueAsNumber: true })}
        />
        <Input
          label="Professor"
          placeholder="e.g., Dr. Jane Smith"
          error={errors.professor?.message}
          {...register('professor')}
        />
      </div>

      <Input
        label="Schedule"
        placeholder="e.g., Mon/Wed 10:00 AM - 11:30 AM"
        error={errors.schedule?.message}
        {...register('schedule')}
      />

      <div>
        <label className="text-sm font-medium text-foreground">Color Swatch</label>
        <div className="mt-2 flex flex-wrap gap-2.5">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue('color', color, { shouldValidate: true })}
              className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer',
                selectedColor === color ? 'ring-2 ring-primary-500 ring-offset-2 scale-105' : 'opacity-80 hover:opacity-100'
              )}
              style={{ backgroundColor: color }}
            >
              {selectedColor === color && (
                <IoCheckmark className="h-5 w-5 text-white drop-shadow-sm" />
              )}
            </button>
          ))}
        </div>
        {errors.color && <p className="mt-1.5 text-xs text-error">{errors.color.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button type="submit" loading={loading}>
          {defaultValues?.id ? 'Save Changes' : 'Add Subject'}
        </Button>
      </div>
    </form>
  )
}
