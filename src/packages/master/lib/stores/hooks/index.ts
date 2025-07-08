// store/hooks/index.ts
import React, { useContext } from 'react'
import { LoadingContext } from '../provider'

/**
 * A hook to easily access the global loading state and its actions.
 *
 * It ensures that the hook is used within a component wrapped by a LoadingProvider.
 *
 * @returns The loading state and updater functions (`isLoading`, `setLoading`, `closeLoading`).
 */
export function useLoadingStore() {
  const context = useContext(LoadingContext)
  // This error is a safeguard to ensure you don't use the hook outside
  // of the provider, which would lead to unexpected behavior.
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }

  return context
}
