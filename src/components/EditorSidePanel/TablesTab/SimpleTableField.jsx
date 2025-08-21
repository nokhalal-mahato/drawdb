import { useDiagram } from "../../../hooks";
import { DeleteIcon, EditIcon } from "../../../icons";
import CommonButton from "../../CommonButton";

export default function SimpleTableField({
  data,
  tid,
  inherited,
  onEdit,
  readOnly = false,
}) {
  const { deleteField } = useDiagram();

  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 -mt-px first:mt-0">
      <div className="flex flex-col flex-1">
        <div className="text-sm font-medium text-slate-900 opacity-80 leading-6">
          {data.name}
        </div>
        <div className="text-sm text-slate-600 opacity-80 leading-6">
          {data.type}
        </div>
      </div>

      {!readOnly && (
        <div className="flex items-center gap-2">
          <CommonButton
            variant="default"
            size="small"
            leftIcon={<EditIcon stroke="#64748B" />}
            onClick={() => onEdit?.(data)}
            className="text-slate-600 border-none bg-transparent hover:bg-slate-200 p-1 w-5 h-5 min-w-5 min-h-5"
          />
          <CommonButton
            variant="default"
            size="small"
            leftIcon={<DeleteIcon />}
            onClick={() => deleteField(data, tid)}
            className="border-none bg-transparent hover:bg-slate-200 p-1 w-5 h-5 min-w-5 min-h-5"
            disabled={inherited}
          />
        </div>
      )}
    </div>
  );
}
