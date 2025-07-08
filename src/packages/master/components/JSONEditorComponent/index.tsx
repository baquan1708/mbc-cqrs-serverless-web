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

  useEffect(() => {
    if (containerRef.current) {
      const options: JSONEditorOptions = {
        mode: 'code',
        enableSort: false,
        enableTransform: false,
        onChangeText: onChangeText,
        schema: schema,
        onError: onError,
      }

      editorRef.current = new JSONEditor(containerRef.current, options)
      editorRef.current.setText(text)
    }

    // Cleanup function to destroy the editor instance
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy()
        editorRef.current = null
      }
    }
  }, [schema, onError, onChangeText]) // Re-create the editor if these props change

  useEffect(() => {
    if (editorRef.current) {
      // Use a try-catch block to prevent errors when the text is not valid JSON
      try {
        const currentJson = editorRef.current.get()
        if (JSON.stringify(currentJson) !== text) {
          editorRef.current.setText(text)
        }
      } catch (error) {
        // If the current text in the editor is not valid JSON,
        // we might still want to force an update.
        editorRef.current.setText(text)
      }
    }
  }, [text])

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
