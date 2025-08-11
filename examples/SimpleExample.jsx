import React, { useState } from 'react';
import { DrawDB } from '@nokhalal-mahato/drawdb';

const SimpleExample = () => {
  const [diagramData, setDiagramData] = useState('');
  const [exportedData, setExportedData] = useState('');

  const handleSave = (data) => {
    console.log('Diagram saved:', data);
    setDiagramData(JSON.stringify(data, null, 2));
  };

  const handleExport = (data, format) => {
    console.log('Exported as:', format, data);
    setExportedData(`${format.toUpperCase()}:\n${data}`);
  };

  const handleTableChange = (tables) => {
    console.log('Tables changed:', tables);
  };

  const handleRelationshipChange = (relationships) => {
    console.log('Relationships changed:', relationships);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>DrawDB Component Example</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Database Designer</h2>
        <DrawDB
          initialData=""
          database="mysql"
          onSave={handleSave}
          onExport={handleExport}
          onTableChange={handleTableChange}
          onRelationshipChange={handleRelationshipChange}
          theme="light"
          language="en"
          style={{ height: '600px', border: '1px solid #ccc' }}
        />
      </div>

      {diagramData && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Saved Diagram Data:</h3>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '200px'
          }}>
            {diagramData}
          </pre>
        </div>
      )}

      {exportedData && (
        <div>
          <h3>Exported Data:</h3>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '200px'
          }}>
            {exportedData}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SimpleExample;
