import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useLoadingStore } from '../stores/hooks'

/**
 * A custom hook to handle page navigation with a global loading indicator.
 */
export const useNavigation = () => {
  const router = useRouter()
  const loadingStore = useLoadingStore()

  /**
   * Navigates to a new page using Next.js router, showing a loading indicator.
   * It's recommended to handle closing the loading indicator on a router event
   * like `routeChangeComplete` in your main layout component for a smoother UX.
   * @param url The URL to navigate to.
   */
  const navigate = useCallback(
    (url: string) => {
      loadingStore.setLoading()
      router.push(url)
    },
    [router, loadingStore]
  )

  /**
   * Reloads the current page, showing a loading indicator.
   */
  const reload = useCallback(() => {
    loadingStore.setLoading()
    router.refresh()
  }, [router, loadingStore])

  /**
   * Performs a hard browser navigation (full page reload).
   * @param url The URL to navigate to.
   */
  const hardNavigate = useCallback(
    (url: string) => {
      loadingStore.setLoading()
      window.location.href = url
    },
    [loadingStore]
  )

  return { navigate, reload, hardNavigate }
}
