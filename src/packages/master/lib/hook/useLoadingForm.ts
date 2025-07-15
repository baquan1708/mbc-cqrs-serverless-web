import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLoadingStore } from '../stores/hooks'

/**
 * loading・formに関するカスタムフック
 * @returns
 */

import { FieldValues, UseFormProps } from 'react-hook-form'

export function useLoadingForm<T extends FieldValues>(
  props?: UseFormProps<T>
) {
  const form = useForm<T>(props)
  const {
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    setError,
    reset,
    trigger,
    formState: { errors, isValid },
  } = form
  const loadingStore = useLoadingStore()

  return {
    form,
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    reset,
    trigger,
    errors,
    loading: loadingStore.isLoading,
    setError,
    loadingStore,
    isValid,
  }
}
