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
            'text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-semibold max-h-10 leading-5',
            {
              'text-[hsl(var(--destructive))]': error,
            }
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <div className="flex-col relative col-span-2 mt-2">
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
              'text-[hsl(var(--destructive))] mt-2 font-semibold text-xs'
            )}
          >
            {error.message}
          </p>
        )}
      </div>
    </div>
  )
}
