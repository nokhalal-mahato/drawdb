import { useRef } from "react";
import Editor from "./components/Editor/Editor";
import data from "./data/example.json";

export default function App() {
  const editorRef = useRef(null);

  const onSave = (data) => {
    console.log("onSave", data);
  };

  return (
    <>
      <Editor
        ref={editorRef}
        data={data}
        onSave={onSave}
        shouldShowExport={true}
      />
    </>
  );
}
