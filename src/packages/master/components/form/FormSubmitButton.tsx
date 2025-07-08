'use client'
import * as React from 'react'

import { useFormContext } from 'react-hook-form'

import { Button } from '../ui/button'

export type FormSubmitButtonProps = {
  children: React.ReactNode
  disabled?: boolean
  loading?: boolean
  className?: string
  disableDirty?: boolean
}

export default function FormSubmitButton({
  disableDirty,
  disabled,
  loading,
  children,
  className,
}: FormSubmitButtonProps) {
  const { formState } = useFormContext()

  return (
    <Button
      type="submit"
      disabled={disabled || Object.keys(formState.errors).length > 0 || (!disableDirty && !formState.isDirty)}
      loading={loading || formState.isSubmitting}
      className={className}
    >
      {children}
    </Button>
  )
}
