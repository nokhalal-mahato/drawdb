import { useState } from "react";
import { Dropdown, Spin } from "@douyinfe/semi-ui";

import { ObjectType, Action, State } from "../../data/constants";
import { useHotkeys } from "react-hotkeys-hook";

import {
  useTransform,
  useDiagram,
  useUndoRedo,
  useSaveState,
} from "../../hooks";
import ExportModal from "./Modal/ExportModal";
import AddTableModal from "./Modal/AddTableModal";
import { useTranslation } from "react-i18next";
import { nanoid } from "nanoid";
import CommonButton from "../CommonButton";
import {
  ChevronDownIcon,
  FlipBackwardIcon,
  FlipForwardIcon,
  PlusIcon,
  SaveIcon,
  DownloadIcon,
} from "../../icons";

export default function ControlPanel({
  title,
  readOnly,
  shouldShowExport,
  onSave,
}) {
  const [shouldShowExportModal, setShouldShowExportModal] = useState(false);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [exportData, setExportData] = useState({
    data: null,
    filename: `${title}_${new Date().toISOString()}`,
    extension: "",
  });

  const { setSaveState, saveState } = useSaveState();
  const {
    tables,
    relationships,
    database,
    addTable,
    updateTable,
    deleteField,
    deleteTable,
    updateField,
    setRelationships,
    addRelationship,
    deleteRelationship,
    updateRelationship,
  } = useDiagram();
  const { undoStack, redoStack, setUndoStack, setRedoStack } = useUndoRedo();
  const { transform, setTransform } = useTransform();
  const { t } = useTranslation();

  const undo = () => {
    if (undoStack.length === 0) return;
    const a = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.filter((_, i) => i !== prev.length - 1));

    if (a.bulk) {
      for (const element of a.elements) {
        if (element.type === ObjectType.TABLE) {
          updateTable(element.id, element.undo);
        }
      }
      setRedoStack((prev) => [...prev, a]);
      return;
    }

    if (a.action === Action.ADD) {
      if (a.element === ObjectType.TABLE) {
        deleteTable(a.id, false);
      } else if (a.element === ObjectType.RELATIONSHIP) {
        deleteRelationship(a.data.id, false);
      }
      setRedoStack((prev) => [...prev, a]);
    } else if (a.action === Action.MOVE) {
      if (a.element === ObjectType.TABLE) {
        const { x, y } = tables.find((t) => t.id === a.id);
        setRedoStack((prev) => [...prev, { ...a, x, y }]);
        updateTable(a.id, { x: a.x, y: a.y });
      }
    } else if (a.action === Action.DELETE) {
      if (a.element === ObjectType.TABLE) {
        a.data.relationship.forEach((x) => addRelationship(x, false));
        addTable(a.data.table, a.name, false);
      } else if (a.element === ObjectType.RELATIONSHIP) {
        addRelationship(a.data, false);
      }
      setRedoStack((prev) => [...prev, a]);
    } else if (a.action === Action.EDIT) {
      if (a.element === ObjectType.TABLE) {
        const table = tables.find((t) => t.id === a.tid);
        if (a.component === "field") {
          updateField(a.tid, a.fid, a.undo);
        } else if (a.component === "field_delete") {
          setRelationships((prev) => {
            let temp = [...prev];
            a.data.relationship.forEach((r) => {
              temp.splice(r.id, 0, r);
            });
            return temp;
          });
          const updatedFields = table.fields.slice();
          updatedFields.splice(a.data.index, 0, a.data.field);
          updateTable(a.tid, { fields: updatedFields });
        } else if (a.component === "field_add") {
          updateTable(a.tid, {
            fields: table.fields.filter((e) => e.id !== a.fid),
          });
        } else if (a.component === "index_add") {
          updateTable(a.tid, {
            indices: table.indices
              .filter((e) => e.id !== table.indices.length - 1)
              .map((t, i) => ({ ...t, id: i })),
          });
        } else if (a.component === "index") {
          updateTable(a.tid, {
            indices: table.indices.map((index) =>
              index.id === a.iid
                ? {
                    ...index,
                    ...a.undo,
                  }
                : index,
            ),
          });
        } else if (a.component === "index_delete") {
          const updatedIndices = table.indices.slice();
          updatedIndices.splice(a.data.id, 0, a.data);
          updateTable(a.tid, {
            indices: updatedIndices.map((t, i) => ({ ...t, id: i })),
          });
        } else if (a.component === "self") {
          updateTable(a.tid, a.undo);
        }
      } else if (a.element === ObjectType.RELATIONSHIP) {
        updateRelationship(a.rid, a.undo);
      }
      setRedoStack((prev) => [...prev, a]);
    }
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const a = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.filter((e, i) => i !== prev.length - 1));

    if (a.bulk) {
      for (const element of a.elements) {
        if (element.type === ObjectType.TABLE) {
          updateTable(element.id, element.redo);
        }
      }
      setUndoStack((prev) => [...prev, a]);
      return;
    }

    if (a.action === Action.ADD) {
      if (a.element === ObjectType.TABLE) {
        addTable(null, a.name, false);
      } else if (a.element === ObjectType.RELATIONSHIP) {
        addRelationship(a.data, false);
      }
      setUndoStack((prev) => [...prev, a]);
    } else if (a.action === Action.MOVE) {
      if (a.element === ObjectType.TABLE) {
        const { x, y } = tables.find((t) => t.id == a.id);
        setUndoStack((prev) => [...prev, { ...a, x, y }]);
        updateTable(a.id, { x: a.x, y: a.y });
      }
    } else if (a.action === Action.DELETE) {
      if (a.element === ObjectType.TABLE) {
        deleteTable(a.data.table.id, false);
      } else if (a.element === ObjectType.RELATIONSHIP) {
        deleteRelationship(a.data.id, false);
      }
      setUndoStack((prev) => [...prev, a]);
    } else if (a.action === Action.EDIT) {
      if (a.element === ObjectType.TABLE) {
        const table = tables.find((t) => t.id === a.tid);
        if (a.component === "field") {
          updateField(a.tid, a.fid, a.redo);
        } else if (a.component === "field_delete") {
          deleteField(a.data.field, a.tid, false);
        } else if (a.component === "field_add") {
          updateTable(a.tid, {
            fields: [
              ...table.fields,
              {
                name: "",
                type: "",
                default: "",
                check: "",
                primary: false,
                unique: false,
                notNull: false,
                increment: false,
                comment: "",
                id: nanoid(),
              },
            ],
          });
        } else if (a.component === "index_add") {
          updateTable(a.tid, {
            indices: [
              ...table.indices,
              {
                id: table.indices.length,
                name: `index_${table.indices.length}`,
                fields: [],
              },
            ],
          });
        } else if (a.component === "index") {
          updateTable(a.tid, {
            indices: table.indices.map((index) =>
              index.id === a.iid
                ? {
                    ...index,
                    ...a.redo,
                  }
                : index,
            ),
          });
        } else if (a.component === "index_delete") {
          updateTable(a.tid, {
            indices: table.indices
              .filter((e) => e.id !== a.data.id)
              .map((t, i) => ({ ...t, id: i })),
          });
        } else if (a.component === "self") {
          updateTable(a.tid, a.redo, false);
        }
      } else if (a.element === ObjectType.RELATIONSHIP) {
        updateRelationship(a.rid, a.redo);
      }
      setUndoStack((prev) => [...prev, a]);
    }
  };

  const zoomIn = () =>
    setTransform((prev) => ({ ...prev, zoom: prev.zoom * 1.2 }));
  const zoomOut = () =>
    setTransform((prev) => ({ ...prev, zoom: prev.zoom / 1.2 }));

  const onSuccessSave = () => {
    setSaveState(State.SAVED);
  };

  const onErrorSave = () => {
    setSaveState(State.ERROR);
  };

  const save = async () => {
    if (saveState === State.SAVING) return;

    setSaveState(State.SAVING);

    const result = JSON.stringify(
      {
        tables: tables,
        relationships: relationships,
        database: database,
        title: title,
      },
      null,
      2,
    );

    onSave(result, onSuccessSave, onErrorSave);
  };

  const handleExportClick = () => {
    const result = JSON.stringify(
      {
        tables: tables,
        relationships: relationships,
        database: database,
        title: title,
      },
      null,
      2,
    );
    setExportData((prev) => ({
      ...prev,
      data: result,
      extension: "json",
    }));
    setShouldShowExportModal(true);
  };

  const handleAddTableClick = () => {
    setShowAddTableModal(true);
  };

  const handleAddTableConfirm = (tableName) => {
    addTable(null, tableName);
    setRedoStack([]);
    setShowAddTableModal(false);
  };

  const handleAddTableCancel = () => {
    setShowAddTableModal(false);
  };

  useHotkeys("mod+z", undo, { preventDefault: true });
  useHotkeys("mod+y", redo, { preventDefault: true });
  useHotkeys("mod+up", zoomIn, { preventDefault: true });
  useHotkeys("mod+down", zoomOut, { preventDefault: true });

  return (
    <>
      <div>{toolbar()}</div>
      <ExportModal
        visible={shouldShowExportModal}
        exportData={exportData}
        setExportData={setExportData}
        title={title}
        setModal={setShouldShowExportModal}
      />
      <AddTableModal
        visible={showAddTableModal}
        onCancel={handleAddTableCancel}
        onConfirm={handleAddTableConfirm}
      />
    </>
  );

  function toolbar() {
    return (
      <div className="flex flex-col self-stretch gap-2.5 py-3 px-4 border-b border-gray-200 bg-white">
        <div className="flex flex-row items-center self-stretch gap-4">
          <div className="flex flex-row items-center gap-4 flex-1">
            <Dropdown
              style={{ width: "240px" }}
              position={"bottomLeft"}
              trigger="click"
              render={
                <Dropdown.Menu>
                  {[0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 3.0].map((e, i) => (
                    <Dropdown.Item
                      key={i}
                      onClick={() => {
                        setTransform((prev) => ({ ...prev, zoom: e }));
                      }}
                    >
                      {Math.floor(e * 100)}%
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              }
            >
              <div className="flex items-center justify-center gap-1">
                <div className="font-medium leading-[17px] text-sm">
                  {Math.floor(transform.zoom * 100)}%
                </div>
                <div className="flex items-center justify-center cursor-pointer">
                  <ChevronDownIcon height={20} width={20} />
                </div>
              </div>
            </Dropdown>

            <div className="w-0 h-6 border-l border-slate-500" />
            <div className="flex flex-row items-center gap-2">
              <CommonButton
                leftIcon={<FlipBackwardIcon />}
                onClick={undo}
                variant="default"
                size="medium"
                className="min-w-6 min-h-6 !p-0"
                disabled={undoStack.length === 0}
              />
              <CommonButton
                leftIcon={<FlipForwardIcon />}
                onClick={redo}
                variant="default"
                size="medium"
                className="min-w-6 min-h-6 !p-0"
                disabled={redoStack.length === 0}
              />
            </div>
          </div>
          <div className="flex flex-row items-center gap-4">
            {!readOnly && (
              <CommonButton
                text={t("add_table")}
                leftIcon={<PlusIcon />}
                onClick={handleAddTableClick}
                variant="primary"
                size="medium"
              />
            )}

            {shouldShowExport && (
              <CommonButton
                leftIcon={<DownloadIcon height={20} width={20} />}
                onClick={handleExportClick}
                variant="default"
                size="medium"
                className="min-w-6 min-h-6 !p-0"
              />
            )}

            <CommonButton
              leftIcon={
                saveState === State.SAVING ? (
                  <Spin size="medium" />
                ) : (
                  <SaveIcon />
                )
              }
              onClick={save}
              variant="default"
              size="medium"
              className="min-w-6 min-h-6 !p-0"
              disabled={saveState === State.SAVING}
            />
          </div>
        </div>
      </div>
    );
  }
}
