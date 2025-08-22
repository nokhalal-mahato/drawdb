import { useRef, useState } from "react";
import {
  Action,
  Cardinality,
  Constraint,
  ObjectType,
  gridSize,
  gridCircleRadius,
} from "../../data/constants";
import { Toast } from "@douyinfe/semi-ui";
import Table from "./Table";
import Relationship from "./Relationship";
import {
  useCanvas,
  useTransform,
  useDiagram,
  useUndoRedo,
  useSelect,
} from "../../hooks";
import { useTranslation } from "react-i18next";
import { useEventListener } from "usehooks-ts";
import { areFieldsCompatible } from "../../utils/utils";

export default function Canvas({ readOnly }) {
  const { t } = useTranslation();

  const canvasRef = useRef(null);
  const canvasContextValue = useCanvas();
  const {
    canvas: { viewBox },
    pointer,
  } = canvasContextValue;

  const { tables, updateTable, relationships, addRelationship, database } =
    useDiagram();
  const { setUndoStack, setRedoStack } = useUndoRedo();
  const { transform, setTransform } = useTransform();
  const {
    selectedElement,
    setSelectedElement,
    bulkSelectedElements,
    setBulkSelectedElements,
  } = useSelect();
  const notDragging = {
    id: -1,
    type: ObjectType.NONE,
    grabOffset: { x: 0, y: 0 },
  };
  const [dragging, setDragging] = useState(notDragging);
  const [linking, setLinking] = useState(false);
  const [linkingLine, setLinkingLine] = useState({
    startTableId: -1,
    startFieldId: -1,
    endTableId: -1,
    endFieldId: -1,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });
  const [hoveredTable, setHoveredTable] = useState({
    tableId: null,
    fieldId: null,
  });
  const [panning, setPanning] = useState({
    isPanning: false,
    panStart: { x: 0, y: 0 },
    cursorStart: { x: 0, y: 0 },
  });

  // this is used to store the element that is clicked on
  // at the moment, and shouldn't be a part of the state
  let elementPointerDown = null;

  const isSameElement = (el1, el2) => {
    return el1.id === el2.id && el1.type === el2.type;
  };

  const handlePointerDownOnElement = (e, { element, type }) => {
    if (selectedElement.open) return;

    if (!e.isPrimary) return;

    if (!(e.ctrlKey || e.metaKey)) {
      setSelectedElement((prev) => ({
        ...prev,
        element: type,
        id: element.id,
        open: false,
      }));
    }

    // this is the object that will be added to the bulk selected elements
    // if necessary
    const elementInBulk = {
      id: element.id,
      type,
      currentCoords: { x: element.x, y: element.y },
      initialCoords: { x: element.x, y: element.y },
    };

    const isSelected = bulkSelectedElements.some((el) =>
      isSameElement(el, elementInBulk),
    );

    if (e.ctrlKey || e.metaKey) {
      if (isSelected) {
        if (bulkSelectedElements.length > 1) {
          setBulkSelectedElements(
            bulkSelectedElements.filter(
              (el) => !isSameElement(el, elementInBulk),
            ),
          );
          setSelectedElement({
            ...selectedElement,
            element: ObjectType.NONE,
            id: -1,
            open: false,
          });
        }
      } else {
        setBulkSelectedElements([...bulkSelectedElements, elementInBulk]);
      }
      setDragging(notDragging);
      return;
    }

    if (!isSelected) {
      setBulkSelectedElements([elementInBulk]);
    }
    setDragging({
      id: element.id,
      type,
      grabOffset: {
        x: pointer.spaces.diagram.x - element.x,
        y: pointer.spaces.diagram.y - element.y,
      },
    });
  };

  const coordinatesAfterSnappingToGrid = ({ x, y }) => {
    return { x, y };
  };

  /**
   * @param {PointerEvent} e
   */
  const handlePointerMove = (e) => {
    if (selectedElement.open) return;

    if (!e.isPrimary) return;

    if (panning.isPanning) {
      setTransform((prev) => ({
        ...prev,
        pan: {
          x:
            panning.panStart.x +
            (panning.cursorStart.x - pointer.spaces.screen.x) / transform.zoom,
          y:
            panning.panStart.y +
            (panning.cursorStart.y - pointer.spaces.screen.y) / transform.zoom,
        },
      }));
      return;
    }

    if (linking) {
      setLinkingLine({
        ...linkingLine,
        endX: pointer.spaces.diagram.x,
        endY: pointer.spaces.diagram.y,
      });
      return;
    }

    if (isDragging()) {
      const { x: mainElementFinalX, y: mainElementFinalY } =
        coordinatesAfterSnappingToGrid({
          x: pointer.spaces.diagram.x - dragging.grabOffset.x,
          y: pointer.spaces.diagram.y - dragging.grabOffset.y,
        });

      const { currentCoords } = bulkSelectedElements.find((el) =>
        isSameElement(el, dragging),
      );

      const deltaX = mainElementFinalX - currentCoords.x;
      const deltaY = mainElementFinalY - currentCoords.y;

      const newBulkSelectedElements = [];
      bulkSelectedElements.forEach((el) => {
        const elementFinalCoords = {
          x: el.currentCoords.x + deltaX,
          y: el.currentCoords.y + deltaY,
        };
        if (el.type === ObjectType.TABLE) {
          updateTable(el.id, { ...elementFinalCoords });
        }

        newBulkSelectedElements.push({
          ...el,
          currentCoords: elementFinalCoords,
        });
      });

      setBulkSelectedElements(newBulkSelectedElements);
      return;
    }
  };

  /**
   * @param {PointerEvent} e
   */
  const handlePointerDown = (e) => {
    if (!e.isPrimary) return;

    // don't pan if the sidesheet for editing a table is open
    if (selectedElement.element === ObjectType.TABLE && selectedElement.open)
      return;

    const isMouseLeftButton = e.button === 0;
    const isMouseMiddleButton = e.button === 1;

    if (isMouseLeftButton) {
      if (elementPointerDown !== null) {
        handlePointerDownOnElement(e, elementPointerDown);
      }
      pointer.setStyle("crosshair");
    } else if (isMouseMiddleButton) {
      setPanning({
        isPanning: true,
        panStart: transform.pan,
        // Diagram space depends on the current panning.
        // Use screen space to avoid circular dependencies and undefined behavior.
        cursorStart: pointer.spaces.screen,
      });
      pointer.setStyle("grabbing");
    }
  };

  const isDragging = () => {
    return dragging.type !== ObjectType.NONE && dragging.id !== -1;
  };

  const didDrag = () => {
    if (!isDragging()) return false;
    // checking any element is sufficient
    const { currentCoords, initialCoords } = bulkSelectedElements[0];
    return (
      currentCoords.x !== initialCoords.x || currentCoords.y !== initialCoords.y
    );
  };

  /**
   * @param {PointerEvent} e
   */
  const handlePointerUp = (e) => {
    if (selectedElement.open) return;

    if (!e.isPrimary) return;

    if (didDrag()) {
      setUndoStack((prev) => [
        ...prev,
        {
          action: Action.MOVE,
          bulk: true,
          message: t("bulk_update"),
          elements: bulkSelectedElements.map((el) => ({
            id: el.id,
            type: el.type,
            undo: el.initialCoords,
            redo: el.currentCoords,
          })),
        },
      ]);
      setRedoStack([]);
      setBulkSelectedElements((prev) =>
        prev.map((el) => ({
          ...el,
          initialCoords: { ...el.currentCoords },
        })),
      );
    }

    setDragging(notDragging);

    setPanning((old) => ({ ...old, isPanning: false }));
    pointer.setStyle("default");

    if (linking) handleLinking();
    setLinking(false);
  };

  const handleGripField = () => {
    setPanning((old) => ({ ...old, isPanning: false }));
    setDragging(notDragging);
    setLinking(true);
  };

  const handleLinking = () => {
    if (hoveredTable.tableId === null) return;
    if (hoveredTable.fieldId === null) return;

    const { fields: startTableFields, name: startTableName } = tables.find(
      (t) => t.id === linkingLine.startTableId,
    );
    const { type: startType, name: startFieldName } = startTableFields.find(
      (f) => f.id === linkingLine.startFieldId,
    );
    const { fields: endTableFields, name: endTableName } = tables.find(
      (t) => t.id === hoveredTable.tableId,
    );
    const { type: endType } = endTableFields.find(
      (f) => f.id === hoveredTable.fieldId,
    );

    if (!areFieldsCompatible(database, startType, endType)) {
      Toast.info(t("cannot_connect"));
      return;
    }
    if (
      linkingLine.startTableId === hoveredTable.tableId &&
      linkingLine.startFieldId === hoveredTable.fieldId
    )
      return;

    const newRelationship = {
      ...linkingLine,
      endTableId: hoveredTable.tableId,
      endFieldId: hoveredTable.fieldId,
      cardinality: Cardinality.ONE_TO_ONE,
      updateConstraint: Constraint.NONE,
      deleteConstraint: Constraint.NONE,
      name: `fk_${startTableName}_${startFieldName}_${endTableName}`,
      id: relationships.length,
    };
    delete newRelationship.startX;
    delete newRelationship.startY;
    delete newRelationship.endX;
    delete newRelationship.endY;
    addRelationship(newRelationship);
  };

  useEventListener(
    "wheel",
    (e) => {
      e.preventDefault();

      if (e.ctrlKey || e.metaKey) {
        // How "eager" the viewport is to
        // center the cursor's coordinates
        const eagernessFactor = 0.05;
        setTransform((prev) => ({
          pan: {
            x:
              prev.pan.x -
              (pointer.spaces.diagram.x - prev.pan.x) *
                eagernessFactor *
                Math.sign(e.deltaY),
            y:
              prev.pan.y -
              (pointer.spaces.diagram.y - prev.pan.y) *
                eagernessFactor *
                Math.sign(e.deltaY),
          },
          zoom: e.deltaY <= 0 ? prev.zoom * 1.05 : prev.zoom / 1.05,
        }));
      } else if (e.shiftKey) {
        setTransform((prev) => ({
          ...prev,
          pan: {
            ...prev.pan,
            x: prev.pan.x + e.deltaY / prev.zoom,
          },
        }));
      } else {
        setTransform((prev) => ({
          ...prev,
          pan: {
            x: prev.pan.x + e.deltaX / prev.zoom,
            y: prev.pan.y + e.deltaY / prev.zoom,
          },
        }));
      }
    },
    canvasRef,
    { passive: false },
  );

  return (
    <div className="grow h-full touch-none" id="canvas">
      <div
        className="w-full h-full"
        style={{
          cursor: pointer.style,
          backgroundColor: "white",
        }}
      >
        <svg
          id="diagram"
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          className="absolute w-full h-full touch-none"
          viewBox={`${viewBox.left} ${viewBox.top} ${viewBox.width} ${viewBox.height}`}
        >
          {
            <>
              <defs>
                <pattern
                  id="pattern-grid"
                  x={-gridCircleRadius}
                  y={-gridCircleRadius}
                  width={gridSize}
                  height={gridSize}
                  patternUnits="userSpaceOnUse"
                  patternContentUnits="userSpaceOnUse"
                >
                  <circle
                    cx={gridCircleRadius}
                    cy={gridCircleRadius}
                    r={gridCircleRadius}
                    fill="rgb(99, 152, 191)"
                    opacity="1"
                  />
                </pattern>
              </defs>
              <rect
                x={viewBox.left}
                y={viewBox.top}
                width={viewBox.width}
                height={viewBox.height}
                fill="url(#pattern-grid)"
              />
            </>
          }

          {relationships.map((e, i) => (
            <Relationship key={i} data={e} />
          ))}

          {tables.map((table) => (
            <Table
              key={table.id}
              tableData={table}
              setHoveredTable={setHoveredTable}
              handleGripField={handleGripField}
              setLinkingLine={setLinkingLine}
              readOnly={readOnly}
              onPointerDown={() => {
                elementPointerDown = {
                  element: table,
                  type: ObjectType.TABLE,
                };
              }}
            />
          ))}

          {linking && (
            <path
              d={`M ${linkingLine.startX} ${linkingLine.startY} L ${linkingLine.endX} ${linkingLine.endY}`}
              stroke="red"
              strokeDasharray="8,8"
              className="pointer-events-none touch-none"
            />
          )}
        </svg>
      </div>
    </div>
  );
}
