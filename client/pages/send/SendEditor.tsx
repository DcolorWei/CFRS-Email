import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { Card, CardBody } from '@heroui/react';

function SendEditor({ content, onChange }) {
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const toolbarConfig: Partial<IToolbarConfig> = {};
  const editorConfig: Partial<IEditorConfig> = { placeholder: '请输入正文' };

  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: "1px" }}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: '1px solid #ccc' }}
      />
      <Editor
        defaultConfig={editorConfig}
        value={content}
        onCreated={setEditor}
        onChange={(editor) => onChange(editor.getHtml())}
        mode="default"
        style={{ height: '500px', overflowY: 'hidden' }}
      />
    </div>
  )
}

export default SendEditor;