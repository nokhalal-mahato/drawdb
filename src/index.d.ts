import React from 'react';

export interface DrawDBProps {
  /** Initial diagram data in DBML format */
  initialData?: string;
  /** Default database type */
  database?: 'mysql' | 'postgres' | 'sqlite' | 'mssql' | 'oracle' | 'mariadb';
  /** Callback function when diagram is saved */
  onSave?: (diagramData: any) => void;
  /** Callback function when diagram is exported */
  onExport?: (exportData: string, format: string) => void;
  /** Callback function when tables change */
  onTableChange?: (tables: any[]) => void;
  /** Callback function when relationships change */
  onRelationshipChange?: (relationships: any[]) => void;
  /** Whether the diagram is read-only */
  readOnly?: boolean;
  /** Theme preference */
  theme?: 'light' | 'dark';
  /** Language preference for internationalization */
  language?: string;
  /** Custom settings object */
  customSettings?: Record<string, any>;
  /** Additional CSS classes */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

export declare const DrawDB: React.FC<DrawDBProps>;

// Context exports
export { default as LayoutContextProvider } from './context/LayoutContext';
export { default as TransformContextProvider } from './context/TransformContext';
export { default as TablesContextProvider } from './context/DiagramContext';
export { default as UndoRedoContextProvider } from './context/UndoRedoContext';
export { default as SelectContextProvider } from './context/SelectContext';
export { default as AreasContextProvider } from './context/AreasContext';
export { default as NotesContextProvider } from './context/NotesContext';
export { default as TypesContextProvider } from './context/TypesContext';
export { default as TasksContextProvider } from './context/TasksContext';
export { default as SaveStateContextProvider } from './context/SaveStateContext';
export { default as EnumsContextProvider } from './context/EnumsContext';

// Hook exports
export * from './hooks';

// Utility exports
export * from './utils/exportAs/dbml';
export * from './utils/exportAs/documentation';
export * from './utils/exportAs/mermaid';
export * from './utils/exportSQL';
export * from './utils/importFrom/dbml';
export * from './utils/importSQL';

// Data exports
export * from './data/databases';
export * from './data/datatypes';
export * from './data/constants';

// Default export
export default DrawDB;
