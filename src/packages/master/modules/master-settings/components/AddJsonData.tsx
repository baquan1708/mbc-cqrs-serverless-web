'use client'

import { SaveIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import DownloadJSONButton from '../../../components/buttons/DownloadJSONButton'
import ImportJSONButton from '../../../components/buttons/ImportJSONButton'
import Modal from '../../../components/DragResizeModal'
import { Button } from '../../../components/ui/button'
import { useToast } from '../../../components/ui/use-toast'
import { API_URLS } from '../../../lib/constants/url'
import { useSubscribeCommandStatus } from '../../../lib/hook/useSubscribeMessage'
import { removeSortKeyVersion } from '../../../lib/utils/removeSortKeyVersion'
import { useHttpClient } from '../../../provider'
import { SettingDataEntity } from '../../../types'
import { isValidSettingJson, sampleSettingJson } from '../schema'
import JSONEditorComponent from '../../../components/JSONEditorComponent'

function ModalContent({
  open,
  value,
  setOpen,
  setValue,
  saveData,
  onCloseModal,
  submitting,
}: {
  open: boolean
  value: string
  submitting: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  setValue: Dispatch<SetStateAction<string>>
  saveData: () => void
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
                code: { type: 'string' },
                name: { type: 'string' },
                attributes: { $ref: '/schemas/attributes' },
              },
              required: ['code', 'name', 'attributes'],

              $defs: {
                attributes: {
                  $id: '/schemas/attributes',
                  type: 'object',
                  properties: {
                    description: { type: 'string' },
                    fields: {
                      type: 'array',
                      items: { $ref: '/schemas/fields' },
                    },
                  },
                  required: ['fields'],
                },
                fields: {
                  $id: '/schemas/fields',
                  type: 'object',
                  properties: {
                    physicalName: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                    dataType: { enum: ['string', 'number', 'json', 'date'] },
                    min: { type: 'string' },
                    max: { type: 'string' },
                    length: { type: 'string' },
                    maxRow: { type: 'number' },
                    defaultValue: { type: 'string' },
                    isRequired: { type: 'boolean' },
                    isShowedOnList: { type: 'boolean' },
                    dataFormat: { type: 'string' },
                  },
                  required: [
                    'physicalName',
                    'name',
                    'dataType',
                    'isRequired',
                    'isShowedOnList',
                  ],
                },
              },
            },
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={submitting}
          onClick={() => {
            onCloseModal?.()
            setOpen(false)
          }}
        >
          キャンセル
        </Button>
        <ImportJSONButton disabled={submitting} onAdd={setValue} />
        <DownloadJSONButton
          disabled={submitting}
          fileName="master-setting.json"
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
  disabled,
  setOpen,
  onClick,
}: {
  disabled: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  onClick?: () => void
}) {
  const handleClick = () => {
    setOpen(true)
    onClick?.()
  }
  return (
    <Button
      type="button"
      variant="outline"
      className="block"
      disabled={disabled}
      onClick={handleClick}
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
  onSave: (setting: SettingDataEntity[]) => void
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [value, setValue] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  const [savedData, setSavedData] = useState<SettingDataEntity[]>([])
  const httpClient = useHttpClient()
  const { start } = useSubscribeCommandStatus(tenantCode, async (msg) => {
    if (msg) {
      setSubmitting(false)
      setOpen(false)
      onSave(savedData)
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
    if (!isValidSettingJson(data)) {
      toast({
        title: 'JSON が無効です',
        variant: 'destructive',
      })
      return
    }

    setSubmitting(true)
    let res: SettingDataEntity[] | undefined = undefined
    try {
      res = (
        await httpClient.post<SettingDataEntity[]>(
          API_URLS.SETTINGS_BULK_UPDATE_API_URL,
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
      setSubmitting(false)
      toast({
        title: 'データ登録に失敗しました。',
        description: '入力内容を確認した上で再度やり直してください。',
        variant: 'destructive',
      })
    } else {
      start(res[0].requestId)
      setSavedData(
        res.map((item) => ({ ...item, sk: removeSortKeyVersion(item.sk) }))
      )
    }
  }

  useEffect(() => {
    setValue(jsonValue || sampleSettingJson)
  }, [jsonValue])

  return (
    <Modal>
      <Modal.Open opens="add-json-setting">
        <TriggerButton disabled={submitting} setOpen={setOpen} />
      </Modal.Open>
      <Modal.Window name="add-json-setting">
        <ModalContent
          submitting={submitting}
          open={open}
          value={value}
          setOpen={setOpen}
          saveData={saveData}
          setValue={setValue}
        />
      </Modal.Window>
    </Modal>
  )
}
