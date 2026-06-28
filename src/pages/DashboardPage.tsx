import { useState, useMemo, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  IoBookOutline,
  IoClipboardOutline,
  IoCheckmarkCircleOutline,
  IoSchoolOutline,
  IoSearchOutline,
  IoCalendarOutline,
  IoLocationOutline,
  IoArrowForwardOutline,
  IoWarningOutline,
} from 'react-icons/io5'
import { Card, Badge, Button } from '@/components/ui'
import { useSettingsStore } from '@/store/settingsStore'
import { useSubjectStore } from '@/store/subjectStore'
import { useAssignmentStore } from '@/store/assignmentStore'
import { useExamStore } from '@/store/examStore'
import { useNoteStore } from '@/store/noteStore'
import { useCountdown } from '@/hooks/useCountdown'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/cn'
import type { Exam } from '@/types/exam'
import type { Subject } from '@/types/subject'

function ExamCountdownWidget({ exam, subject }: { exam: Exam; subject?: Subject }) {
  const { days, hours, minutes, seconds } = useCountdown(exam.date)

  const examTime = new Date(exam.date).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Card className="p-5 border-l-4" style={subject ? { borderLeftColor: subject.color } : undefined}>
      <div className="space-y-4 text-left">
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full shrink-0 animate-pulse bg-emerald-400" />
          <span className="text-muted-foreground">Next Exam Countdown</span>
        </div>

        <div className="space-y-1">
          <h4 className="text-base font-bold text-foreground line-clamp-1">{exam.title}</h4>
          {subject && (
            <p className="text-xs text-muted-foreground">
              {subject.name} ({subject.code})
            </p>
          )}
        </div>

        {/* Live ticking timer block */}
        <div className="flex gap-2 justify-center py-2">
          <div className="flex flex-col items-center justify-center h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-800">
            <span className="text-sm font-bold font-mono text-foreground">{days.toString().padStart(2, '0')}</span>
            <span className="text-[9px] text-muted-foreground uppercase font-medium mt-0.5">Days</span>
          </div>
          <div className="flex flex-col items-center justify-center h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-800">
            <span className="text-sm font-bold font-mono text-foreground">{hours.toString().padStart(2, '0')}</span>
            <span className="text-[9px] text-muted-foreground uppercase font-medium mt-0.5">Hours</span>
          </div>
          <div className="flex flex-col items-center justify-center h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-800">
            <span className="text-sm font-bold font-mono text-foreground">{minutes.toString().padStart(2, '0')}</span>
            <span className="text-[9px] text-muted-foreground uppercase font-medium mt-0.5">Mins</span>
          </div>
          <div className="flex flex-col items-center justify-center h-12 w-12 rounded-lg bg-primary-50 dark:bg-primary-900/20">
            <span className="text-sm font-bold font-mono text-primary-600 dark:text-primary-400">{seconds.toString().padStart(2, '0')}</span>
            <span className="text-[9px] text-primary-500/80 uppercase font-medium mt-0.5">Secs</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-1 text-[11px] text-muted border-t border-border pt-3">
          <div className="flex items-center gap-1">
            <IoCalendarOutline className="h-3.5 w-3.5" />
            <span>{formatDate(exam.date)} at {examTime}</span>
          </div>
          {exam.location && (
            <div className="flex items-center gap-1">
              <IoLocationOutline className="h-3.5 w-3.5" />
              <span className="truncate">{exam.location}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export function DashboardPage() {
  const userName = useSettingsStore((s) => s.userName)
  const { subjects } = useSubjectStore()
  const { assignments } = useAssignmentStore()
  const { exams } = useExamStore()
  const { notes } = useNoteStore()
  const navigate = useNavigate()

  // Search logic
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { assignments: [], notes: [] }
    const q = searchQuery.toLowerCase()

    const matchedAssignments = assignments
      .filter((a) => a.title.toLowerCase().includes(q))
      .slice(0, 5)

    const matchedNotes = notes
      .filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
      .slice(0, 5)

    return { assignments: matchedAssignments, notes: matchedNotes }
  }, [searchQuery, assignments, notes])

  // Map subjects for easy lookup
  const subjectMap = useMemo(() => {
    return new Map(subjects.map((s) => [s.id, s]))
  }, [subjects])

  // Statistics
  const stats = useMemo(() => {
    const futureExams = exams.filter((e) => new Date(e.date).getTime() > Date.now())
    return {
      subjectsCount: subjects.length,
      assignmentsCount: assignments.length,
      completedAssignments: assignments.filter((a) => a.status === 'completed').length,
      upcomingExams: futureExams.length,
    }
  }, [subjects, assignments, exams])

  // Study Progress
  const studyProgress = useMemo(() => {
    return subjects.map((sub) => {
      const subAssignments = assignments.filter((a) => a.subjectId === sub.id)
      const count = subAssignments.length
      const completed = subAssignments.filter((a) => a.status === 'completed').length
      const percentage = count > 0 ? Math.round((completed / count) * 100) : 0
      return { subject: sub, total: count, completed, percentage }
    })
  }, [subjects, assignments])

  // Upcoming Deadlines (3-5 incomplete assignments, soonest due date)
  const upcomingDeadlines = useMemo(() => {
    const incomplete = assignments.filter((a) => a.status !== 'completed')
    incomplete.sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    return incomplete.slice(0, 5)
  }, [assignments])

  // Recent Assignments Table (5 most recently created)
  const recentAssignments = useMemo(() => {
    const sorted = [...assignments]
    sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return sorted.slice(0, 5)
  }, [assignments])

  // Nearest upcoming exam
  const nearestExam = useMemo(() => {
    const future = exams.filter((e) => new Date(e.date).getTime() > Date.now())
    future.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    return future[0]
  }, [exams])

  // Quick Notes Preview (3 most recently created)
  const recentNotes = useMemo(() => {
    const sorted = [...notes]
    sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return sorted.slice(0, 3)
  }, [notes])

  const greeting = userName.trim() ? `Welcome back, ${userName.trim()}!` : 'Welcome to UniPlanner'
  const longDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const priorityColors = {
    low: 'bg-primary-50 text-primary-700 border-primary-100 dark:bg-primary-900/20 dark:text-primary-300 dark:border-primary-900/30',
    medium: 'bg-warning-bg text-warning border-amber-100 dark:border-warning/10',
    high: 'bg-error-bg text-error border-red-100 dark:border-error/10',
  }

  const statusColors = {
    todo: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    'in-progress': 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/30',
    completed: 'bg-success-bg text-success border-emerald-100 dark:border-success/10',
  }

  const statusLabels = {
    todo: 'Pending',
    'in-progress': 'In Progress',
    completed: 'Completed',
  }

  return (
    <div className="space-y-6 text-left">
      {/* Search and Greeting Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{greeting}</h2>
          <p className="text-xs text-muted-foreground">{longDate}</p>
        </div>

        {/* Global search component */}
        <div ref={searchRef} className="relative w-full max-w-sm">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted">
            <IoSearchOutline className="h-5 w-5" />
          </span>
          <input
            type="text"
            placeholder="Search assignments & notes..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setIsSearchFocused(true)
            }}
            onFocus={() => setIsSearchFocused(true)}
            className="h-10 w-full rounded-lg border border-border bg-surface pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />

          {/* Search Dropdown list overlay */}
          {isSearchFocused && searchQuery.trim() && (
            <div className="absolute right-0 top-11 z-30 w-full max-w-sm rounded-xl border border-border bg-surface p-2 shadow-lg max-h-[300px] overflow-y-auto">
              {searchResults.assignments.length === 0 && searchResults.notes.length === 0 ? (
                <p className="p-4 text-center text-xs text-muted">No matches found</p>
              ) : (
                <div className="space-y-3">
                  {searchResults.assignments.length > 0 && (
                    <div>
                      <h4 className="px-2.5 py-1 text-[10px] font-bold text-muted uppercase tracking-wider">
                        Assignments
                      </h4>
                      <div className="space-y-0.5">
                        {searchResults.assignments.map((a) => (
                          <Link
                            key={a.id}
                            to="/assignments"
                            onClick={() => setIsSearchFocused(false)}
                            className="flex flex-col gap-0.5 rounded-lg px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-900/40 text-left"
                          >
                            <span className="text-xs font-semibold text-foreground truncate">{a.title}</span>
                            <span className="text-[10px] text-muted-foreground">Due: {formatDate(a.dueDate)}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.notes.length > 0 && (
                    <div>
                      <h4 className="px-2.5 py-1 text-[10px] font-bold text-muted uppercase tracking-wider">
                        Notes
                      </h4>
                      <div className="space-y-0.5">
                        {searchResults.notes.map((n) => (
                          <Link
                            key={n.id}
                            to="/notes"
                            onClick={() => setIsSearchFocused(false)}
                            className="flex flex-col gap-0.5 rounded-lg px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-900/40 text-left"
                          >
                            <span className="text-xs font-semibold text-foreground truncate">{n.title}</span>
                            <span className="text-[10px] text-muted-foreground truncate">{n.content}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Statistics Row Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4 p-4 hover:shadow-xs transition-shadow">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
            <IoBookOutline className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{stats.subjectsCount}</p>
            <p className="text-xs text-muted">Total Subjects</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-4 hover:shadow-xs transition-shadow">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            <IoClipboardOutline className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{stats.assignmentsCount}</p>
            <p className="text-xs text-muted">Total Coursework</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-4 hover:shadow-xs transition-shadow">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
            <IoCheckmarkCircleOutline className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{stats.completedAssignments}</p>
            <p className="text-xs text-muted">Completed</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-4 hover:shadow-xs transition-shadow">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400">
            <IoSchoolOutline className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{stats.upcomingExams}</p>
            <p className="text-xs text-muted">Upcoming Exams</p>
          </div>
        </Card>
      </div>

      {/* Main 2-column layout (main left, sidebar right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content Left Column (lg:col-span-2) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Study Progress card */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Study Progress</h3>
            {studyProgress.length === 0 ? (
              <p className="text-center text-xs text-muted py-6">No subjects added. Create a subject to track study progress.</p>
            ) : (
              <div className="space-y-4">
                {studyProgress.map(({ subject, total, completed, percentage }) => (
                  <div key={subject.id} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: subject.color }} />
                        <span className="text-foreground">{subject.name}</span>
                      </div>
                      <span className="text-muted-foreground font-mono">
                        {completed} of {total} completed ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%`, backgroundColor: subject.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent Assignments Table */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Recent Assignments</h3>
              <Link to="/assignments" className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                <span>View all</span>
                <IoArrowForwardOutline className="h-3 w-3" />
              </Link>
            </div>
            {recentAssignments.length === 0 ? (
              <p className="text-center text-xs text-muted py-8">No assignments added yet.</p>
            ) : (
              <div className="overflow-x-auto -mx-6">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-slate-50/50 dark:bg-slate-900/10">
                      <th className="py-3 px-6 text-[10px] font-bold text-muted uppercase tracking-wider">Title</th>
                      <th className="py-3 px-6 text-[10px] font-bold text-muted uppercase tracking-wider">Subject</th>
                      <th className="py-3 px-6 text-[10px] font-bold text-muted uppercase tracking-wider">Due Date</th>
                      <th className="py-3 px-6 text-[10px] font-bold text-muted uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAssignments.map((a) => {
                      const sub = subjectMap.get(a.subjectId)
                      return (
                        <tr key={a.id} className="border-b border-border hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                          <td className="py-3.5 px-6 font-semibold text-foreground truncate max-w-[200px]">{a.title}</td>
                          <td className="py-3.5 px-6 text-xs font-medium">
                            {sub ? (
                              <span className="inline-flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: sub.color }} />
                                <span className="text-muted-foreground">{sub.code}</span>
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="py-3.5 px-6 text-xs text-muted font-mono">{formatDate(a.dueDate)}</td>
                          <td className="py-3.5 px-6 text-xs">
                            <Badge className={cn('capitalize text-[10px] px-2 py-0.5 border', statusColors[a.status])}>
                              {statusLabels[a.status]}
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar widgets Column (lg:col-span-1) */}
        <div className="space-y-6 lg:col-span-1">
          {/* Next Exam Countdown Widget */}
          {nearestExam ? (
            <ExamCountdownWidget exam={nearestExam} subject={subjectMap.get(nearestExam.subjectId)} />
          ) : (
            <Card className="p-5 flex flex-col items-center justify-center min-h-[160px] text-center">
              <IoSchoolOutline className="h-8 w-8 text-muted mb-2" />
              <h4 className="text-sm font-semibold text-foreground">No upcoming exams</h4>
              <p className="text-[11px] text-muted-foreground mt-1">Take it easy! No exams scheduled for now.</p>
              <Button size="sm" className="mt-3.5 text-xs py-1 px-3 h-8" onClick={() => navigate('/exams')}>Schedule Exam</Button>
            </Card>
          )}

          {/* Upcoming Deadlines Widget */}
          <Card className="p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Upcoming Deadlines</h3>
              <Link to="/assignments" className="text-xs font-bold text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
            {upcomingDeadlines.length === 0 ? (
              <p className="text-center text-xs text-muted py-6">All assignments are completed!</p>
            ) : (
              <div className="space-y-2">
                {upcomingDeadlines.map((a) => {
                  const sub = subjectMap.get(a.subjectId)
                  const todayStr = new Date().toISOString().split('T')[0]
                  const isOverdue = a.dueDate < todayStr
                  return (
                    <div
                      key={a.id}
                      className={cn(
                        'flex flex-col gap-1 p-2.5 rounded-lg border border-border bg-slate-50/20 hover:shadow-xs transition-shadow',
                        isOverdue && 'border-error/20 bg-error-bg/10 dark:bg-error-bg/5'
                      )}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-bold text-foreground line-clamp-1 flex-1 text-left">{a.title}</span>
                        <Badge className={cn('capitalize text-[9px] px-1 py-0 border shrink-0', priorityColors[a.priority])}>
                          {a.priority}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1">
                        {sub && (
                          <div className="flex items-center gap-1 truncate max-w-[120px]">
                            <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: sub.color }} />
                            <span className="truncate">{sub.name}</span>
                          </div>
                        )}
                        <span className={cn('font-medium font-mono', isOverdue && 'text-error font-semibold flex items-center gap-0.5')}>
                          {isOverdue && <IoWarningOutline className="h-3 w-3 shrink-0" />}
                          Due {formatDate(a.dueDate)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>

          {/* Quick Notes preview widget */}
          <Card className="p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Quick Notes</h3>
              <Link to="/notes" className="text-xs font-bold text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
            {recentNotes.length === 0 ? (
              <p className="text-center text-xs text-muted py-6">No study notes created yet.</p>
            ) : (
              <div className="space-y-3">
                {recentNotes.map((n) => (
                  <div key={n.id} className="p-3 rounded-lg border border-border bg-surface hover:shadow-xs transition-shadow">
                    <h4 className="text-xs font-bold text-foreground truncate text-left">{n.title}</h4>
                    <p className="text-[11px] text-muted line-clamp-2 mt-1 text-left whitespace-pre-wrap">{n.content}</p>
                    <div className="flex items-center gap-1 text-[9px] text-muted-foreground mt-2 pt-2 border-t border-border/60">
                      <IoCalendarOutline className="h-3 w-3" />
                      <span>{formatDate(n.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
