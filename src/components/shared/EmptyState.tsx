import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  message: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  message, 
  action,
  className 
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 p-12 text-center',
        className
      )}
    >
      <Icon className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
      <div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
