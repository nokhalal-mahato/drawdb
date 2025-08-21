import { forwardRef } from "react";
import TransformContextProvider from "../../context/TransformContext";
import TablesContextProvider from "../../context/DiagramContext";
import UndoRedoContextProvider from "../../context/UndoRedoContext";
import SelectContextProvider from "../../context/SelectContext";
import SaveStateContextProvider from "../../context/SaveStateContext";
import WorkSpace from "../Workspace";

const Editor = forwardRef(function Editor(
  { data, onSave, readOnly = false, shouldShowExport = false },
  ref,
) {
  const defaultData = {
    tables: [],
    relationships: [],
    title: "Untitled Diagram",
  };

  const defaultOnSave = (data) => {
    console.log("onSave", data);
  };

  return (
    <TransformContextProvider>
      <UndoRedoContextProvider>
        <SelectContextProvider>
          <TablesContextProvider>
            <SaveStateContextProvider>
              <WorkSpace
                ref={ref}
                data={data || defaultData}
                onSave={onSave || defaultOnSave}
                readOnly={readOnly}
                shouldShowExport={shouldShowExport}
              />
            </SaveStateContextProvider>
          </TablesContextProvider>
        </SelectContextProvider>
      </UndoRedoContextProvider>
    </TransformContextProvider>
  );
});

export default Editor;
