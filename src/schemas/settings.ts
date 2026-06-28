import { z } from 'zod'
import { ACCENT_PRESETS } from '@/lib/accentColors'

const accentValues = ACCENT_PRESETS.map((p) => p.base) as [string, ...string[]]

export const themeModeSchema = z.enum(['light', 'dark'])

export const settingsFormSchema = z.object({
  userName: z.string().max(50, 'Name must be 50 characters or less'),
  theme: themeModeSchema,
  accentColor: z.enum(accentValues),
})

export type SettingsFormData = z.infer<typeof settingsFormSchema>

export const themePreferenceSchema = z.enum(['light', 'dark', 'system'])
export const defaultViewSchema = z.enum(['dashboard', 'assignments', 'calendar'])

export const notificationSettingsSchema = z.object({
  assignmentReminders: z.boolean(),
  examReminders: z.boolean(),
  reminderDaysBefore: z.number().int().min(1).max(30),
})

export const settingsSchema = z.object({
  theme: themeModeSchema,
  userName: z.string().max(50),
  accentColor: z.enum(accentValues),
  notifications: notificationSettingsSchema,
  defaultView: defaultViewSchema,
  weekStartsOn: z.union([z.literal(0), z.literal(1)]),
})
