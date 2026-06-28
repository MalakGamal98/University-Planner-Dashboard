import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  color?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-raised text-muted border-border',
  primary: 'bg-primary-100 text-primary-700 border-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-800',
  success: 'bg-success-bg text-green-700 border-green-200 dark:text-green-400 dark:border-green-800',
  warning: 'bg-warning-bg text-amber-700 border-amber-200 dark:text-amber-400 dark:border-amber-800',
  danger: 'bg-error-bg text-red-700 border-red-200 dark:text-red-400 dark:border-red-800',
  info: 'bg-info-bg text-blue-700 border-blue-200 dark:text-blue-400 dark:border-blue-800',
}

export function Badge({
  className,
  variant = 'default',
  color,
  style,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        !color && variantStyles[variant],
        className,
      )}
      style={
        color
          ? {
              backgroundColor: `${color}20`,
              color,
              borderColor: `${color}40`,
              ...style,
            }
          : style
      }
      {...props}
    >
      {children}
    </span>
  )
}
