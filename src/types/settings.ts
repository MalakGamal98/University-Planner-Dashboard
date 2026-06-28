export type ThemePreference = 'light' | 'dark' | 'system'
export type DefaultView = 'dashboard' | 'assignments' | 'calendar'

export interface NotificationSettings {
  assignmentReminders: boolean
  examReminders: boolean
  reminderDaysBefore: number
}

export interface Settings {
  theme: ThemePreference
  notifications: NotificationSettings
  defaultView: DefaultView
  weekStartsOn: 0 | 1
}
