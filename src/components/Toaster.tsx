import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IoCheckmarkCircle, IoCloseCircle, IoInformationCircle, IoClose } from 'react-icons/io5'
import { useToastStore, type ToastVariant } from '@/store/toastStore'
import { cn } from '@/lib/cn'

const variantConfig: Record<
  ToastVariant,
  { icon: typeof IoCheckmarkCircle; className: string }
> = {
  success: {
    icon: IoCheckmarkCircle,
    className: 'border-green-200 bg-success-bg text-green-800 dark:border-green-800 dark:text-green-300',
  },
  error: {
    icon: IoCloseCircle,
    className: 'border-red-200 bg-error-bg text-red-800 dark:border-red-800 dark:text-red-300',
  },
  info: {
    icon: IoInformationCircle,
    className: 'border-blue-200 bg-info-bg text-blue-800 dark:border-blue-800 dark:text-blue-300',
  },
}

function ToastItem({ id, message, variant, duration }: {
  id: string
  message: string
  variant: ToastVariant
  duration: number
}) {
  const removeToast = useToastStore((s) => s.removeToast)
  const config = variantConfig[variant]
  const Icon = config.icon

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), duration)
    return () => clearTimeout(timer)
  }, [id, duration, removeToast])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex items-center gap-3 rounded-lg border px-4 py-3 shadow-md',
        config.className,
      )}
      role="alert"
    >
      <Icon className="h-5 w-5 shrink-0" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        type="button"
        onClick={() => removeToast(id)}
        className="shrink-0 rounded-md p-0.5 opacity-70 transition-opacity hover:opacity-100 cursor-pointer"
        aria-label="Dismiss notification"
      >
        <IoClose className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem {...toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
