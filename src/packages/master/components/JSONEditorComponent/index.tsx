'use client'

import React, { useEffect, useRef } from 'react'
import JSONEditor, { JSONEditorOptions } from 'jsoneditor'

interface JSONEditorComponentProps {
  disabled?: boolean
  text: string
  onChangeText: (jsonString: string) => void
  schema?: object
  onError?: (error: Error) => void
}

const JSONEditorComponent: React.FC<JSONEditorComponentProps> = ({
  disabled,
  text,
  onChangeText,
  schema,
  onError,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const editorRef = useRef<JSONEditor | null>(null)

  // Use a ref to hold the latest callbacks to avoid re-running effects
  const onChangeTextRef = useRef(onChangeText)
  onChangeTextRef.current = onChangeText

  const onErrorRef = useRef(onError)
  onErrorRef.current = onError

  // Initialize editor
  useEffect(() => {
    if (containerRef.current) {
      const options: JSONEditorOptions = {
        mode: disabled ? 'view' : 'code',
        enableSort: false,
        enableTransform: false,
        onChangeText: (jsonString) => {
          // Always call the latest callback
          onChangeTextRef.current(jsonString)
        },
        schema: schema,
        onError: (error) => {
          // Always call the latest callback
          onErrorRef.current?.(error)
        },
      }

      editorRef.current = new JSONEditor(containerRef.current, options)
      editorRef.current.setText(text)
    }

    // Cleanup function to destroy the editor instance on unmount
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy()
        editorRef.current = null
      }
    }
    // Run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update text when prop changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.getText() !== text) {
      editorRef.current.setText(text)
    }
  }, [text])

  // Update schema when prop changes
  useEffect(() => {
    if (editorRef.current && schema) {
      editorRef.current.setSchema(schema)
    }
  }, [schema])

  // Update disabled state when prop changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setMode(disabled ? 'view' : 'code')
    }
  }, [disabled])

  return (
    <div
      className={`jsoneditor-react-container ${
        disabled ? 'jsoneditor-disabled' : ''
      }`}
      ref={containerRef}
    />
  )
}

export default JSONEditorComponent