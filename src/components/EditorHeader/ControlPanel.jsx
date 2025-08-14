import { useState } from "react";
import {
  IconCaretdown,
  IconChevronRight,
  IconChevronLeft,
  IconSaveStroked,
  IconUndo,
  IconRedo,
} from "@douyinfe/semi-icons";
import {
  Divider,
  Dropdown,
  InputNumber,
  Tooltip,
  Tag,
  Popconfirm,
} from "@douyinfe/semi-ui";

import {
  ObjectType,
  Action,
  State,
  MODAL,
  DB,
  IMPORT_FROM,
} from "../../data/constants";
import { useHotkeys } from "react-hotkeys-hook";

import {
  useSettings,
  useTransform,
  useDiagram,
  useUndoRedo,
  useSaveState,
  useTypes,
  useEnums,
} from "../../hooks";
import { IconAddTable } from "../../icons";
import Modal from "./Modal/Modal";
import { useTranslation } from "react-i18next";
import { exportSQL } from "../../utils/exportSQL";
import { databases } from "../../data/databases";
import { isRtl } from "../../i18n/utils/rtl";
import { nanoid } from "nanoid";
import { getTableHeight } from "../../utils/utils";

export default function ControlPanel({ setDiagramId, title, setTitle }) {
  const [modal, setModal] = useState(MODAL.NONE);
  const [exportData, setExportData] = useState({
    data: null,
    filename: `${title}_${new Date().toISOString()}`,
    extension: "",
  });
  const [importFrom] = useState(IMPORT_FROM.JSON);
  const { setSaveState } = useSaveState();
  const { settings } = useSettings();
  const {
    relationships,
    tables,
    addTable,
    updateTable,
    deleteField,
    deleteTable,
    updateField,
    setRelationships,
    addRelationship,
    deleteRelationship,
    updateRelationship,
    database,
  } = useDiagram();
  const { enums, deleteEnum, addEnum, updateEnum } = useEnums();
  const { types, addType, deleteType, updateType, setTypes } = useTypes();
  const { undoStack, redoStack, setUndoStack, setRedoStack } = useUndoRedo();
  const { transform, setTransform } = useTransform();
  const { t, i18n } = useTranslation();

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
      } else if (a.element === ObjectType.TYPE) {
        deleteType(types.length - 1, false);
      } else if (a.element === ObjectType.ENUM) {
        deleteEnum(enums.length - 1, false);
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
        addTable(a.data.table, false);
      } else if (a.element === ObjectType.RELATIONSHIP) {
        addRelationship(a.data, false);
      } else if (a.element === ObjectType.TYPE) {
        addType({ id: a.id, ...a.data }, false);
      } else if (a.element === ObjectType.ENUM) {
        addEnum({ id: a.id, ...a.data }, false);
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
      } else if (a.element === ObjectType.TYPE) {
        if (a.component === "field_add") {
          updateType(a.tid, {
            fields: types[a.tid].fields.filter(
              (_, i) => i !== types[a.tid].fields.length - 1,
            ),
          });
        }
        if (a.component === "field") {
          updateType(a.tid, {
            fields: types[a.tid].fields.map((e, i) =>
              i === a.fid ? { ...e, ...a.undo } : e,
            ),
          });
        } else if (a.component === "field_delete") {
          setTypes((prev) =>
            prev.map((t, i) => {
              if (i === a.tid) {
                const temp = t.fields.slice();
                temp.splice(a.fid, 0, a.data);
                return { ...t, fields: temp };
              }
              return t;
            }),
          );
        } else if (a.component === "self") {
          updateType(a.tid, a.undo);
          if (a.updatedFields) {
            if (a.undo.name) {
              a.updatedFields.forEach((x) =>
                updateField(x.tid, x.fid, { type: a.undo.name.toUpperCase() }),
              );
            }
          }
        }
      } else if (a.element === ObjectType.ENUM) {
        updateEnum(a.id, a.undo);
        if (a.updatedFields) {
          if (a.undo.name) {
            a.updatedFields.forEach((x) =>
              updateField(x.tid, x.fid, { type: a.undo.name.toUpperCase() }),
            );
          }
        }
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
        addTable(null, false);
      } else if (a.element === ObjectType.RELATIONSHIP) {
        addRelationship(a.data, false);
      } else if (a.element === ObjectType.TYPE) {
        addType(null, false);
      } else if (a.element === ObjectType.ENUM) {
        addEnum(null, false);
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
      } else if (a.element === ObjectType.TYPE) {
        deleteType(a.id, false);
      } else if (a.element === ObjectType.ENUM) {
        deleteEnum(a.id, false);
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
      } else if (a.element === ObjectType.TYPE) {
        if (a.component === "field_add") {
          updateType(a.tid, {
            fields: [
              ...types[a.tid].fields,
              {
                name: "",
                type: "",
              },
            ],
          });
        } else if (a.component === "field") {
          updateType(a.tid, {
            fields: types[a.tid].fields.map((e, i) =>
              i === a.fid ? { ...e, ...a.redo } : e,
            ),
          });
        } else if (a.component === "field_delete") {
          updateType(a.tid, {
            fields: types[a.tid].fields.filter((field, i) => i !== a.fid),
          });
        } else if (a.component === "self") {
          updateType(a.tid, a.redo);
          if (a.updatedFields) {
            if (a.redo.name) {
              a.updatedFields.forEach((x) =>
                updateField(x.tid, x.fid, { type: a.redo.name.toUpperCase() }),
              );
            }
          }
        }
      } else if (a.element === ObjectType.ENUM) {
        updateEnum(a.id, a.redo);
        if (a.updatedFields) {
          if (a.redo.name) {
            a.updatedFields.forEach((x) =>
              updateField(x.tid, x.fid, { type: a.redo.name.toUpperCase() }),
            );
          }
        }
      }
      setUndoStack((prev) => [...prev, a]);
    }
  };

  const zoomIn = () =>
    setTransform((prev) => ({ ...prev, zoom: prev.zoom * 1.2 }));
  const zoomOut = () =>
    setTransform((prev) => ({ ...prev, zoom: prev.zoom / 1.2 }));

  const fitWindow = () => {
    const canvas = document.getElementById("canvas").getBoundingClientRect();

    const minMaxXY = {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity,
    };

    tables.forEach((table) => {
      minMaxXY.minX = Math.min(minMaxXY.minX, table.x);
      minMaxXY.minY = Math.min(minMaxXY.minY, table.y);
      minMaxXY.maxX = Math.max(minMaxXY.maxX, table.x + settings.tableWidth);
      minMaxXY.maxY = Math.max(minMaxXY.maxY, table.y + getTableHeight(table));
    });

    const padding = 10;
    const width = minMaxXY.maxX - minMaxXY.minX + padding;
    const height = minMaxXY.maxY - minMaxXY.minY + padding;

    const scaleX = canvas.width / width;
    const scaleY = canvas.height / height;
    // Making sure the scale is a multiple of 0.05
    const scale = Math.floor(Math.min(scaleX, scaleY) * 20) / 20;

    const centerX = (minMaxXY.minX + minMaxXY.maxX) / 2;
    const centerY = (minMaxXY.minY + minMaxXY.maxY) / 2;

    setTransform((prev) => ({
      ...prev,
      zoom: scale,
      pan: { x: centerX, y: centerY },
    }));
  };

  const save = () => setSaveState(State.SAVING);

  const menu = {
    file: {
      export_source: {
        function: () => {
          if (database === DB.GENERIC) return;
          setModal(MODAL.CODE);
          const src = exportSQL({
            tables: tables,
            references: relationships,
            types: types,
            database: database,
            enums: enums,
          });
          setExportData((prev) => ({
            ...prev,
            data: src,
            extension: "sql",
          }));
        },
      },
      export_as: {
        children: [
          {
            name: "JSON",
            function: () => {
              setModal(MODAL.CODE);
              const result = JSON.stringify(
                {
                  tables: tables,
                  relationships: relationships,
                  database: database,
                  ...(databases[database].hasTypes && { types: types }),
                  ...(databases[database].hasEnums && { enums: enums }),
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
            },
          },
        ],
        function: () => {},
      },
    },
  };

  useHotkeys("mod+z", undo, { preventDefault: true });
  useHotkeys("mod+y", redo, { preventDefault: true });
  useHotkeys("mod+up", zoomIn, { preventDefault: true });
  useHotkeys("mod+down", zoomOut, { preventDefault: true });

  useHotkeys("mod+alt+w", fitWindow, { preventDefault: true });

  return (
    <>
      <div>
        {
          <div
            className="flex justify-between items-center me-7"
            style={isRtl(i18n.language) ? { direction: "rtl" } : {}}
          >
            {header()}
          </div>
        }
        {toolbar()}
      </div>
      <Modal
        modal={modal}
        exportData={exportData}
        setExportData={setExportData}
        title={title}
        setTitle={setTitle}
        setDiagramId={setDiagramId}
        setModal={setModal}
        importFrom={importFrom}
        importDb={""}
      />
    </>
  );

  function toolbar() {
    return (
      <div
        className="py-1.5 px-5 flex justify-between items-center rounded-xl my-1 sm:mx-1 xl:mx-6 select-none overflow-hidden toolbar-theme"
        style={isRtl(i18n.language) ? { direction: "rtl" } : {}}
      >
        <div className="flex justify-start items-center">
          <Dropdown
            style={{ width: "240px" }}
            position={isRtl(i18n.language) ? "bottomRight" : "bottomLeft"}
            render={
              <Dropdown.Menu
                style={isRtl(i18n.language) ? { direction: "rtl" } : {}}
              >
                <Dropdown.Item
                  onClick={fitWindow}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>{t("fit_window_reset")}</div>
                  <div className="text-gray-400">Ctrl+Alt+W</div>
                </Dropdown.Item>
                <Dropdown.Divider />
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
                <Dropdown.Divider />
                <Dropdown.Item>
                  <InputNumber
                    field="zoom"
                    label={t("zoom")}
                    placeholder={t("zoom")}
                    suffix={<div className="p-1">%</div>}
                    onChange={(v) =>
                      setTransform((prev) => ({
                        ...prev,
                        zoom: parseFloat(v) * 0.01,
                      }))
                    }
                  />
                </Dropdown.Item>
              </Dropdown.Menu>
            }
            trigger="click"
          >
            <div className="py-1 px-2 hover-2 rounded-sm flex items-center justify-center">
              <div className="w-[40px]">
                {Math.floor(transform.zoom * 100)}%
              </div>
              <div>
                <IconCaretdown />
              </div>
            </div>
          </Dropdown>
          <Divider layout="vertical" margin="8px" />
          <Tooltip content={t("undo")} position="bottom">
            <button
              className="py-1 px-2 hover-2 rounded-sm flex items-center"
              onClick={undo}
            >
              <IconUndo
                size="large"
                style={{ color: undoStack.length === 0 ? "#9598a6" : "" }}
              />
            </button>
          </Tooltip>
          <Tooltip content={t("redo")} position="bottom">
            <button
              className="py-1 px-2 hover-2 rounded-sm flex items-center"
              onClick={redo}
            >
              <IconRedo
                size="large"
                style={{ color: redoStack.length === 0 ? "#9598a6" : "" }}
              />
            </button>
          </Tooltip>
          <Divider layout="vertical" margin="8px" />
          <Tooltip content={t("add_table")} position="bottom">
            <button
              className="flex items-center py-1 px-2 hover-2 rounded-sm"
              onClick={() => addTable()}
            >
              <IconAddTable />
            </button>
          </Tooltip>
          <Divider layout="vertical" margin="8px" />
          <Tooltip content={t("save")} position="bottom">
            <button
              className="py-1 px-2 hover-2 rounded-sm flex items-center"
              onClick={save}
            >
              <IconSaveStroked size="extra-large" />
            </button>
          </Tooltip>
        </div>
      </div>
    );
  }

  function header() {
    return (
      <nav
        className="flex justify-between pt-1 items-center whitespace-nowrap"
        style={isRtl(i18n.language) ? { direction: "rtl" } : {}}
      >
        <div className="flex justify-start items-center">
          <div className="ms-1 mt-1">
            <div className="flex justify-between items-center">
              <div className="flex justify-start text-md select-none me-2">
                {Object.keys(menu).map((category) => (
                  <Dropdown
                    key={category}
                    position="bottomLeft"
                    style={{
                      width: "240px",
                      direction: isRtl(i18n.language) ? "rtl" : "ltr",
                    }}
                    render={
                      <Dropdown.Menu className="menu max-h-[calc(100vh-80px)] overflow-auto">
                        {Object.keys(menu[category]).map((item, index) => {
                          if (menu[category][item].children) {
                            return (
                              <Dropdown
                                style={{ width: "150px" }}
                                key={item}
                                position="rightTop"
                                render={
                                  <Dropdown.Menu>
                                    {menu[category][item].children.map(
                                      (e, i) => (
                                        <Dropdown.Item
                                          key={i}
                                          onClick={e.function}
                                          className="flex justify-between"
                                        >
                                          <span>{e.name}</span>
                                          {e.label && (
                                            <Tag
                                              size="small"
                                              color="light-blue"
                                            >
                                              {e.label}
                                            </Tag>
                                          )}
                                        </Dropdown.Item>
                                      ),
                                    )}
                                  </Dropdown.Menu>
                                }
                              >
                                <Dropdown.Item
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                  onClick={menu[category][item].function}
                                >
                                  {t(item)}

                                  {isRtl(i18n.language) ? (
                                    <IconChevronLeft />
                                  ) : (
                                    <IconChevronRight />
                                  )}
                                </Dropdown.Item>
                              </Dropdown>
                            );
                          }
                          if (menu[category][item].warning) {
                            return (
                              <Popconfirm
                                key={index}
                                title={menu[category][item].warning.title}
                                content={menu[category][item].warning.message}
                                onConfirm={menu[category][item].function}
                                position="right"
                                okText={t("confirm")}
                                cancelText={t("cancel")}
                              >
                                <Dropdown.Item>{t(item)}</Dropdown.Item>
                              </Popconfirm>
                            );
                          }
                          return (
                            <Dropdown.Item
                              key={index}
                              onClick={menu[category][item].function}
                              style={
                                menu[category][item].shortcut && {
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }
                              }
                            >
                              <div className="w-full flex items-center justify-between">
                                <div>{t(item)}</div>
                                <div className="flex items-center gap-1">
                                  {menu[category][item].shortcut && (
                                    <div className="text-gray-400">
                                      {menu[category][item].shortcut}
                                    </div>
                                  )}
                                  {menu[category][item].state &&
                                    menu[category][item].state}
                                </div>
                              </div>
                            </Dropdown.Item>
                          );
                        })}
                      </Dropdown.Menu>
                    }
                  >
                    <div className="px-3 py-1 hover-2 rounded-sm">
                      {t(category)}
                    </div>
                  </Dropdown>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
