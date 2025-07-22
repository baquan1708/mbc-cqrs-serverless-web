'use client'

import * as React from 'react'

import { FormItem, FormLabel, FormMessage } from '../ui/form'
import { cn } from '../../lib/utils'

export default function CustomFormItem({
  className,
  label,
  required,
  children,
}: {
  className?: string
  label: string
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <FormItem className={cn('flex w-full flex-col gap-2', className)}>
      <FormLabel className="font-semibold">
        <span>{label}</span>
        {required && <span className="ml-1 text-destructive">*</span>}
      </FormLabel>
      <div className="relative flex-col">
        {children}
        <FormMessage className="mt-2 text-xs font-semibold" />
      </div>
    </FormItem>
  )
}
