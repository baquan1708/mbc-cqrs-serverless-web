'use client'

import { SaveIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import DownloadJSONButton from '../../../../components/buttons/DownloadJSONButton'
import ImportJSONButton from '../../../../components/buttons/ImportJSONButton'
import Modal from '../../../../components/DragResizeModal'
import { Button } from '../../../../components/ui/button'
import { useToast } from '../../../../components/ui/use-toast'
import { API_URLS } from '../../../../lib/constants/url'
import { useSubscribeCommandStatus } from '../../../../lib/hook/useSubscribeMessage'
import { removeSortKeyVersion } from '../../../../lib/utils/removeSortKeyVersion'
import { useHttpClient } from '../../../../provider'
import { DataSettingDataEntity } from '../../../../types'
import JSONEditorComponent from '../../../../components/JSONEditorComponent'

function ModalContent({
  open,
  setOpen,
  submitting,
  value,
  setValue,
  saveData,
  onCloseModal,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  submitting: boolean
  value: string
  setValue: Dispatch<SetStateAction<string>>
  saveData: () => Promise<void>
  onCloseModal?: () => void
}) {
  useEffect(() => {
    if (!submitting && !open) {
      onCloseModal?.()
      setOpen(false)
    }
  }, [submitting, open])
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <div className="mt-5 flex-1 mb-3">
        <JSONEditorComponent
          text={value}
          onChangeText={(json) => setValue(json)}
          schema={{
            type: 'array',
            items: {
              type: 'object',
              properties: {
                settingCode: { type: 'string' },
                code: { type: 'string' },
                name: { type: 'string' },
                attributes: { type: 'object' },
              },
              required: ['settingCode', 'code', 'name', 'attributes'],
            },
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          disabled={submitting}
          type="button"
          variant="secondary"
          onClick={() => {
            setOpen(false)
            onCloseModal?.()
          }}
        >
          キャンセル
        </Button>
        <ImportJSONButton disabled={submitting} onAdd={setValue} />
        <DownloadJSONButton
          disabled={submitting}
          fileName="master-data.json"
          data={value}
        />
        <Button type="button" loading={submitting} onClick={saveData}>
          <SaveIcon size={16} />
          データ反映
        </Button>
      </div>
    </div>
  )
}

function TriggerButton({
  setOpen,
  onClick,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>
  onClick?: () => void
}) {
  const handleClick = () => {
    setOpen(true)
    onClick?.()
  }
  return (
    <Button
      onClick={handleClick}
      type="button"
      variant="outline"
      className="block"
    >
      JSONエディタ
    </Button>
  )
}

export default function AddJsonData({
  tenantCode,
  jsonValue,
  onSave,
}: {
  tenantCode: string
  jsonValue?: string
  onSave: (setting: DataSettingDataEntity[]) => void
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [value, setValue] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  const [savedValue, setSavedValue] = useState<DataSettingDataEntity[]>([])
  const httpClient = useHttpClient()
  const isObject = (data: any) => {
    return typeof data === 'object' && !Array.isArray(data) && data !== null
  }
  const isArray = (data: any) => {
    return typeof data === 'object' && Array.isArray(data) && data !== null
  }

  const isValidJsonData = (data: any) => {
    if (!isArray(data)) {
      return false
    }
    for (const item of data) {
      if (!isObject(item)) return false
      if (
        !item?.settingCode ||
        !item?.code ||
        !item?.name ||
        !item?.attributes
      ) {
        return false
      }
      if (!isObject(item.attributes)) {
        return false
      }
    }

    return true
  }
  const { start } = useSubscribeCommandStatus(tenantCode, async (msg) => {
    if (msg) {
      setSubmitting(false)
      setOpen(false)
      onSave(savedValue)
      toast({
        description: '登録しました。',
        variant: 'success',
      })
    } else {
      setSubmitting(false)
      setOpen(false)
      toast({
        title: 'データ登録に失敗しました。',
        description: '入力内容を確認した上で再度やり直してください。',
        variant: 'destructive',
      })
      router.refresh()
    }
  })

  const saveData = async () => {
    const data = JSON.parse(value)
    if (!isValidJsonData(data)) {
      toast({
        title: 'JSON が無効です',
        variant: 'destructive',
      })
      return
    }

    setSubmitting(true)
    let res: DataSettingDataEntity[] | undefined = undefined
    try {
      res = (
        await httpClient.post<DataSettingDataEntity[]>(
          API_URLS.DATA_BULK_UPDATE_API_URL,
          {
            items: data,
          }
        )
      ).data
    } catch (error) {
      console.error(error)
      setSubmitting(false)
    }

    if (!res?.[0].requestId) {
      toast({
        title: 'データ登録に失敗しました。',
        description: '入力内容を確認した上で再度やり直してください。',
        variant: 'destructive',
      })
    } else {
      setSavedValue(
        res.map((item) => ({ ...item, sk: removeSortKeyVersion(item.sk) }))
      )
      start(res[0].requestId)
    }
  }

  useEffect(() => {
    setValue(jsonValue || '')
  }, [jsonValue])

  return (
    <Modal>
      <Modal.Open opens="add-json-data">
        <TriggerButton setOpen={setOpen} />
      </Modal.Open>
      <Modal.Window name="add-json-data">
        <ModalContent
          open={open}
          setOpen={setOpen}
          value={value}
          saveData={saveData}
          setValue={setValue}
          submitting={submitting}
        />
      </Modal.Window>
    </Modal>
  )
}
