import React, { useEffect, useRef } from 'react'
import JSONEditor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'

const JsonEditor = ({ json, onChange }) => {
  const editorRef = useRef(null)
  const editorInstance = useRef(null)

  useEffect(() => {
    if (editorRef.current) {
      editorInstance.current = new JSONEditor(editorRef.current, {
        mode: 'tree',
        onChangeJSON: (newJson) => {
          if (onChange) {
            onChange(newJson)
          }
        },
      })
      editorInstance.current.set(json)
    }

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy()
      }
    }
  }, [])

  useEffect(() => {
    if (editorInstance.current) {
      editorInstance.current.update(json)
    }
  }, [json])

  return <div ref={editorRef} style={{ height: '500px' }} />
}

export default JsonEditor
