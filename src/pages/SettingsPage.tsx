import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IoMoonOutline, IoSunnyOutline, IoCheckmark } from 'react-icons/io5'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Button,
} from '@/components/ui'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { ACCENT_PRESETS } from '@/lib/accentColors'
import { settingsFormSchema, type SettingsFormData } from '@/schemas/settings'
import { useSettingsStore } from '@/store/settingsStore'
import { resetAllData } from '@/store/resetAllData'
import { toast } from '@/store/toastStore'
import { cn } from '@/lib/cn'

export function SettingsPage() {
  const { theme, userName, accentColor, updateSettings } = useSettingsStore()
  const [confirmResetOpen, setConfirmResetOpen] = useState(false)

  const {
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: { theme, userName, accentColor },
    mode: 'onChange',
  })

  const watchedTheme = watch('theme')
  const watchedAccent = watch('accentColor')

  useEffect(() => {
    reset({ theme, userName, accentColor })
  }, [theme, userName, accentColor, reset])

  useEffect(() => {
    const subscription = watch((values) => {
      const result = settingsFormSchema.safeParse(values)
      if (result.success) {
        updateSettings(result.data)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, updateSettings])

  const handleReset = () => {
    resetAllData()
    setConfirmResetOpen(false)
    toast.success('All data has been reset')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Your name appears on the Dashboard welcome card.
          </CardDescription>
        </CardHeader>
        <Input
          label="Display name"
          placeholder="Enter your name"
          error={errors.userName?.message}
          {...register('userName')}
        />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how UniPlanner looks and feels.</CardDescription>
        </CardHeader>

        <div className="space-y-6">
          <div>
            <p className="mb-3 text-sm font-medium text-foreground">Theme</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setValue('theme', 'light', { shouldValidate: true })}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors',
                  watchedTheme === 'light'
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'border-border bg-surface text-muted hover:bg-surface-raised',
                )}
              >
                <IoSunnyOutline className="h-5 w-5" />
                Light
              </button>
              <button
                type="button"
                onClick={() => setValue('theme', 'dark', { shouldValidate: true })}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors',
                  watchedTheme === 'dark'
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'border-border bg-surface text-muted hover:bg-surface-raised',
                )}
              >
                <IoMoonOutline className="h-5 w-5" />
                Dark
              </button>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-foreground">Accent color</p>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
              {ACCENT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  title={preset.label}
                  aria-label={`${preset.label} accent`}
                  onClick={() =>
                    setValue('accentColor', preset.base, { shouldValidate: true })
                  }
                  className={cn(
                    'relative flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-110',
                    watchedAccent === preset.base && 'ring-2 ring-offset-2 ring-primary-500',
                  )}
                  style={{ backgroundColor: preset.base }}
                >
                  {watchedAccent === preset.base && (
                    <IoCheckmark className="h-5 w-5 text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>
            Permanently delete all subjects, assignments, exams, notes, and settings.
          </CardDescription>
        </CardHeader>
        <Button variant="danger" onClick={() => setConfirmResetOpen(true)}>
          Reset All Data
        </Button>
      </Card>

      <ConfirmDialog
        open={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        onConfirm={handleReset}
        title="Reset all data?"
        description="This will permanently erase everything stored in this app. This action cannot be undone."
        confirmLabel="Reset everything"
        variant="danger"
      />
    </div>
  )
}
