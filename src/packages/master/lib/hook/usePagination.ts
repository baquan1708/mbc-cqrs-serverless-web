import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
  UseQueryStatesKeysMap,
} from 'next-usequerystate'
import React, { useState } from 'react'
import { UseFormReset, UseFormSetValue } from 'react-hook-form'
import { countDefault, TableViewType } from '../constants/define'
import { handleApi } from '../utils/form'
import { SearchPropsBase } from '../../types/pagination'

import { Paginate } from '../../types/common'
import { TableView } from '../../types/table-view'
import {
  OnChangeFn,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import { useLoadingStore } from '../stores/hooks'

type Props<
  TRecord,
  TSearchProps extends SearchPropsBase,
  TPaginate extends Paginate<TRecord>,
> = {
  searchPropDefinitions: UseQueryStatesKeysMap<TSearchProps>
  getData?: (queries: TSearchProps) => Promise<TPaginate>
  getDataClient?: (queries: TSearchProps) => Promise<Array<TRecord>>
  isSearchInit?: boolean
  getStorage?: () => TSearchProps
  setStorage?: (props: TSearchProps) => void
  reset?: UseFormReset<TSearchProps> | ((props: TSearchProps) => void)
  setValue?: UseFormSetValue<TSearchProps>
  rootPath: string
  tableViews?: Array<TableView>
  convertSearchProps?: (props: TSearchProps) => TSearchProps
  convertChangeQueries?: (props: TSearchProps) => TSearchProps
}

export function usePagination<
  TRecord,
  TSearchProps extends SearchPropsBase,
  TPaginate extends Paginate<TRecord>,
>({
  isSearchInit = true,
  searchPropDefinitions: _searchPropDefinitions,
  getData,
  getDataClient,
  getStorage,
  setStorage,
  reset,
  setValue,
  rootPath,
  tableViews,
  convertSearchProps,
  convertChangeQueries,
}: Props<TRecord, TSearchProps, TPaginate>) {
  if (!getData && !getDataClient) {
    throw new Error('getData or getDataClient is required')
  }
  const loadingStore = useLoadingStore()
  const isChangeClient = !!getDataClient

  const searchPropDefinitions = Object.assign(_searchPropDefinitions, {
    count: parseAsInteger.withDefault(countDefault),
    page: parseAsInteger.withDefault(1),
    search: parseAsBoolean.withDefault(false),
    ordering: parseAsString.withDefault(''),
    table_view: parseAsString.withDefault(''),
    not_save_condition: parseAsBoolean,
  })

  const [paginate, setPaginate] = useState<TPaginate | null>(null)
  const [searchProps, setSearchProps] = useState<TSearchProps | null>(null)
  const [queries, setQueries] = useQueryStates<
    UseQueryStatesKeysMap<TSearchProps>
  >(searchPropDefinitions, {
    history: 'replace',
  })
  const [isCalledSearch, setIsCalledSearch] = useState<boolean>(false)

  const onSubmitSearch = async (props: TSearchProps) => {
    props.page = 1
    props.ordering = null
    props.search = true
    props.not_save_condition = null
    if (searchProps) {
      props.count = searchProps.count
    }
    await changeQueries(props)
  }

  const handlePaginationChange: OnChangeFn<PaginationState> = async (
    updater
  ) => {
    const newState =
      typeof updater === 'function'
        ? updater({
            pageIndex: searchProps.page - 1,
            pageSize: searchProps.count,
          })
        : updater
    searchProps.page = newState.pageIndex + 1
    searchProps.count = newState.pageSize
    searchProps.search = true
    await changeQueries(searchProps)
  }

  const handleSortChange: OnChangeFn<SortingState> = async (updater) => {
    const newSort =
      typeof updater === 'function'
        ? updater([{ id: searchProps.ordering, desc: false }])
        : updater
    if (newSort && newSort.length > 0) {
      const { id, desc } = newSort[0]
      searchProps.ordering = `${desc ? '-' : ''}${id}`
    } else {
      searchProps.ordering = ''
    }
    searchProps.page = 1
    searchProps.search = true
    await changeQueries(searchProps)
  }

  const searchUsingTableView = async (
    props: TSearchProps,
    tableView: TableView
  ): Promise<void> => {
    Object.keys(props).forEach((key) => {
      props[key] = null
    })
    props.table_view = tableView.uuid
    props.count = tableView.count
    props.page = 1
    props.search = false
    props.not_save_condition = null
    await changeQueries(props)
  }

  const getSearchQuery = (): TSearchProps | null => {
    const func = (): TSearchProps | null => {
      let props: TSearchProps | null = null
      if (queries.search) {
        props = { ...queries } as TSearchProps
        return props
      }
      if (queries.table_view && tableViews) {
        const tableView = tableViews.find((t) => t.uuid === queries.table_view)
        if (tableView) {
          props = Object.assign({}, queries, {
            count: tableView.count,
            ordering: tableView.order,
          })
          if (tableView.filter) {
            for (const key in tableView.filter) {
              props[key] = tableView.filter[key]
            }
          }
          return props
        }
      }
      if (getStorage) {
        props = getStorage()
        props = Object.assign({}, queries, props)
        if (props) {
          props.search = false
        }
        return props
      }
      return null
    }
    let props = func()
    if (props && convertSearchProps) {
      props = convertSearchProps(props)
    }
    return props
  }

  const executeSearch = async (): Promise<{
    props: TSearchProps | null
    paginate: TPaginate | null
  }> => {
    // Set loading state at the beginning of the search execution
    loadingStore.setLoading()
    setIsCalledSearch(false)

    if (window.location.pathname !== rootPath) {
      loadingStore.closeLoading() // Close loading if path doesn't match
      return { props: null, paginate: null }
    }

    let props = getSearchQuery()
    if (!props) {
      if (!isSearchInit) {
        loadingStore.closeLoading() // Close loading if not initialized and no props
        return { props: null, paginate: null }
      }
      props = { ...queries } as TSearchProps
    }
    if (props.table_view && tableViews && tableViews.length === 0) {
      props.table_view = ''
    } else if (!props.table_view && tableViews) {
      props.table_view = tableViews.find(
        (t) => t.default && t.type === TableViewType.System
      )?.uuid
    }

    try {
      const { result, response } = await handleApi(
        async () => {
          const paginateResult = getDataClient
            ? getPaginateClient(await getDataClient(props as TSearchProps))
            : await getData?.(props as TSearchProps)
          setPaginate(paginateResult ?? null)
          setSearchProps(props as TSearchProps)
          if (setStorage && props?.not_save_condition !== true) {
            setStorage(props as TSearchProps)
          }
          if (reset) {
            reset(props as TSearchProps)
          }
          return { props: props, paginate: paginateResult }
        },
        { isThrowError: true }
      )
      return result
        ? { props: response.props, paginate: response.paginate }
        : { props: null, paginate: null }
    } catch (e) {
      // Log the error instead of using alert()
      console.error(
        '検索に失敗しました。時間をおいて、再度検索を実行してください。\n※何度もこのエラーが発生する場合、お手数ですが管理者までお問い合わせください。',
        e
      )
      return { props: null, paginate: null }
    } finally {
      // Ensure loading state is closed regardless of success or failure
      loadingStore.closeLoading()
    }
  }

  const changeQueries = async (data: TSearchProps) => {
    Object.keys(data).forEach((key) => {
      if (data[key] === null || data[key] === undefined || data[key] === '') {
        data[key] = null
      }
    })
    let convertedData = data
    if (convertChangeQueries) {
      convertedData = convertChangeQueries(data)
    }
    // Set loading state when initiating a query change, if it's not a client-side data fetch
    if (!isChangeClient) {
      loadingStore.setLoading()
    }
    await setQueries(convertedData as any, { scroll: false, shallow: true })
    setIsCalledSearch(true)
  }

  const setPaginateClient = (items: Array<TRecord>, page = 1) => {
    if (searchProps) {
      searchProps.page = page ?? 1
      const newPaginate = getPaginateClient(items)
      setPaginate(newPaginate)
    }
  }

  const getPaginateClient = (items: Array<TRecord>): TPaginate => {
    return {
      results: items,
      count: items.length,
    } as TPaginate
  }

  const onResetSearchForm = async () => {
    if (setValue && searchProps) {
      const keys = Object.keys(searchProps)
      for (const key of keys) {
        setValue(key as any, '' as any)
      }
    }
  }

  return {
    searchProps,
    queries,
    setQueries,
    onSubmitSearch,
    executeSearch,
    paginate,
    setPaginate,
    setPaginateClient,
    getPaginateClient,
    isCalledSearch,
    searchUsingTableView,
    getSearchQuery,
    onResetSearchForm,
    handlePaginationChange,
    handleSortChange,
  }
}
