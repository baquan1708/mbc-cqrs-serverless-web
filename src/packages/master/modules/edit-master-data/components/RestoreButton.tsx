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

export default function RestoreButton({
  tenantCode,
  restoreItem,
  onDone,
}: {
  tenantCode: string
  restoreItem: DataSettingDataEntity
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
        description: '復旧しました。',
        variant: 'success',
      })
      onDone(ActionButton.RESTORE)
      // router.push(`${getPageUrl(tenantCode).DATA_PAGE_URL}?isTypeCodeFixed=1&typeCode=${encodeURIComponent(`MASTER_SETTING#${restoreItem.masterTypeCode}`)}`)
    } else {
      toast({
        title: 'データ復旧に失敗しました。',
        description: '入力内容を確認した上で再度やり直してください。',
        variant: 'destructive',
      })
    }
  })

  const handleRestore = async () => {
    setSubmitting(true)
    const res = (
      await httpClient.put<DataSettingDataEntity>(
        `${API_URLS.DATA_API_URL}/${encodeURIComponent(
          `${restoreItem.pk}#${restoreItem.sk}`
        )}`,
        {
          isDeleted: false,
        }
      )
    ).data

    if (!res?.requestId) {
      setSubmitting(false)
      toast({
        title: 'データ復旧に失敗しました。',
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
      triggerBtnText="復旧"
      title="復旧してもよろしいですか？"
      cancelText="キャンセル"
      confirmText="復旧"
      className="bg-success hover:bg-success/90 ml-auto mr-0"
      loading={submitting}
      onConfirm={handleRestore}
    />
  )
}
