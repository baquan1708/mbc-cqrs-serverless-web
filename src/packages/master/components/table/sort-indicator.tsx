import React from 'react'
import { ChevronsUpDown, SortAsc, SortDesc } from 'lucide-react'

const SortIndicator = ({
  sortState,
}: {
  sortState: false | 'asc' | 'desc'
}) => {
  const className = 'ml-2 h-4 w-4'
  if (sortState === 'asc') {
    return <SortAsc className={className} />
  }
  if (sortState === 'desc') {
    return <SortDesc className={className} />
  }
  return <ChevronsUpDown className={`${className} opacity-50`} />
}

export default SortIndicator
