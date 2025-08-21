import { useState, useEffect } from "react";
import { Input, Select, Checkbox } from "@douyinfe/semi-ui";
import { Action, ObjectType } from "../../../data/constants";
import { useDiagram, useUndoRedo } from "../../../hooks";
import { useTranslation } from "react-i18next";
import { dbToTypes } from "../../../data/datatypes";
import { nanoid } from "nanoid";
import { ChevronDownIcon } from "../../../icons";
import CommonButton from "../../CommonButton";

export default function AddFieldForm({
  tableId,
  onCancel,
  onAdd,
  editingField = null,
  onSave,
}) {
  const { t } = useTranslation();
  const { database, updateTable, updateField, tables } = useDiagram();
  const { setUndoStack, setRedoStack } = useUndoRedo();

  const isEditMode = !!editingField;

  const [fieldData, setFieldData] = useState({
    name: editingField?.name || "",
    type: editingField?.type || "",
    primary: editingField?.primary || false,
    notNull: editingField?.notNull || false,
    unique: editingField?.unique || false,
    increment: editingField?.increment || false,
  });

  const table = tables.find((t) => t.id === tableId);

  useEffect(() => {
    setFieldData({
      name: editingField?.name || "",
      type: editingField?.type || "",
      primary: editingField?.primary || false,
      notNull: editingField?.notNull || false,
      unique: editingField?.unique || false,
      increment: editingField?.increment || false,
    });
  }, [editingField]);

  const handleSubmit = () => {
    if (!fieldData.name.trim() || !fieldData.type) {
      return;
    }

    if (isEditMode) {
      setUndoStack((prev) => [
        ...prev,
        {
          action: Action.EDIT,
          element: ObjectType.TABLE,
          component: "field",
          tid: tableId,
          fid: editingField.id,
          undo: {
            name: editingField.name,
            type: editingField.type,
            primary: editingField.primary,
            notNull: editingField.notNull,
            unique: editingField.unique,
            increment: editingField.increment,
          },
          redo: fieldData,
          message: t("edit_table", {
            tableName: table?.name,
            extra: "[edit field]",
          }),
        },
      ]);
      setRedoStack([]);

      updateField(tableId, editingField.id, fieldData);
      onSave?.();
    } else {
      const id = nanoid();
      const newField = {
        id,
        name: fieldData.name,
        type: fieldData.type,
        default: "",
        check: "",
        primary: fieldData.primary,
        unique: fieldData.unique,
        notNull: fieldData.notNull,
        increment: fieldData.increment,
        comment: "",
      };

      setUndoStack((prev) => [
        ...prev,
        {
          action: Action.EDIT,
          element: ObjectType.TABLE,
          component: "field_add",
          tid: tableId,
          fid: id,
          message: t("edit_table", {
            tableName: table?.name,
            extra: "[add field]",
          }),
        },
      ]);
      setRedoStack([]);

      updateTable(tableId, {
        fields: [...(table?.fields || []), newField],
      });

      onAdd?.();
    }
  };

  const handleCancel = () => {
    if (isEditMode) {
      setFieldData({
        name: editingField?.name || "",
        type: editingField?.type || "",
        primary: editingField?.primary || false,
        notNull: editingField?.notNull || false,
        unique: editingField?.unique || false,
        increment: editingField?.increment || false,
      });
    } else {
      setFieldData({
        name: "",
        type: "",
        primary: false,
        notNull: false,
        unique: false,
        increment: false,
      });
    }
    onCancel?.();
  };

  return (
    <div className="p-3 bg-slate-50 border border-slate-200">
      <div className="space-y-3">
        <div className="flex flex-col">
          <div className="text-xs text-slate-600 opacity-80 leading-5">
            Field Name
          </div>
          <Input
            value={fieldData.name}
            placeholder="Field Name"
            onChange={(value) =>
              setFieldData((prev) => ({ ...prev, name: value }))
            }
            style={{
              height: "36px",
              fontSize: "12px",
              lineHeight: "20px",
              display: "flex",
              backgroundColor: "white",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
            }}
            inputStyle={{
              height: "36px",
            }}
            validateStatus={!fieldData.name.trim() ? "error" : "default"}
          />
        </div>

        <div className="flex flex-col">
          <div className="text-xs text-slate-600 opacity-80 leading-5">
            Type
          </div>
          <Select
            value={fieldData.type}
            placeholder="Text"
            onChange={(value) =>
              setFieldData((prev) => ({ ...prev, type: value }))
            }
            className="w-full"
            validateStatus={!fieldData.type ? "error" : "default"}
            optionList={Object.keys(dbToTypes[database] || {}).map((type) => ({
              label: type,
              value: type,
            }))}
            filter
            arrowIcon={<ChevronDownIcon />}
            style={{
              height: "36px",
              fontSize: "12px",
              backgroundColor: "white",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
            }}
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1 min-w-[112px]">
            <Checkbox
              checked={fieldData.primary}
              onChange={(e) =>
                setFieldData((prev) => ({ ...prev, primary: e.target.checked }))
              }
            />
            <span className="text-sm text-slate-600 leading-6">Primary</span>
          </div>

          <div className="flex items-center gap-1 min-w-[112px]">
            <Checkbox
              checked={fieldData.notNull}
              onChange={(e) =>
                setFieldData((prev) => ({ ...prev, notNull: e.target.checked }))
              }
            />
            <span className="text-sm text-slate-600 leading-6">Nullable</span>
          </div>

          <div className="flex items-center gap-1 min-w-[112px]">
            <Checkbox
              checked={fieldData.unique}
              onChange={(e) =>
                setFieldData((prev) => ({ ...prev, unique: e.target.checked }))
              }
            />
            <span className="text-sm text-slate-600 leading-6">Unique</span>
          </div>

          <div className="flex items-center gap-1 min-w-[112px]">
            <Checkbox
              checked={fieldData.increment}
              onChange={(e) =>
                setFieldData((prev) => ({
                  ...prev,
                  increment: e.target.checked,
                }))
              }
            />
            <span className="text-sm text-slate-600 leading-6">
              Auto Increment
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <CommonButton
            onClick={handleCancel}
            variant="secondary"
            text="Cancel"
            className="flex-1 border-slate-300 border-solid"
          />
          <CommonButton
            onClick={handleSubmit}
            variant="primary"
            disabled={!fieldData.name.trim() || !fieldData.type}
            text={isEditMode ? "Save" : "Add"}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
