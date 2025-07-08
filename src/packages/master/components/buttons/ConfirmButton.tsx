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
  disabled
}: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={disabled} className={className} type="button" size={size} loading={loading}>
          {triggerBtnText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction className={buttonVariants({ variant: 'destructive' })} onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
