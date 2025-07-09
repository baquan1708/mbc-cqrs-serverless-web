// store/index.ts
export interface LoadingState {
  isLoading: boolean
  setLoading: () => void
  closeLoading: () => void
}
