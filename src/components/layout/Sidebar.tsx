import { NavLink } from 'react-router-dom'
import {
  IoGridOutline,
  IoClipboardOutline,
  IoSchoolOutline,
  IoDocumentTextOutline,
  IoBookOutline,
  IoSettingsOutline,
} from 'react-icons/io5'
import { cn } from '@/lib/cn'

const navItems = [
  { to: '/', label: 'Dashboard', icon: IoGridOutline, end: true },
  { to: '/assignments', label: 'Assignments', icon: IoClipboardOutline },
  { to: '/exams', label: 'Exams', icon: IoSchoolOutline },
  { to: '/notes', label: 'Notes', icon: IoDocumentTextOutline },
  { to: '/subjects', label: 'Subjects', icon: IoBookOutline },
  { to: '/settings', label: 'Settings', icon: IoSettingsOutline },
]

interface SidebarProps {
  collapsed?: boolean
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-border bg-surface transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-64',
      )}
    >
      <div className={cn('flex h-16 items-center border-b border-border px-4', collapsed && 'justify-center px-2')}>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white">
            <IoSchoolOutline className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="truncate text-sm font-bold text-foreground">UniPlanner</p>
              <p className="truncate text-xs text-muted">Dashboard</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Main navigation">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                collapsed && 'justify-center px-2',
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'text-muted hover:bg-surface-raised hover:text-foreground',
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
