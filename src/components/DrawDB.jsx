import React from 'react';
import LayoutContextProvider from "../context/LayoutContext";
import TransformContextProvider from "../context/TransformContext";
import TablesContextProvider from "../context/DiagramContext";
import UndoRedoContextProvider from "../context/UndoRedoContext";
import SelectContextProvider from "../context/SelectContext";
import AreasContextProvider from "../context/AreasContext";
import NotesContextProvider from "../context/NotesContext";
import TypesContextProvider from "../context/TypesContext";
import TasksContextProvider from "../context/TasksContext";
import SaveStateContextProvider from "../context/SaveStateContext";
import EnumsContextProvider from "../context/EnumsContext";
import WorkSpace from "./Workspace";
import { useThemedPage } from "../hooks";

/**
 * DrawDB Component - A React component for database diagram creation and management
 * 
 * @param {Object} props - Component props
 * @param {string} [props.initialData] - Initial diagram data in DBML format
 * @param {string} [props.database] - Default database type (mysql, postgres, etc.)
 * @param {Function} [props.onSave] - Callback function when diagram is saved
 * @param {Function} [props.onExport] - Callback function when diagram is exported
 * @param {Function} [props.onTableChange] - Callback function when tables change
 * @param {Function} [props.onRelationshipChange] - Callback function when relationships change
 * @param {boolean} [props.readOnly] - Whether the diagram is read-only
 * @param {string} [props.theme] - Theme preference ('light' or 'dark')
 * @param {string} [props.language] - Language preference for internationalization
 * @param {Object} [props.customSettings] - Custom settings object
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.style] - Additional inline styles
 */
const DrawDB = ({
  initialData,
  database = 'mysql',
  onSave,
  onExport,
  onTableChange,
  onRelationshipChange,
  readOnly = false,
  theme = 'light',
  language = 'en',
  customSettings = {},
  className = '',
  style = {},
  ...otherProps
}) => {
  useThemedPage();

  // Pass props to Workspace component
  const workspaceProps = {
    initialData,
    database,
    onSave,
    onExport,
    onTableChange,
    onRelationshipChange,
    readOnly,
    theme,
    language,
    customSettings,
    ...otherProps
  };

  return (
    <div className={`drawdb-container ${className}`} style={style}>
      <LayoutContextProvider>
        <TransformContextProvider>
          <UndoRedoContextProvider>
            <SelectContextProvider>
              <TasksContextProvider>
                <AreasContextProvider>
                  <NotesContextProvider>
                    <TypesContextProvider>
                      <EnumsContextProvider>
                        <TablesContextProvider>
                          <SaveStateContextProvider>
                            <WorkSpace {...workspaceProps} />
                          </SaveStateContextProvider>
                        </TablesContextProvider>
                      </EnumsContextProvider>
                    </TypesContextProvider>
                  </NotesContextProvider>
                </AreasContextProvider>
              </TasksContextProvider>
            </SelectContextProvider>
          </UndoRedoContextProvider>
        </TransformContextProvider>
      </LayoutContextProvider>
    </div>
  );
};

export default DrawDB;
