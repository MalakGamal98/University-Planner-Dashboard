import { z } from 'zod'

export const themePreferenceSchema = z.enum(['light', 'dark', 'system'])
export const defaultViewSchema = z.enum(['dashboard', 'assignments', 'calendar'])

export const notificationSettingsSchema = z.object({
  assignmentReminders: z.boolean(),
  examReminders: z.boolean(),
  reminderDaysBefore: z.number().int().min(1).max(30),
})

export const settingsSchema = z.object({
  theme: themePreferenceSchema,
  notifications: notificationSettingsSchema,
  defaultView: defaultViewSchema,
  weekStartsOn: z.union([z.literal(0), z.literal(1)]),
})

export type SettingsFormData = z.infer<typeof settingsSchema>
