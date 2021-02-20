import React from 'react';
import './CodeEditor.css';
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

function CodeEditor() {
  const [code, setCode] = React.useState<String | undefined>(
    `function add(a, b) {\n  return a + b;\n}`
  );
  return (
      <AceEditor
        mode="javascript"
        theme="github"
        onChange={value=>setCode(value)}
        name="editor"
        editorProps={{ $blockScrolling: true }}
      />
  );
}

export default CodeEditor;
