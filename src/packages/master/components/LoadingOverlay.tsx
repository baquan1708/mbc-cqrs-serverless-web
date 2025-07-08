import React from 'react'
import { Loader2 } from 'lucide-react'

const LoadingOverlay = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000] opacity-50">
      <div className="flex flex-col items-center">
        <Loader2 className="mt-10 h-24 w-24 animate-spin text-white" />
        <span className="mt-4 text-xl text-white">Loading...</span>
      </div>
    </div>
  )
}

export default LoadingOverlay
