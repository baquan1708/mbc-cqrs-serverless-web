// store/provider/index.tsx
'use client'

import React, { createContext, useState, useMemo, ReactNode } from 'react'
import { LoadingState } from '..'

// Create a context to hold the loading state and its update functions.
// It is initialized with a default state that includes a console warning
// to alert developers if they try to use the context outside of its provider.
export const LoadingContext = createContext<LoadingState>({
  isLoading: true,
  setLoading: () => console.warn('LoadingProvider not found'),
  closeLoading: () => console.warn('LoadingProvider not found'),
})

// Set a display name for easier debugging in React DevTools.
LoadingContext.displayName = 'LoadingContext'

export function LoadingProvider({ children }: { children: ReactNode }) {
  // The core state for the loading indicator. It starts as `true`
  // to handle the initial page load.
  const [isLoading, setIsLoading] = useState(true)

  // Memoize the context value to prevent unnecessary re-renders of consumer
  // components. The value object is only recreated if `isLoading` changes.
  const value = useMemo(
    () => ({
      isLoading,
      setLoading: () => setIsLoading(true),
      closeLoading: () => setIsLoading(false),
    }),
    [isLoading]
  )

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  )
}
