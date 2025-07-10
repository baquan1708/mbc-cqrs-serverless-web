'use client'

import React from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css' // or 'quill.bubble.css'

/*
 * Custom toolbar options
 * For more options, visit https://quilljs.com/docs/modules/toolbar/
 */
const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image', 'video'],
    ['clean'],
  ],
}

/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
]

/**
 * A reusable rich text editor component based on React Quill.
 *
 * @param {object} props - The component props.
 * @param {string} props.value - The HTML content for the editor.
 * @param {function(string): void} props.onChange - The callback function that handles content changes.
 * @param {string} [props.placeholder=''] - The placeholder text for the editor.
 * @returns {JSX.Element} The RichTextEditor component.
 */
const RichTextEditor = ({ value, onChange, placeholder = '' }) => {
  return (
    <ReactQuill
      theme="snow"
      value={value || ''}
      modules={modules}
      formats={formats}
      onChange={onChange}
      placeholder={placeholder}
      style={{ backgroundColor: 'white' }} // Example of inline styling
    />
  )
}

export default RichTextEditor
