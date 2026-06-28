import { NavLink } from 'react-router-dom'
import {
  IoGridOutline,
  IoClipboardOutline,
  IoSchoolOutline,
  IoDocumentTextOutline,
  IoBookOutline,
  IoSettingsOutline,
  IoClose,
} from 'react-icons/io5'
import { cn } from '@/lib/cn'
import { motion } from 'framer-motion'

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
  mobileOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ collapsed = false, mobileOpen = false, onClose }: SidebarProps) {
  return (
    <>
      {/* Backdrop for mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-border bg-surface transition-all duration-300 md:static md:translate-x-0 shrink-0',
          collapsed ? 'w-[72px]' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className={cn('flex h-16 items-center justify-between border-b border-border px-4', collapsed && 'justify-center px-2')}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white">
              <IoSchoolOutline className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden text-left">
                <p className="truncate text-sm font-bold text-foreground">UniPlanner</p>
                <p className="truncate text-xs text-muted">Dashboard</p>
              </div>
            )}
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted hover:bg-surface-raised md:hidden cursor-pointer"
              aria-label="Close menu"
            >
              <IoClose className="h-5 w-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 space-y-1 p-3" aria-label="Main navigation">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors z-0',
                  collapsed && 'justify-center px-2',
                  isActive
                    ? 'text-primary-700 dark:text-primary-300 font-semibold'
                    : 'text-muted hover:bg-surface-raised hover:text-foreground',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-primary-50 dark:bg-primary-900/30 rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
