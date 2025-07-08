'use client'

import dynamic from 'next/dynamic'
import React, { useCallback } from 'react'
import type { ReactQuillProps } from 'react-quill'
// import 'react-quill/dist/quill.snow.css' // It's good practice to import the CSS here

// --- UTILITY (Unchanged, but good to keep separate) ---
/**
 * Determines if a component should be disabled, handling boolean or function inputs.
 * @param disabled - A boolean or a function that returns a boolean.
 * @returns `true` if the component should be disabled.
 */
const getDisabledState = (
  disabled: boolean | (() => boolean) | undefined
): boolean => {
  if (typeof disabled === 'function') {
    return disabled()
  }
  return !!disabled
}

// --- DYNAMIC IMPORT & CONFIGURATION ---

// Dynamically import ReactQuill to prevent SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

// Define the toolbar colors and options outside the component to prevent re-creation on every render.
const QUILL_COLORS = [
  '#000000',
  '#ff0000',
  '#ff9900',
  '#ffff00',
  '#008a00',
  '#0066cc',
  '#9933ff',
  '#ffffff',
  '#facccc',
  '#ffebcc',
  '#ffffcc',
  '#cce8cc',
  '#cce0f5',
  '#ebd6ff',
  '#bbbbbb',
  '#f06666',
  '#ffc266',
  '#ffff66',
  '#66b966',
  '#66a3e0',
  '#c285ff',
  '#888888',
  '#a10000',
  '#b26b00',
  '#b2b200',
  '#006100',
  '#0047b2',
  '#6b24b2',
  '#444444',
  '#5c0000',
  '#663d00',
  '#666600',
  '#003700',
  '#002966',
  '#3d1466',
]

const QUILL_MODULES: ReactQuillProps['modules'] = {
  toolbar: [
    ['bold', 'underline'],
    [{ color: QUILL_COLORS }],
    [{ background: QUILL_COLORS }],
    ['link'],
  ],
}

// --- COMPONENT PROPS ---

interface EditorProps {
  value: string
  onChangeController: (value: string) => void
  placeholder?: string
  maxLength?: number
  textAreaRows?: number
  disabled?: boolean | (() => boolean)
  fieldClassName?: string
  fieldAfterLabel?: React.ReactNode
  /** A custom transformation function to run on the value before the final update. */
  transformOnChange?: (value: string) => string
}

// --- REFACTORED COMPONENT ---

/**
 * A rich text editor component using ReactQuill.
 */
export const Editor = ({
  value,
  placeholder,
  fieldClassName,
  textAreaRows = 5,
  maxLength,
  fieldAfterLabel,
  disabled,
  transformOnChange,
  onChangeController,
}: EditorProps) => {
  const handleQuillChange = useCallback(
    (content: string) => {
      let finalValue = content

      // 1. Truncate if maxLength is provided
      if (maxLength && finalValue.length > maxLength) {
        finalValue = finalValue.substring(0, maxLength)
      }

      // 2. Apply custom transformation if the function exists
      if (transformOnChange) {
        finalValue = transformOnChange(finalValue)
      }

      // 3. Call the controller's onChange
      onChangeController(finalValue)
    },
    [maxLength, transformOnChange, onChangeController]
  )

  return (
    <>
      <div className={`${fieldClassName} editor editor${textAreaRows}`}>
        <ReactQuill
          theme="snow"
          value={value}
          modules={QUILL_MODULES}
          className="bg-white"
          placeholder={placeholder}
          onChange={handleQuillChange}
          readOnly={getDisabledState(disabled)}
        />
      </div>
      {fieldAfterLabel && <span className="ml-2">{fieldAfterLabel}</span>}
    </>
  )
}
