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
        'grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-[10px] w-full',
        className
      )}
    >
      <FormLabel className="font-semibold max-h-10 mt-2 leading-5">
        <span>{label}</span>
        {required && <span className="text-destructive ml-1">*</span>}
      </FormLabel>
      <div className="flex-col relative col-span-2">
        {children}
        <FormMessage className="mt-2 font-semibold text-xs" />
      </div>
    </FormItem>
  )
}
