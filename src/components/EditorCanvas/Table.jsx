import { useMemo } from "react";
import {
  Tab,
  ObjectType,
  tableWidth,
  tableHeaderHeight,
  tableFieldCenterOffset,
  tableFieldHeight,
  tableDotRadius,
  tableDotOffset,
} from "../../data/constants";

import { SideSheet } from "@douyinfe/semi-ui";
import { useDiagram, useSelect } from "../../hooks";
import { useTranslation } from "react-i18next";
import { dbToTypes } from "../../data/datatypes";
import { getTableHeight } from "../../utils/utils";
import SidePanel from "../EditorSidePanel/SidePanel";
import {
  DataBaseIcon,
  DeleteIcon,
  DetailsIcon,
  EditIcon,
  KeyIcon,
} from "../../icons";
import CommonButton from "../CommonButton";

export default function Table({
  tableData,
  onPointerDown,
  setHoveredTable,
  handleGripField,
  setLinkingLine,
  readOnly = false,
}) {
  const { database } = useDiagram();
  const { deleteTable } = useDiagram();
  const { t } = useTranslation();
  const { selectedElement, setSelectedElement, bulkSelectedElements } =
    useSelect();

  const height = getTableHeight(tableData);

  const isSelected = useMemo(() => {
    return (
      (selectedElement.id == tableData.id &&
        selectedElement.element === ObjectType.TABLE) ||
      bulkSelectedElements.some(
        (e) => e.type === ObjectType.TABLE && e.id === tableData.id,
      )
    );
  }, [selectedElement, tableData, bulkSelectedElements]);

  const openEditor = () => {
    setSelectedElement((prev) => ({
      ...prev,
      currentTab: Tab.TABLES,
      element: ObjectType.TABLE,
      id: tableData.id,
      open: true,
    }));
  };

  const getFieldCenterY = (fieldIndex) =>
    tableData.y +
    fieldIndex * tableFieldHeight +
    tableHeaderHeight +
    tableFieldCenterOffset;

  const handleConnectionDotPointerDown = (
    e,
    fieldData,
    index,
    isRightSide = false,
  ) => {
    if (!e.isPrimary) return;

    handleGripField();

    const fieldCenterY = getFieldCenterY(index);
    const connectionX = isRightSide
      ? tableData.x + tableWidth + tableDotOffset
      : tableData.x - tableDotOffset;

    setLinkingLine((prev) => ({
      ...prev,
      startFieldId: fieldData.id,
      startTableId: tableData.id,
      startX: connectionX,
      startY: fieldCenterY,
      endX: connectionX,
      endY: fieldCenterY,
    }));
  };

  const renderConnectionDot = (fieldData, index, isRightSide = false) => {
    const fieldCenterY = getFieldCenterY(index);
    const cx = isRightSide ? tableData.x + tableWidth : tableData.x;

    return (
      <circle
        cx={cx}
        cy={fieldCenterY}
        r={tableDotRadius}
        fill="#FFFFFF"
        stroke="#2563EB"
        strokeWidth="3"
        className="cursor-pointer hover:stroke-blue-700"
        onPointerDown={(e) =>
          handleConnectionDotPointerDown(e, fieldData, index, isRightSide)
        }
      />
    );
  };

  const renderConnectionDots = (fieldData, index) => (
    <g key={`connection-dots-${fieldData.id}`}>
      {renderConnectionDot(fieldData, index, false)}
      {renderConnectionDot(fieldData, index, true)}
    </g>
  );

  return (
    <>
      <foreignObject
        key={tableData.id}
        x={tableData.x}
        y={tableData.y}
        width={tableWidth}
        height={height}
        className="group drop-shadow-lg rounded-md cursor-move"
        onPointerDown={onPointerDown}
      >
        <div
          className={`border select-none rounded-lg w-full overflow-hidden bg-white text-slate-800
              ${isSelected ? "border-blue-500 border-2 rounded-xl" : "border-slate-300"}`}
        >
          <div className="bg-slate-900 text-white px-2 py-2 rounded-t-lg flex items-center">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <DataBaseIcon className="flex-shrink-0" />
              <span
                className="text-xs font-semibold opacity-80 overflow-hidden text-ellipsis whitespace-nowrap flex-1 min-w-0"
                title={tableData.name}
              >
                {tableData.name}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <CommonButton
                leftIcon={readOnly ? <DetailsIcon /> : <EditIcon />}
                size="small"
                variant="default"
                onClick={openEditor}
                className="!p-0"
              />
              {!readOnly && (
                <CommonButton
                  leftIcon={<DeleteIcon />}
                  size="small"
                  variant="default"
                  onClick={() => deleteTable(tableData.id)}
                  className="!p-0"
                />
              )}
            </div>
          </div>
          {tableData.fields.map((e, i) => {
            return field(e, i);
          })}
        </div>
      </foreignObject>

      {tableData.fields.map((fieldData, index) =>
        renderConnectionDots(fieldData, index),
      )}
      <SideSheet
        title={readOnly ? t("details") : t("edit")}
        size="small"
        placement="left"
        visible={
          selectedElement.element === ObjectType.TABLE &&
          selectedElement.id === tableData.id &&
          selectedElement.open
        }
        onCancel={() =>
          setSelectedElement((prev) => ({
            ...prev,
            open: !prev.open,
          }))
        }
      >
        <div className="sidesheet-theme">
          <SidePanel tableData={tableData} readOnly={readOnly} />
        </div>
      </SideSheet>
    </>
  );

  function field(fieldData, index) {
    return (
      <div
        className={`${
          index === tableData.fields.length - 1
            ? ""
            : "border-b border-slate-200"
        } group h-[36px] p-2 flex justify-between items-center gap-2 w-full overflow-hidden bg-white hover:bg-slate-50`}
        onPointerEnter={(e) => {
          if (!e.isPrimary) return;

          setHoveredTable({
            tableId: tableData.id,
            fieldId: fieldData.id,
          });
        }}
        onPointerLeave={(e) => {
          if (!e.isPrimary) return;

          setHoveredTable({
            tableId: null,
            fieldId: null,
          });
        }}
        onPointerDown={(e) => {
          // Required for onPointerLeave to trigger when a touch pointer leaves
          // https://stackoverflow.com/a/70976017/1137077
          e.target.releasePointerCapture(e.pointerId);
        }}
      >
        <div className="flex items-center gap-2 flex-1 overflow-hidden">
          <div className="flex gap-2 overflow-hidden flex-1">
            <span className="text-xs font-medium text-slate-900 opacity-80 overflow-hidden text-ellipsis whitespace-nowrap flex-1 min-w-0">
              {fieldData.name}
            </span>
            <span className="text-xs text-slate-600 opacity-80 whitespace-nowrap flex-shrink-0">
              {fieldData.type +
                ((dbToTypes[database][fieldData.type].isSized ||
                  dbToTypes[database][fieldData.type].hasPrecision) &&
                fieldData.size &&
                fieldData.size !== ""
                  ? `(${fieldData.size})`
                  : "")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {fieldData.primary && <KeyIcon />}
        </div>
      </div>
    );
  }
}
