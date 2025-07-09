import { useLoadingStore } from '../stores/hooks'
import { useCallback } from 'react'

/**
 * A hook for executing an async function while managing the global loading state.
 */
export const useAsyncAction = () => {
  const loadingStore = useLoadingStore()

  /**
   * Wraps and executes an async function, showing a loading overlay
   * during its execution.
   * @param asyncFunction The async function to execute.
   * @returns The result of the async function.
   */
  const performAction = useCallback(
    async <T>(asyncFunction: () => Promise<T>): Promise<T> => {
      loadingStore.setLoading()
      try {
        return await asyncFunction()
      } catch (error) {
        // Re-throw the error so the calling component can handle it.
        console.error('Async action failed:', error)
        throw error
      } finally {
        loadingStore.closeLoading()
      }
    },
    [loadingStore]
  )

  return { performAction, isLoading: loadingStore.isLoading }
}
