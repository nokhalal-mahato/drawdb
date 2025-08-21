import {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import ControlPanel from "./EditorHeader/ControlPanel";
import Canvas from "./EditorCanvas/Canvas";
import CodeEditor from "./CodeEditor";
import TabBar from "./TabBar";
import { CanvasContextProvider } from "../context/CanvasContext";
import { WorkspaceTab } from "../data/constants";
import { useDiagram, useUndoRedo } from "../hooks";
import { useTranslation } from "react-i18next";
import { exportSQL } from "../utils/exportSQL";

const WorkSpace = forwardRef(function WorkSpace(
  { data, onSave, readOnly, shouldShowExport },
  ref,
) {
  const [title, setTitle] = useState("Untitled Diagram");
  const [activeTab, setActiveTab] = useState(WorkspaceTab.PLAYGROUND);
  const { tables, relationships, setTables, setRelationships, database } =
    useDiagram();
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const { t } = useTranslation();

  const load = useCallback(async () => {
    setTitle(data.name);
    setTables(data.tables);
    setRelationships(data.relationships);
    setUndoStack([]);
    setRedoStack([]);
  }, [
    setRedoStack,
    setUndoStack,
    setRelationships,
    setTables,
    data.name,
    data.relationships,
    data.tables,
  ]);

  useEffect(() => {
    document.title = "DrawDB";
    load();
  }, [load]);

  const tabs = [
    { id: WorkspaceTab.PLAYGROUND, label: t("playground") },
    { id: WorkspaceTab.CODE, label: t("sql_code") },
  ];

  const sqlCode = exportSQL({
    tables: tables,
    references: relationships,
    database: database,
  });

  useImperativeHandle(
    ref,
    () => ({
      getSqlCode: () => sqlCode,
    }),
    [sqlCode],
  );

  return (
    <div className="h-full flex flex-col overflow-hidden theme">
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === WorkspaceTab.PLAYGROUND ? (
        <div className="flex flex-col h-full">
          <ControlPanel
            title={title}
            readOnly={readOnly}
            shouldShowExport={shouldShowExport}
            onSave={onSave}
          />
          <div
            className="flex h-full overflow-y-auto"
            onPointerDown={(e) => {
              // Required for onPointerLeave to trigger when a touch pointer leaves
              // https://stackoverflow.com/a/70976017/1137077
              e.target.releasePointerCapture(e.pointerId);
            }}
          >
            <div className="relative w-full h-full overflow-hidden">
              <CanvasContextProvider className="h-full w-full">
                <Canvas readOnly={readOnly} />
              </CanvasContextProvider>
            </div>
          </div>
        </div>
      ) : (
        <CodeEditor
          height="100%"
          language="sql"
          value={sqlCode}
          options={{
            minimap: { enabled: false },
            readOnly: true,
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      )}
    </div>
  );
});

export default WorkSpace;
