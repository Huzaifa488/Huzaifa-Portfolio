import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'gray' | 'green' | 'yellow' | 'red'
  className?: string
}

const variants = {
  primary: 'badge-primary',
  gray:    'badge-gray',
  green:   'badge-green',
  yellow:  'badge-yellow',
  red:     'badge bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
}

export function Badge({ children, variant = 'gray', className }: BadgeProps) {
  return (
    <span className={cn(variants[variant], className)}>
      {children}
    </span>
  )
}
