import * as React from 'react'

import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'
import { Button, buttonVariants } from '../ui/button'
import { cn } from '../../lib/utils'

interface Props {
  size?: 'default' | 'sm' | 'lg' | 'icon'
  triggerBtnText?: string
  title?: string
  cancelText?: string
  confirmText?: string
  loading?: boolean
  onConfirm?: () => void
  className?: string
  disabled?: boolean
  variant?: string
}

export default function ConfirmButton({
  size,
  triggerBtnText,
  title,
  cancelText,
  confirmText,
  loading,
  onConfirm,
  className,
  disabled,
  variant
}: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={disabled} className={className} variant={variant as any} type="button" size={size} loading={loading}>
          {triggerBtnText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction className={cn('mt-2', buttonVariants({ variant: 'destructive' }))} onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
