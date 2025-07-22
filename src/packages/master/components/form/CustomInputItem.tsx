import * as React from 'react'

import { cn } from '../../lib/utils'

interface LabelProps {
  label?: string
  description?: string
  children: React.ReactNode
  required?: boolean
  error?: any
  className?: string
}

export default function CustomInputItem({
  label,
  description,
  error,
  children,
  required,
  className,
}: LabelProps) {
  return (
    <div className={cn('block', className)}>
      {label && (
        <label
          className={cn(
            'max-h-10 text-sm font-semibold leading-5 peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            {
              'text-[hsl(var(--destructive))]': error,
            }
          )}
        >
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
      )}

      <div className="relative col-span-2 mt-2 flex-col">
        {children}
        {description && (
          <p
            className={cn(
              '!mt-[6px] mb-0 text-xs text-[hsl(var(--muted-foreground))]'
            )}
          >
            ※{description}
          </p>
        )}
        {error && (
          <p
            className={cn(
              'mt-2 text-xs font-semibold text-[hsl(var(--destructive))]'
            )}
          >
            {error.message}
          </p>
        )}
      </div>
    </div>
  )
}
