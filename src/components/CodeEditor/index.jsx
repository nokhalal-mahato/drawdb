import { Editor } from "@monaco-editor/react";

export default function CodeEditor({ ...props }) {
  const handleEditorMount = (editor) => {
    setTimeout(() => {
      editor.getAction("editor.action.formatDocument").run();
    }, 300);
  };

  return (
    <div className="relative h-full">
      <Editor theme={"vs-dark"} onMount={handleEditorMount} {...props} />
    </div>
  );
}
