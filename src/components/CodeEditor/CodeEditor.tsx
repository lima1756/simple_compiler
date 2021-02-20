import React from 'react';
import './CodeEditor.css';
import AceEditor from "react-ace";
import CustomSyntaxMode from "./utils/HighlightRules";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

interface CodeEditorProps {
  code: string, setCode: any
}

function CodeEditor(props: CodeEditorProps) {
  const refEditor = React.useRef<AceEditor>(null);
  React.useEffect(() => {
    const customMode = new CustomSyntaxMode();
    if (refEditor.current != null) {
      refEditor.current.editor.getSession().setMode(customMode as any);
    }
  })
  return (
    <div className="CodeEditor">
      <AceEditor
        ref={refEditor}
        placeholder="Please enter your code! :)"
        mode="javascript"
        theme="monokai"
        value={props.code}
        onChange={value => props.setCode(value)}
        name="editor"
        editorProps={{ $blockScrolling: true }}
        height="100%"
        width="100%"
      />
    </div>
  );
}

export default CodeEditor;
