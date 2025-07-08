'use client'

import { Button } from '../ui/button'
import { DownloadIcon } from 'lucide-react'
import * as React from 'react'

interface Props {
  disabled?: boolean
  fileName: string
  data: string
}

export default function DownloadJSONButton({
  fileName,
  data,
  disabled,
}: Props) {
  const downloadJson = () => {
    const url = window.URL.createObjectURL(new Blob([data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button variant="secondary" disabled={disabled} onClick={downloadJson}>
      <DownloadIcon size={16} />
      <span>JSON保存</span>
    </Button>
  )
}
