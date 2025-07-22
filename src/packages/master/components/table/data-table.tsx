'use client'

import React, { useState, useEffect } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  PaginationState,
  RowSelectionState,
  getSortedRowModel,
  getPaginationRowModel,
  Table as ReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Button } from '../ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Input } from '../ui/input'
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react'
import { cn } from '../../lib/utils'
import { DOTS, usePaginationRange } from '../../lib/hook/usePaginationRange'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  rowCount: number
  pagination: PaginationState
  onPaginationChange: (pagination: PaginationState) => void
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onClickRow?: (row: TData) => void
  rowKey: keyof TData | ((row: TData) => string)
  rowSelection?: RowSelectionState
  onRowSelectionChange?: (state: RowSelectionState) => void
}

interface DataTablePaginationProps<TData> {
  table: ReactTable<TData>
  rowCount: number
}

function DataTablePagination<TData>({
  table,
  rowCount,
}: DataTablePaginationProps<TData>) {
  const [jumpToPage, setJumpToPage] = useState('')

  const paginationRange = usePaginationRange({
    totalPageCount: table.getPageCount(),
    currentPage: table.getState().pagination.pageIndex + 1,
    siblingCount: 1,
  })

  useEffect(() => {
    setJumpToPage('')
  }, [table.getState().pagination.pageIndex])

  const handleJumpToPage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const page = parseInt(jumpToPage, 10)
      const pageIndex = page - 1
      if (!isNaN(page) && pageIndex >= 0 && pageIndex < table.getPageCount()) {
        table.setPageIndex(pageIndex)
      }
      setJumpToPage('')
    }
  }

  return (
    <div className="flex items-center justify-end space-x-2 py-1 text-sm">
      <span className="font-medium text-muted-foreground">
        検索件数:{rowCount}
      </span>
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 px-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <span
                key={`dots-${index}`}
                className="flex h-6 w-6 items-center justify-center"
              >
                &#8230;
              </span>
            )
          }

          return (
            <Button
              key={pageNumber}
              variant={
                table.getState().pagination.pageIndex ===
                (pageNumber as number) - 1
                  ? 'outline'
                  : 'ghost'
              }
              size="sm"
              className={cn('h-6 w-6 px-0', {
                'border border-[hsl(var(--primary))]':
                  table.getState().pagination.pageIndex ===
                  (pageNumber as number) - 1,
              })}
              onClick={() => table.setPageIndex((pageNumber as number) - 1)}
            >
              {pageNumber}
            </Button>
          )
        })}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 px-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <Select
        value={`${table.getState().pagination.pageSize}`}
        onValueChange={(value) => {
          table.setPageSize(Number(value))
        }}
      >
        <SelectTrigger className="h-6 w-fit px-2">
          <SelectValue>{`${
            table.getState().pagination.pageSize
          } 件 / ページ`}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {[10, 20, 50, 100].map((pageSize) => (
            <SelectItem key={pageSize} value={`${pageSize}`}>
              {pageSize} 件 / ページ
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {table.getPageCount() > 1 && (
        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground">移動</span>
          <Input
            type="number"
            value={jumpToPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            onKeyDown={handleJumpToPage}
            className="flex h-6 w-16 items-center justify-center p-0 text-center"
            min={1}
            max={table.getPageCount()}
          />
          <span className="text-muted-foreground">ページ</span>
        </div>
      )}
    </div>
  )
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  rowCount,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  onClickRow,
  rowKey,
  rowSelection,
  onRowSelectionChange,
}: DataTableProps<TData, TValue>) {
  const getRowKey = (row: TData) => {
    if (typeof rowKey === 'function') {
      return rowKey(row)
    }
    return row[rowKey] as string
  }
  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      pagination,
      ...(rowSelection && { rowSelection }),
    },
    enableRowSelection: !!onRowSelectionChange,
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === 'function' ? updater(pagination) : updater
      onPaginationChange(newState)
    },
    onSortingChange,
    onRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    getRowId: (originalRow) => getRowKey(originalRow),
  })

  return (
    <div className="space-y-2">
      <DataTablePagination table={table} rowCount={rowCount} />
      <div className="rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className={cn('border-b border-border font-bold')}
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="bg-muted px-0 font-bold"
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={getRowKey(row.original)}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => onClickRow && onClickRow(row.original)}
                  className={cn(
                    'border-b border-border transition-all duration-200', // UPDATED
                    'data-[state=selected]:bg-accent/70 data-[state=selected]:font-normal', // UPDATED (using accent with some opacity)
                    { 'cursor-pointer': onClickRow }
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className={cn('text-bold', {
                        'bg-accent/50': cell.column.getIsSorted(),
                      })}
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="!border-b border-border">
                <TableCell colSpan={columns.length} className="h-48">
                  <div className="flex flex-col items-center justify-center space-y-4 text-muted-foreground opacity-20">
                    <Inbox className="h-16 w-16" />
                    <p>データがありません</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} rowCount={rowCount} />
    </div>
  )
}
