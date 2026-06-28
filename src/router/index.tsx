import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/pages/DashboardPage'
import { AssignmentsPage } from '@/pages/AssignmentsPage'
import { ExamsPage } from '@/pages/ExamsPage'
import { NotesPage } from '@/pages/NotesPage'
import { SubjectsPage } from '@/pages/SubjectsPage'
import { SettingsPage } from '@/pages/SettingsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'assignments', element: <AssignmentsPage /> },
      { path: 'exams', element: <ExamsPage /> },
      { path: 'notes', element: <NotesPage /> },
      { path: 'subjects', element: <SubjectsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])
