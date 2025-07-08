import React from 'react'

import { useLoadingStore } from '../lib/stores/hooks'
import LoadingOverlay from './LoadingOverlay'
import { Toaster } from './ui/toaster'

export default function MsLayout({
  useLoading,
  children,
}: {
  children: React.ReactNode
  useLoading: boolean
}) {
  const loadingStore = useLoadingStore()
  return (
    <>
      {useLoading && (
        <LoadingOverlay isLoading={loadingStore.isLoading}></LoadingOverlay>
      )}
      {children}
      <Toaster />
    </>
  )
}
