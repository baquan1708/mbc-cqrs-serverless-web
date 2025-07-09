import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLoadingStore } from '../stores/hooks'

/**
 * loading・formに関するカスタムフック
 * @returns
 */

export function useLoadingForm<T>() {
  const form = useForm<T>()
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
