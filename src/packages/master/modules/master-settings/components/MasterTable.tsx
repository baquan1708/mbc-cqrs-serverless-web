'use client'
import Link from 'next/link'
import { SettingDataEntity } from '../../../types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table'
import { TENANT_SYSTEM_CODE } from '../../../lib/constants'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { useUrlProvider, useUserContext } from '../../../provider'

interface Props {
  data?: SettingDataEntity[]
  isFetching: boolean
  onDelete: (item: SettingDataEntity) => void
}

export default function MasterTable({ data, isFetching, onDelete }: Props) {
  const user = useUserContext()
  const urlProvider = useUrlProvider()
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted))]">
          {user.tenantCode !== TENANT_SYSTEM_CODE && (
            <TableHead className="w-[10%] whitespace-nowrap text-center font-bold">
              私のもの
            </TableHead>
          )}
          <TableHead className="w-[10%] whitespace-nowrap font-bold">
            コード
          </TableHead>
          <TableHead className="w-[15%] whitespace-nowrap font-bold">
            名称
          </TableHead>
          <TableHead className="whitespace-nowrap font-bold">説明</TableHead>
          {/* <TableHead className="font-bold whitespace-nowrap text-center w-10">アクション</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isFetching ? (
          <TableRow>
            <TableCell colSpan={4}>
              <div className="flex justify-center">
                <Loader2 size={36} />
              </div>
            </TableCell>
          </TableRow>
        ) : !data || !data.length ? (
          <TableRow>
            <TableCell colSpan={4}>
              <div className="text-center">データがありません。</div>
            </TableCell>
          </TableRow>
        ) : (
          data.map((item) => {
            return (
              <TableRow key={item.id}>
                {user.tenantCode !== TENANT_SYSTEM_CODE && (
                  <TableCell className="text-center">
                    {item.tenantCode === user.tenantCode && '◯'}
                  </TableCell>
                )}
                <TableCell className="max-w-40">
                  <Link
                    className="block w-full overflow-hidden text-ellipsis text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
                    href={`${
                      urlProvider.DATA_PAGE_URL
                    }?isTypeCodeFixed=1&typeCode=${encodeURIComponent(
                      item.code
                    )}&typeCodeId=${encodeURIComponent(item.id)}`}
                    // target="_blank"
                  >
                    {item.code.split('#')[1]}
                  </Link>
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.attributes.description}</TableCell>
                {/* <TableCell className="flex justify-center gap-5">
                  <Link href={`${EDIT_SETTINGS_PAGE_URL}/${encodeURIComponent(item.pk)}/${encodeURIComponent(item.sk)}`}>
                    <Button variant="outline" size="sm">
                      編集
                    </Button>
                  </Link>
                  <ConfirmButton
                    size="sm"
                    triggerBtnText="削除"
                    title="削除してもよろしいですか？"
                    cancelText="キャンセル"
                    confirmText="削除"
                    className="bg-danger"
                    loading={deletedItem?.id && item.id === deletedItem.id ? submitting : false}
                    onConfirm={() => handleDelete(item)}
                  />
                </TableCell> */}
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
