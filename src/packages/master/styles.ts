// This file is used by tsup to bundle all necessary CSS into a single file.

// Global styles
import './styles/globals.css'

// JSON Editor styles
import 'jsoneditor/dist/jsoneditor.css'
import './components/JSONEditorComponent/JSONEditorComponent.css'

// Quill (for Editor component) styles
import 'react-quill-new/dist/quill.snow.css'

// Other component styles that were previously commented out or needed
import './modules/edit-master-settings/components/field-editor/style.css'
import './modules/edit-master-settings/components/field-editor/react-datepicker.css'

// MD-Editor styles
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
