'use client'
import { Button } from '../ui/button'
import { UploadIcon } from 'lucide-react'
import React, { useRef } from 'react'

interface Props {
  disabled?: boolean
  onAdd: (jsonValue: string) => void
}

export default function ImportJSONButton({ disabled, onAdd }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader()

    fileReader.readAsText(e.target.files?.[0] as File, 'UTF-8')

    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      const fileContent = e.target?.result as string
      onAdd(fileContent)
    }
  }

  return (
    <>
      <Button
        variant="secondary"
        disabled={disabled}
        onClick={() => fileRef.current?.click()}
      >
        <UploadIcon size={16} />
        <span>JSON読込</span>
      </Button>

      <input
        type="file"
        ref={fileRef}
        className="hidden"
        accept={'.json'}
        onChange={handleChange}
      />
    </>
  )
}
