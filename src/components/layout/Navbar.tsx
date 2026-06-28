import { IoMoonOutline, IoSunnyOutline, IoSearchOutline, IoMenuOutline } from 'react-icons/io5'
import { useSettingsStore } from '@/store/settingsStore'
import { toggleThemeMode } from '@/lib/theme'
import { Button } from '@/components/ui'

interface NavbarProps {
  title: string
  subtitle?: string
  onMenuClick?: () => void
}

export function Navbar({ title, subtitle, onMenuClick }: NavbarProps) {
  const { theme, updateSettings } = useSettingsStore()

  const handleToggleTheme = () => {
    updateSettings({ theme: toggleThemeMode(theme) })
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-6">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            title="Open navigation menu"
            className="md:hidden -ml-2 cursor-pointer"
          >
            <IoMenuOutline className="h-6 w-6" />
          </Button>
        )}
        <div className="text-left">
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          aria-label="Search"
          className="hidden sm:inline-flex"
        >
          <IoSearchOutline className="h-5 w-5" />
          <span className="hidden md:inline">Search</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="cursor-pointer"
        >
          {theme === 'dark' ? (
            <IoSunnyOutline className="h-5 w-5" />
          ) : (
            <IoMoonOutline className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  )
}
