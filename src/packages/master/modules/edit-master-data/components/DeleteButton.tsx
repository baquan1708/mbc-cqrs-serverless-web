'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import ConfirmButton from '../../../components/buttons/ConfirmButton'
import { useToast } from '../../../components/ui/use-toast'
import { API_URLS } from '../../../lib/constants/url'
import { useSubscribeCommandStatus } from '../../../lib/hook/useSubscribeMessage'
import { useHttpClient } from '../../../provider'
import { DataSettingDataEntity } from '../../../types'
import { ActionButton } from '../templates'

export default function DeleteButton({
  tenantCode,
  deletedItem,
  onDone,
}: {
  tenantCode: string
  deletedItem: DataSettingDataEntity
  onDone: (action: ActionButton) => void
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const httpClient = useHttpClient()

  const { start } = useSubscribeCommandStatus(tenantCode, async (msg) => {
    setSubmitting(false)
    if (msg) {
      toast({
        description: '削除しました。',
        variant: 'success',
      })
      onDone(ActionButton.DELETE)
      // router.push(
      //   `${getPageUrl(tenantCode).DATA_PAGE_URL}?isTypeCodeFixed=1&typeCode=${encodeURIComponent(
      //     `MASTER_SETTING#${deletedItem.masterTypeCode}`
      //   )}`
      // )
    } else {
      toast({
        title: 'データ削除に失敗しました。',
        description: '入力内容を確認した上で再度やり直してください。',
        variant: 'destructive',
      })
      // router.refresh()
    }
  })

  const handleDelete = async () => {
    setSubmitting(true)
    const res = (
      await httpClient.delete<DataSettingDataEntity>(
        `${API_URLS.DATA.DELETE}/${encodeURIComponent(
          `${deletedItem.pk}#${deletedItem.sk}`
        )}`
      )
    ).data

    if (!res?.requestId) {
      setSubmitting(false)
      toast({
        title: 'データ削除に失敗しました。',
        description: '入力内容を確認した上で再度やり直してください。',
        variant: 'destructive',
      })
    } else {
      start(res.requestId)
    }
  }

  return (
    <ConfirmButton
      size="default"
      triggerBtnText="削除"
      title="削除してもよろしいですか？"
      cancelText="キャンセル"
      confirmText="削除"
      loading={submitting}
      className="bg-danger"
      onConfirm={handleDelete}
    />
  )
}
