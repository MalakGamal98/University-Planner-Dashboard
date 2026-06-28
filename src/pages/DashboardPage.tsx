import { Card, CardDescription, CardHeader, CardTitle, Badge, Button } from '@/components/ui'
import { toast } from '@/store/toastStore'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to UniPlanner</CardTitle>
          <CardDescription>
            Your university planning dashboard is ready. Phase 1 foundation is complete.
          </CardDescription>
        </CardHeader>
        <div className="flex flex-wrap gap-2">
          <Badge variant="primary">Dashboard</Badge>
          <Badge variant="success">Active</Badge>
          <Badge variant="info">Phase 1</Badge>
        </div>
        <div className="mt-4 flex gap-2">
          <Button size="sm" onClick={() => toast.success('Toast system works!')}>
            Test Success Toast
          </Button>
          <Button size="sm" variant="secondary" onClick={() => toast.info('Info notification')}>
            Test Info Toast
          </Button>
        </div>
      </Card>
    </div>
  )
}
