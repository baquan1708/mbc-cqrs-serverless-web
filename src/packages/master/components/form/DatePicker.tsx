import * as React from 'react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'

import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '../../lib/utils'
import { toISOStringWithTimezone } from '../../lib/utils/datetime'

export default function DatePicker({
  value,
  onChange,
  disabled,
}: {
  value?: Date | string
  onChange: (date?: string) => void
  disabled?: boolean
}) {
  const formattedValue =
    value !== '' && typeof value === 'string' && !isNaN(Date.parse(value)) ? new Date(value) : undefined
  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant={'outline'}
          className={cn('w-full pl-3 text-left font-normal', !value && 'text-[hsl(var(--muted-foreground))]')}
        >
          {formattedValue ? format(formattedValue, 'yyyy/MM/dd') : <span>日時を選択してください</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          disabled={disabled}
          mode="single"
          selected={formattedValue}
          onSelect={(date) => onChange(date ? toISOStringWithTimezone(date) : undefined)}
          defaultMonth={formattedValue}
          initialFocus
          locale={ja}
        />
      </PopoverContent>
    </Popover>
  )
}
