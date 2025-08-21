import { useState } from "react";
import TableHeader from "../TableHeader";
import SimpleTableField from "./SimpleTableField";
import AddFieldForm from "./AddFieldForm";
import { useDiagram } from "../../../hooks";
import CommonButton from "../../CommonButton";

export default function TablesTab({ data, readOnly = false }) {
  const { tables } = useDiagram();
  const [showAddField, setShowAddField] = useState(false);
  const [editingField, setEditingField] = useState(null);

  const inheritedFieldNames =
    Array.isArray(data.inherits) && data.inherits.length > 0
      ? data.inherits
          .map((parentName) => {
            const parent = tables.find((t) => t.name === parentName);
            return parent ? parent.fields.map((f) => f.name) : [];
          })
          .flat()
      : [];

  const handleAddFieldCancel = () => {
    setShowAddField(false);
  };

  const handleAddFieldAdd = () => {
    setShowAddField(false);
  };

  const handleEditField = (field) => {
    setEditingField(field);
    setShowAddField(false);
  };

  const handleShowAddField = () => {
    setShowAddField(true);
    setEditingField(null);
  };

  const handleEditFieldSave = () => {
    setEditingField(null);
  };

  const handleEditFieldCancel = () => {
    setEditingField(null);
  };

  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden w-full">
      <TableHeader
        tableName={data.name}
        tableId={data.id}
        readOnly={readOnly}
      />

      <div className="bg-white">
        {data.fields.map((field) => (
          <div key={field.id}>
            {editingField && editingField.id === field.id ? (
              <AddFieldForm
                tableId={data.id}
                editingField={field}
                onCancel={handleEditFieldCancel}
                onSave={handleEditFieldSave}
              />
            ) : (
              <SimpleTableField
                data={field}
                tid={data.id}
                inherited={inheritedFieldNames.includes(field.name)}
                onEdit={handleEditField}
                readOnly={readOnly}
              />
            )}
          </div>
        ))}

        {showAddField && !editingField && (
          <AddFieldForm
            tableId={data.id}
            onCancel={handleAddFieldCancel}
            onAdd={handleAddFieldAdd}
          />
        )}
      </div>

      {!readOnly && (
        <div className="bg-white border-t border-slate-200 rounded-b-lg">
          <CommonButton
            onClick={handleShowAddField}
            variant="default"
            text="+ Add New Field"
            disabled={showAddField || !!editingField}
            className="!py-2 !px-3 w-full !justify-start !text-blue-600 font-semibold text-sm bg-transparent border-none hover:bg-transparent opacity-80"
          />
        </div>
      )}
    </div>
  );
}
