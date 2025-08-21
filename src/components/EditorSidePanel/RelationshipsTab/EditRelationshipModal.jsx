import { useState, useEffect } from "react";
import { Modal, Select } from "@douyinfe/semi-ui";
import { useDiagram, useUndoRedo } from "../../../hooks";
import { Action, ObjectType, Cardinality } from "../../../data/constants";
import { useTranslation } from "react-i18next";
import { areFieldsCompatible } from "../../../utils/utils";
import CommonButton from "../../CommonButton";
import {
  ArrowDownIcon,
  ChevronDownIcon,
  CloseIcon,
  DeleteIcon,
} from "../../../icons";

export default function EditRelationshipModal({
  visible,
  onCancel,
  relationshipData,
}) {
  const { t } = useTranslation();
  const { tables, updateRelationship, deleteRelationship, database } =
    useDiagram();
  const { setUndoStack, setRedoStack } = useUndoRedo();

  const [formData, setFormData] = useState({
    cardinality: Cardinality.ONE_TO_ONE,
    startTableId: "",
    startFieldId: "",
    endTableId: "",
    endFieldId: "",
  });

  const [compatibilityError, setCompatibilityError] = useState("");

  useEffect(() => {
    if (visible && relationshipData) {
      setFormData({
        cardinality: relationshipData.cardinality || Cardinality.ONE_TO_ONE,
        startTableId: relationshipData.startTableId || "",
        startFieldId: relationshipData.startFieldId || "",
        endTableId: relationshipData.endTableId || "",
        endFieldId: relationshipData.endFieldId || "",
      });
      setCompatibilityError("");
    }
  }, [visible, relationshipData]);

  useEffect(() => {
    if (
      formData.startTableId &&
      formData.startFieldId &&
      formData.endTableId &&
      formData.endFieldId
    ) {
      if (
        formData.startTableId === formData.endTableId &&
        formData.startFieldId === formData.endFieldId
      ) {
        setCompatibilityError(
          "Cannot create a relationship between the same field. Please select different source and target fields.",
        );
        return;
      }

      const startTable = tables.find((t) => t.id === formData.startTableId);
      const endTable = tables.find((t) => t.id === formData.endTableId);

      if (startTable && endTable) {
        const startField = startTable.fields.find(
          (f) => f.id === formData.startFieldId,
        );
        const endField = endTable.fields.find(
          (f) => f.id === formData.endFieldId,
        );

        if (startField && endField) {
          if (!areFieldsCompatible(database, startField.type, endField.type)) {
            setCompatibilityError(
              `Cannot connect fields of type "${startField.type}" and "${endField.type}". These field types are not compatible.`,
            );
          } else {
            setCompatibilityError("");
          }
        }
      }
    } else {
      setCompatibilityError("");
    }
  }, [
    formData.startTableId,
    formData.startFieldId,
    formData.endTableId,
    formData.endFieldId,
    tables,
    database,
  ]);

  const handleSave = () => {
    if (!relationshipData) return;

    if (compatibilityError) return;

    setUndoStack((prev) => [
      ...prev,
      {
        action: Action.EDIT,
        element: ObjectType.RELATIONSHIP,
        rid: relationshipData.id,
        undo: {
          cardinality: relationshipData.cardinality,
          startTableId: relationshipData.startTableId,
          startFieldId: relationshipData.startFieldId,
          endTableId: relationshipData.endTableId,
          endFieldId: relationshipData.endFieldId,
        },
        redo: formData,
        message: t("edit_relationship", {
          refName: relationshipData.name,
          extra: "[edit]",
        }),
      },
    ]);
    setRedoStack([]);

    updateRelationship(relationshipData.id, formData);
    onCancel();
  };

  const handleDelete = () => {
    if (!relationshipData) return;
    deleteRelationship(relationshipData.id);
    onCancel();
  };

  const getCardinalityOptions = () => [
    { label: "One-to-One (1:1)", value: Cardinality.ONE_TO_ONE },
    { label: "One-to-Many (1:N)", value: Cardinality.ONE_TO_MANY },
    { label: "Many-to-Many (N:M)", value: Cardinality.MANY_TO_MANY },
  ];

  const getTableOptions = () =>
    tables.map((table) => ({
      label: table.name,
      value: table.id,
    }));

  const getFieldOptions = (tableId) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table) return [];
    return table.fields.map((field) => ({
      label: field.name,
      value: field.id,
    }));
  };

  const renderSelect = (value, onChange, options, disabled) => (
    <Select
      value={value}
      onChange={onChange}
      optionList={options}
      className="w-full"
      disabled={disabled}
      style={{
        height: "48px",
        borderRadius: "12px",
        borderColor: "#CBD5E1",
      }}
      arrowIcon={<ChevronDownIcon />}
    />
  );

  const renderLabel = (label) => (
    <label className="text-sm font-medium text-slate-700 opacity-80">
      {label}
    </label>
  );

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      closable={false}
      footer={null}
      width={551}
      bodyStyle={{
        padding: 0,
        borderRadius: "16px",
        margin: "auto 0px",
      }}
      style={{
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
      centered
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-slate-700 leading-10">
              Edit Relationship
            </h2>
            <p className="text-sm font-medium text-slate-500 leading-6">
              Modify the relationship between tables
            </p>
          </div>
          <button onClick={onCancel}>
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            {renderLabel("Relationship Type")}
            {renderSelect(
              formData.cardinality,
              (value) =>
                setFormData((prev) => ({ ...prev, cardinality: value })),
              getCardinalityOptions(),
              false,
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col flex-1 space-y-2">
              {renderLabel("Source Table")}
              {renderSelect(
                formData.startTableId,
                (value) =>
                  setFormData((prev) => ({
                    ...prev,
                    startTableId: value,
                    startFieldId: getFieldOptions(value)[0].value,
                  })),
                getTableOptions(),
                false,
              )}
            </div>

            <div className="flex flex-col flex-1 space-y-2">
              {renderLabel("Source Field")}
              {renderSelect(
                formData.startFieldId,
                (value) =>
                  setFormData((prev) => ({ ...prev, startFieldId: value })),
                getFieldOptions(formData.startTableId),
                !formData.startTableId,
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDownIcon />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col flex-1 space-y-2">
              {renderLabel("Target Table")}
              {renderSelect(
                formData.endTableId,
                (value) =>
                  setFormData((prev) => ({
                    ...prev,
                    endTableId: value,
                    endFieldId: "",
                  })),
                getTableOptions(),
                false,
              )}
            </div>

            <div className="flex flex-col flex-1 space-y-2">
              {renderLabel("Target Field")}
              {renderSelect(
                formData.endFieldId,
                (value) =>
                  setFormData((prev) => ({ ...prev, endFieldId: value })),
                getFieldOptions(formData.endTableId),
                !formData.endTableId,
              )}
            </div>
          </div>
        </div>

        {compatibilityError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  Incompatible Field Types
                </p>
                <p className="mt-1 text-sm text-red-700">
                  {compatibilityError}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 text-red-600 hover:bg-red-50 p-2 rounded"
          >
            <DeleteIcon />
            <span className="text-sm font-medium">Delete</span>
          </button>

          <div className="flex gap-2">
            <CommonButton
              onClick={onCancel}
              variant="secondary"
              className="border-slate-300 border-solid"
              text={"Cancel"}
            />
            <CommonButton
              onClick={handleSave}
              variant="primary"
              text={"Save Changes"}
              disabled={!!compatibilityError}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
