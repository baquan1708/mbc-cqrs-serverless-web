'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import ConfirmButton from '../../../components/buttons/ConfirmButton'
import { useToast } from '../../../components/ui/use-toast'
import { API_URLS } from '../../../lib/constants/url'
import { useSubscribeCommandStatus } from '../../../lib/hook/useSubscribeMessage'
import { useHttpClient, useUrlProvider } from '../../../provider'
import { SettingDataEntity } from '../../../types'

export default function DeleteButton({
  tenantCode,
  deletedItem,
}: {
  tenantCode: string
  deletedItem: SettingDataEntity
}) {
  const urlProvider = useUrlProvider()
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
      router.push(urlProvider.SETTINGS_PAGE_URL)
    } else {
      toast({
        title: 'データ削除に失敗しました。',
        description: '入力内容を確認した上で再度やり直してください。',
        variant: 'destructive',
      })
    }
  })

  const handleDelete = async () => {
    setSubmitting(true)
    const res = (
      await httpClient.delete<SettingDataEntity>(
        `${API_URLS.SETTINGS_API_URL}/${encodeURIComponent(
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
