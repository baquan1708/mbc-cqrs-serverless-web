'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Inbox, X } from 'lucide-react'
import { Button } from './button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Badge } from './badge'
import { cn } from '../../lib/utils'

export type OptionType = {
  label: string
  value: string
}

interface MultiSelectComboboxProps {
  options: OptionType[]
  selected: string[]
  onChange: (selected: string[]) => void
  className?: string
  placeholder?: string
}

export function MultiSelectCombobox({
  options,
  selected,
  onChange,
  className,
  placeholder = 'Select options...',
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]
    onChange(newSelected)
  }

  const selectedLabels = selected
    .map((value) => options.find((option) => option.value === value)?.label)
    .filter(Boolean) as string[]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between h-auto', className)}
        >
          <div className="flex gap-1 flex-wrap">
            {selectedLabels.length > 0 ? (
              selectedLabels.map((label) => (
                <Badge key={label} variant="secondary" className="mr-1">
                  {label}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground font-normal">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>
              <div className="flex flex-col items-center justify-center space-y-4 text-muted-foreground opacity-20">
                <Inbox className="h-16 w-16" />
                <p>データがありません</p>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.includes(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    value={`${option.label} ${option.value}`}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Check className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
                    {option.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
