import { useDiagram } from "../../../hooks";
import { useMemo } from "react";
import EditIcon from "../../../icons/EditIcon";
import ArrowDownIcon from "../../../icons/ArrowDownIcon";
import { Cardinality } from "../../../data/constants";
import { DeleteIcon } from "../../../icons";

const getCardinalityText = (cardinality) => {
  switch (cardinality) {
    case Cardinality.ONE_TO_ONE:
      return "1:1";
    case Cardinality.ONE_TO_MANY:
      return "1:N";
    case Cardinality.MANY_TO_ONE:
      return "N:1";
    case Cardinality.MANY_TO_MANY:
      return "N:M";
    default:
      return "1:1";
  }
};

export default function RelationshipCard({ data, onEdit, readOnly = false }) {
  const { tables, deleteRelationship } = useDiagram();

  const relValues = useMemo(() => {
    const startTable = tables.find((t) => t.id === data.startTableId);
    const endTable = tables.find((t) => t.id === data.endTableId);

    if (!startTable || !endTable) return null;

    const startField = startTable.fields.find(
      (f) => f.id === data.startFieldId,
    );
    const endField = endTable.fields.find((f) => f.id === data.endFieldId);

    if (!startField || !endField) return null;

    return {
      startTableName: startTable.name,
      startFieldName: startField.name,
      startFieldType: startField.type,
      endTableName: endTable.name,
      endFieldName: endField.name,
      endFieldType: endField.type,
    };
  }, [tables, data]);

  if (!relValues) return null;

  const renderField = (field, type) => {
    return (
      <div className="flex items-center justify-between w-full gap-2">
        <div className="text-sm font-medium text-slate-900 opacity-80 truncate flex-1 min-w-0">
          {field}
        </div>
        <div className="text-sm text-slate-600 opacity-80 flex-shrink-0">
          {type}
        </div>
      </div>
    );
  };

  return (
    <div className="border border-slate-200 overflow-hidden -mt-px first:mt-0">
      <div className="p-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-sm font-medium">
            {getCardinalityText(data.cardinality)}
          </div>

          {!readOnly && (
            <div className="flex items-center gap-2 ml-3">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => onEdit(data)}
              >
                <EditIcon stroke="#334155" />
              </div>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => deleteRelationship(data.id)}
              >
                <DeleteIcon />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          {renderField(relValues.startFieldName, relValues.startFieldType)}
          <ArrowDownIcon />
          {renderField(relValues.endFieldName, relValues.endFieldType)}
        </div>
      </div>
    </div>
  );
}
