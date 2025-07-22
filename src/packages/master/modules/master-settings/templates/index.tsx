// src/common/master-ms/modules/master-settings/templates/index.tsx
'use client'

import { ColumnDef } from '@tanstack/react-table'
import { parseAsString, UseQueryStatesKeysMap } from 'next-usequerystate'
import Link from 'next/link'
import React, { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { Search } from 'lucide-react'
import { CommonButton } from '../../../components/buttons'
import { BackButton } from '../../../components/buttons/back-button'
import { DataTable } from '../../../components/table/data-table'
import SortIndicator from '../../../components/table/sort-indicator'
import { Button } from '../../../components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '../../../components/ui/form'
import { Input } from '../../../components/ui/input'
import { countDefault } from '../../../lib/constants/define'
import { API_URLS } from '../../../lib/constants/url'
import useHealthCheck from '../../../lib/hook/useHealthCheck'
import { useLoadingForm } from '../../../lib/hook/useLoadingForm'
import { useNavigation } from '../../../lib/hook/useNavigation'
import { usePagination } from '../../../lib/hook/usePagination'
import {
  useHttpClient,
  useUrlProvider,
  useUserContext,
} from '../../../provider'
import { Paginate } from '../../../types/common'
import { SearchPropsMasterSetting } from '../../../types/master-setting'
import { MasterRdsEntity } from '../../../types/MasterRdsEntity'
import { MasterRdsListEntity } from '../../../types/MasterRdsListEntity'
import { PaginateProps } from '../../../types/pagination'
import { DataTableColumnHeader } from '../../../components/table/data-table-column-header'

export default function MasterSetting() {
  const user = useUserContext()
  const tenantCode = user.tenantCode
  const urlProvider = useUrlProvider()

  const httpClient = useHttpClient()

  const { loading, loadingStore, control, handleSubmit, reset, errors } =
    useLoadingForm<SearchPropsMasterSetting>({
      defaultValues: {
        code: '',
        name: '',
        keyword: '',
      },
    })
  const { navigate } = useNavigation()
  const form = useForm<SearchPropsMasterSetting>()

  const searchPropDefinitions: UseQueryStatesKeysMap<SearchPropsMasterSetting> =
    {
      code: parseAsString.withDefault(''),
      name: parseAsString.withDefault(''),
      keyword: parseAsString.withDefault(''),
      ordering: parseAsString.withDefault(''),
    }

  const getData = async (
    data: SearchPropsMasterSetting
  ): Promise<Paginate<MasterRdsEntity>> => {
    const props: PaginateProps = {
      ...data,
      page: data?.page || 1,
      count: data?.count || countDefault,
      pageSize: data?.count || countDefault,
    }
    const res = (
      await httpClient.get<MasterRdsListEntity>(API_URLS.SETTING.GET_ALL, {
        params: {
          ...props,
          orderBys: data.ordering ? [data.ordering] : undefined,
        },
      })
    ).data
    return {
      count: res.total,
      results: res.items,
    }
  }

  const {
    searchProps,
    paginate,
    executeSearch,
    onSubmitSearch,
    isCalledSearch,
    handlePaginationChange,
    handleSortChange,
  } = usePagination<
    MasterRdsEntity,
    SearchPropsMasterSetting,
    Paginate<MasterRdsEntity>
  >({
    searchPropDefinitions: searchPropDefinitions,
    getData: getData,
    reset: form.reset,
    rootPath: urlProvider.SETTINGS_PAGE_URL,
  })

  useEffect(() => {
    ;(async () => {
      await initSearch()
    })()
  }, [])

  useHealthCheck()

  useEffect(() => {
    if (isCalledSearch) {
      ;(async () => {
        await initSearch()
      })()
    }
  }, [isCalledSearch])

  const initSearch = async () => {
    const { paginate: newPaginate } = await executeSearch()
    if (newPaginate) {
      loadingStore.closeLoading()
    }
  }

  const columns: ColumnDef<MasterRdsEntity>[] = useMemo(
    () => [
      {
        accessorKey: 'code',
        meta: {
          size: '25%',
        },
        header: ({ column }) => {
          return <DataTableColumnHeader column={column} title="コード" />
        },
        cell: ({ row }) => (
          <Link
            prefetch={false}
            className="block w-full overflow-clip break-words text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] hover:underline"
            href={`${
              urlProvider.DATA_PAGE_URL
            }?isTypeCodeFixed=1&typeCode=${encodeURIComponent(
              row.original.code
            )}&typeCodeId=${encodeURIComponent(row.original.id)}`}
          >
            {row.original.code.split('#')[1]}
          </Link>
        ),
      },
      {
        accessorKey: 'name',
        meta: {
          size: '25%',
        },
        header: ({ column }) => {
          return <DataTableColumnHeader column={column} title="名称" />
        },
      },
      {
        accessorKey: 'attributes.description',
        meta: {
          size: '50%',
        },
        header: () => {
          return (
            <div className="flex w-full items-center justify-between px-4 font-bold">
              説明
            </div>
          )
        },
        cell: ({ row }) => (
          <div className="px-4">{row.original.attributes['description']}</div>
        ),
      },
    ],
    [tenantCode]
  )

  const onClickCreate = () => {
    navigate(urlProvider.ADD_SETTINGS_PAGE_URL)
  }

  const onClickPrev = () => {
    navigate(urlProvider.TOP_URL)
  }

  const pagination = useMemo(
    () => ({
      pageIndex: (searchProps?.page ?? 1) - 1,
      pageSize: searchProps?.count ?? countDefault,
    }),
    [searchProps]
  )

  const sorting = useMemo(() => {
    if (!searchProps?.ordering) return []
    const desc = searchProps.ordering.startsWith('-')
    const id = desc ? searchProps.ordering.substring(1) : searchProps.ordering
    return [{ id, desc }]
  }, [searchProps?.ordering])

  return (
    <>
      <div className="flex w-full justify-center">
        <div className="w-full py-3">
          <Form {...form}>
            <form
              className="w-full"
              onSubmit={handleSubmit((onValid) => {
                onSubmitSearch(onValid)
              })}
            >
              <div className="flex w-full flex-col items-center justify-center px-3">
                <div className="flex w-full gap-10">
                  <div className="flex w-fit flex-col gap-4">
                    <div className="lg:text-md flex h-10 items-center text-sm font-semibold">
                      コード
                    </div>
                    <div className="lg:text-md flex h-10 items-center text-sm font-semibold">
                      名称
                    </div>
                    <div className="lg:text-md flex h-10 items-center text-sm font-semibold">
                      説明
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-4">
                    <FormField
                      control={control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="keyword"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-5 px-3">
                <Button type="submit">
                  <Search className="mr-2 h-4 w-4" />
                  検索
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      <div className="mx-3 mb-2 flex justify-end pt-3">
        <CommonButton variant="primary" onClick={onClickCreate}>
          新規作成
        </CommonButton>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={paginate?.results ?? []}
          pageCount={
            paginate ? Math.ceil(paginate.count / pagination.pageSize) : 0
          }
          rowCount={paginate?.count ?? 0}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          sorting={sorting}
          onSortingChange={handleSortChange}
          rowKey="id"
        />
      </div>

      <BackButton onClickPrev={onClickPrev} />
    </>
  )
}
