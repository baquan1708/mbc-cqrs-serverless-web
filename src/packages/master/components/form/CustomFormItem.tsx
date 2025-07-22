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
    <FormItem
      className={cn(
        'grid w-full grid-cols-1 gap-2 lg:grid-cols-3 lg:gap-[10px]',
        className
      )}
    >
      <FormLabel className="mt-2 max-h-10 font-semibold leading-5">
        <span>{label}</span>
        {required && <span className="ml-1 text-destructive">*</span>}
      </FormLabel>
      <div className="relative col-span-2 flex-col">
        {children}
        <FormMessage className="mt-2 text-xs font-semibold" />
      </div>
    </FormItem>
  )
}
