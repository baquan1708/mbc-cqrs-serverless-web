// components/ArrayInputField.tsx
import { Trash2, Plus } from 'lucide-react'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import React from 'react'

interface ArrayInputFieldProps {
  values: string[]
  onChange: (val: string[]) => void
  disabled?: boolean
}

export default function ArrayInputField({
  values,
  onChange,
  disabled,
}: ArrayInputFieldProps) {
  const handleChange = (index: number, value: string) => {
    const updated = [...values]
    updated[index] = value
    onChange(updated)
  }

  const handleAdd = () => {
    onChange([...values, ''])
  }

  const handleRemove = (index: number) => {
    const updated = values.filter((_, i) => i !== index)
    onChange(updated)
  }

  return (
    <div className="flex flex-col gap-2">
      {values.map((value, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            disabled={disabled}
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleRemove(index)}
            disabled={disabled}
          >
            <Trash2 size={18} />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={handleAdd}
        size="sm"
        variant="secondary"
        disabled={disabled}
      >
        <Plus size={16} className="mr-1" />
        アイテム追加
      </Button>
    </div>
  )
}
