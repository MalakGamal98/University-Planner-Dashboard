import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { PageWrapper } from './PageWrapper'

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Overview of your academic life' },
  '/assignments': { title: 'Assignments', subtitle: 'Track and manage your coursework' },
  '/exams': { title: 'Exams', subtitle: 'Upcoming tests and finals' },
  '/notes': { title: 'Notes', subtitle: 'Your study notes and references' },
  '/subjects': { title: 'Subjects', subtitle: 'Courses and schedules' },
  '/settings': { title: 'Settings', subtitle: 'Preferences and configuration' },
}

export function AppShell() {
  const { pathname } = useLocation()
  const pageInfo = pageTitles[pathname] ?? { title: 'Page' }

  return (
    <div className="flex h-svh overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar title={pageInfo.title} subtitle={pageInfo.subtitle} />
        <PageWrapper>
          <Outlet />
        </PageWrapper>
      </div>
    </div>
  )
}
