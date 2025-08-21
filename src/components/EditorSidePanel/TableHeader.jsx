import { useState, useRef, useEffect } from "react";
import { Input } from "@douyinfe/semi-ui";
import { useDiagram, useUndoRedo } from "../../hooks";
import { Action, ObjectType } from "../../data/constants";
import { useTranslation } from "react-i18next";
import DataBaseIcon from "../../icons/DataBaseIcon";
import DeleteIcon from "../../icons/DeleteIcon";
import EditIcon from "../../icons/EditIcon";
import CheckIcon from "../../icons/CheckIcon";

export default function TableHeader({ tableName, tableId, readOnly = false }) {
  const { t } = useTranslation();

  const [isEditMode, setIsEditMode] = useState(false);
  const { deleteTable, updateTable } = useDiagram();
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const [localName, setLocalName] = useState(tableName);
  const [originalName, setOriginalName] = useState(tableName);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isEditMode) {
      setLocalName(tableName);
      setOriginalName(tableName);
    }
  }, [tableName, isEditMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isEditMode &&
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setLocalName(originalName);
        setIsEditMode(false);
      }
    };

    if (isEditMode) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isEditMode, originalName, setIsEditMode]);

  const handleConfirm = () => {
    if (localName.trim() === "" || localName === originalName) {
      setIsEditMode(false);
      return;
    }

    setUndoStack((prev) => [
      ...prev,
      {
        action: Action.EDIT,
        element: ObjectType.TABLE,
        component: "self",
        tid: tableId,
        undo: { name: originalName },
        redo: { name: localName },
        message: t("edit_table", {
          tableName: localName,
          extra: "[name]",
        }),
      },
    ]);
    setRedoStack([]);

    updateTable(tableId, { name: localName });
    setIsEditMode(false);
  };

  const handleEditStart = () => {
    setOriginalName(tableName);
    setLocalName(tableName);
    setIsEditMode(true);
  };

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-between bg-slate-900 text-white px-3 py-2 rounded-t-lg border"
    >
      <div className="flex items-center gap-2 flex-1">
        <div className="flex items-center cursor-pointer mr-2">
          <DataBaseIcon />
        </div>
        {isEditMode ? (
          <div className="flex-1 border-b border-slate-400 min-h-6">
            <Input
              ref={inputRef}
              value={localName}
              validateStatus={localName.trim() === "" ? "error" : "default"}
              placeholder={t("name")}
              style={{
                backgroundColor: "transparent",
                border: "none",
                padding: "0",
                fontSize: "14px",
                fontWeight: "500",
                color: "white",
                boxShadow: "none",
                height: "22px",
                display: "flex",
              }}
              onChange={(value) => setLocalName(value)}
              onPressEnter={handleConfirm}
              inputStyle={{
                height: "22px",
              }}
              autoFocus
            />
          </div>
        ) : (
          <span className="text-sm font-medium text-white leading-6 flex-1">
            {tableName}
          </span>
        )}
      </div>

      {!readOnly && (
        <div className="flex items-center gap-2">
          <div
            className="flex items-center cursor-pointer w-5 h-5"
            onClick={isEditMode ? handleConfirm : handleEditStart}
          >
            {isEditMode ? <CheckIcon /> : <EditIcon />}
          </div>
          <div
            className="flex items-center cursor-pointer w-5 h-5"
            onClick={() => deleteTable(tableId)}
          >
            <DeleteIcon />
          </div>
        </div>
      )}
    </div>
  );
}
