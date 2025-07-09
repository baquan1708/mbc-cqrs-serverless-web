import { Column } from '@tanstack/react-table'
import { Button } from '../ui/button'
import SortIndicator from './sort-indicator'
import React from 'react'

const DataTableColumnHeader = <TData, TValue>({
  column,
  title,
}: {
  column: Column<TData, TValue>
  title: string
}) => {
  return (
    <Button
      variant="ghost"
      className="font-bold flex justify-between items-center w-full rounded-none"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {title}
      <SortIndicator sortState={column.getIsSorted()} />
    </Button>
  )
}

export { DataTableColumnHeader }
