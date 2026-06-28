export function formatDate(date: string): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return date
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36)
}
