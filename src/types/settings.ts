export type ThemeMode = 'light' | 'dark'
export type DefaultView = 'dashboard' | 'assignments' | 'calendar'

export interface NotificationSettings {
  assignmentReminders: boolean
  examReminders: boolean
  reminderDaysBefore: number
}

export interface Settings {
  theme: ThemeMode
  userName: string
  accentColor: string
  notifications: NotificationSettings
  defaultView: DefaultView
  weekStartsOn: 0 | 1
}
