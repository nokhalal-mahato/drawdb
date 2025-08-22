import { forwardRef } from "react";
import Editor from "./components/Editor/Editor";
import "./i18n/i18n.js";

/**
 * FederatedEditor - A wrapper component for the Editor that can be consumed via Module Federation
 *
 * Props:
 * @param {Object} data - The diagram data containing tables, relationships, and title
 *   Structure: {
 *     tables: Array of table objects with fields, indices, positions, etc.
 *     relationships: Array of relationship objects between tables
 *     title: String - The diagram title (optional, defaults to "Untitled Diagram")
 *   }
 *
 * @param {Function} onSave - Callback function called when the diagram is saved
 *   Parameters: (data) => void
 *   The data parameter contains the complete diagram state as a JSON string
 *
 * @param {boolean} readOnly - Optional. Whether the editor is in read-only mode (default: false)
 * @param {boolean} shouldShowExport - Optional. Whether to show export functionality (default: false)
 *
 * Ref Methods:
 * @method getSqlCode() - Returns the current SQL code generated from the diagram
 *
 *
 * Advanced Example with Ref (Access SQL Code):
 * ```jsx
 * import { useRef } from 'react';
 * import DrawDbEditor from 'drawdb-host/Editor';
 *
 * const MyAdvancedApp = () => {
 *   const editorRef = useRef(null);
 *
 *   const diagramData = {
 *     tables: [
 *       {
 *         name: "users",
 *         fields: [
 *           { id: "1", name: "id", type: "INT", primary: true, notNull: true },
 *           { id: "2", name: "name", type: "VARCHAR", size: "255" },
 *           { id: "3", name: "email", type: "VARCHAR", unique: true }
 *         ],
 *         id: "table_1",
 *         x: 100,
 *         y: 100
 *       },
 *       {
 *         name: "posts",
 *         fields: [
 *           { id: "4", name: "id", type: "INT", primary: true, notNull: true },
 *           { id: "5", name: "user_id", type: "INT" },
 *           { id: "6", name: "title", type: "VARCHAR", size: "255" },
 *           { id: "7", name: "content", type: "TEXT" }
 *         ],
 *         id: "table_2",
 *         x: 400,
 *         y: 100
 *       }
 *     ],
 *     relationships: [
 *       {
 *         id: "rel_1",
 *         startTableId: "table_2",
 *         endTableId: "table_1",
 *         startFieldId: "5",
 *         endFieldId: "1",
 *         cardinality: "Many to One"
 *       }
 *     ],
 *     title: "Blog Database Schema"
 *   };
 *
 *   const handleSave = (savedData) => {
 *     console.log('Diagram saved:', savedData);
 *   };
 *
 *   const handleExportSQL = () => {
 *     if (editorRef.current) {
 *       const sqlCode = editorRef.current.getSqlCode();
 *       console.log('Generated SQL:', sqlCode);
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
 *         <button onClick={handleExportSQL}>
 *           Export SQL to Clipboard
 *         </button>
 *         <button onClick={handleValidateSchema} style={{ marginLeft: '10px' }}>
 *           Validate Schema
 *         </button>
 *       </div>
 *
 *       <DrawDbEditor
 *         ref={editorRef}
 *         data={diagramData}
 *         onSave={handleSave}
 *         shouldShowExport={true}
 *       />
 *     </div>
 *   );
 * };
 * ```
 */
const DrawDbEditor = forwardRef(function DrawDbEditor(
  { data, onSave, readOnly = false, shouldShowExport = false },
  ref,
) {
  return (
    <Editor
      ref={ref}
      data={data}
      onSave={onSave}
      readOnly={readOnly}
      shouldShowExport={shouldShowExport}
    />
  );
});

export default DrawDbEditor;
