<div align="center">
  <sup>Special thanks to:</sup>
  <br>
  <a href="https://www.warp.dev/drawdb/" target="_blank">
    <img alt="Warp sponsorship" width="280" src="https://github.com/user-attachments/assets/c7f141e7-9751-407d-bb0e-d6f2c487b34f">
    <br>
    <b>Next-gen AI-powered intelligent terminal for all platforms</b>
  </a>
</div>

<br/>
<br/>

<div align="center">
    <img width="64" alt="drawdb logo" src="./src/assets/icon-dark.png">
    <h1>drawDB</h1>
</div>

<h3 align="center">Free, simple, and intuitive database schema editor and SQL generator.</h3>

<div align="center" style="margin-bottom:12px;">
    <a href="https://drawdb.app/" style="display: flex; align-items: center;">
        <img src="https://img.shields.io/badge/Start%20building-grey" alt="drawDB"/>
    </a>
    <a href="https://discord.gg/BrjZgNrmR6" style="display: flex; align-items: center;">
        <img src="https://img.shields.io/discord/1196658537208758412.svg?label=Join%20the%20Discord&logo=discord" alt="Discord"/>
    </a>
    <a href="https://x.com/drawDB_" style="display: flex; align-items: center;">
        <img src="https://img.shields.io/badge/Follow%20us%20on%20X-blue?logo=X" alt="Follow us on X"/>
    </a>
</div>

<h3 align="center"><img width="700" style="border-radius:5px;" alt="demo" src="drawdb.png"></h3>

DrawDB is a robust and user-friendly database entity relationship (DBER) editor right in your browser. Build diagrams with a few clicks, export sql scripts, customize your editor, and more without creating an account. See the full set of features [here](https://drawdb.app/).

## Getting Started

### Local Development

```bash
git clone https://github.com/drawdb-io/drawdb
cd drawdb
npm install
npm run dev
```

### Build

```bash
git clone https://github.com/drawdb-io/drawdb
cd drawdb
npm install
npm run build
```

### Docker Build

```bash
docker build -t drawdb .
docker run -p 3000:80 drawdb
```

If you wish to work with sharing, set up [server](https://github.com/drawdb-io/drawdb-server) and environment variables according to `.env.sample`. This is not required unless you want to share files.

# DrawDB - React Database Diagram Component

A powerful React component for creating, editing, and managing database diagrams with support for multiple database types, DBML export/import, and SQL generation.

## Features

- 🎨 **Visual Database Design**: Create and edit database diagrams with an intuitive drag-and-drop interface
- 🗄️ **Multiple Database Support**: MySQL, PostgreSQL, SQLite, SQL Server, Oracle, MariaDB, and more
- 📊 **DBML Integration**: Import/export DBML (Database Markup Language) files
- 🔄 **SQL Generation**: Generate SQL scripts for various database engines
- 🌍 **Internationalization**: Support for 40+ languages
- 🎨 **Customizable Themes**: Light and dark theme support
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔌 **Event Callbacks**: Listen to diagram changes, saves, and exports
- 📦 **Zero Dependencies**: No external database connections required

## Installation

### From GitHub Packages

```bash
npm install @nokhalal-mahato/drawdb
```

### From NPM (if published publicly)

```bash
npm install drawdb
```

## Basic Usage

```jsx
import React from 'react';
import { DrawDB } from '@nokhalal-mahato/drawdb';

function App() {
  const handleSave = (diagramData) => {
    console.log('Diagram saved:', diagramData);
  };

  const handleExport = (exportData, format) => {
    console.log('Exported as:', format, exportData);
  };

  return (
    <div className="App">
      <h1>My Database Designer</h1>
      <DrawDB
        initialData=""
        database="mysql"
        onSave={handleSave}
        onExport={handleExport}
        theme="light"
        language="en"
      />
    </div>
  );
}

export default App;
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialData` | `string` | `""` | Initial diagram data in DBML format |
| `database` | `string` | `"mysql"` | Default database type |
| `onSave` | `function` | `undefined` | Callback when diagram is saved |
| `onExport` | `function` | `undefined` | Callback when diagram is exported |
| `onTableChange` | `function` | `undefined` | Callback when tables change |
| `onRelationshipChange` | `function` | `undefined` | Callback when relationships change |
| `readOnly` | `boolean` | `false` | Whether the diagram is read-only |
| `theme` | `string` | `"light"` | Theme preference (`"light"` or `"dark"`) |
| `language` | `string` | `"en"` | Language preference |
| `customSettings` | `object` | `{}` | Custom settings object |
| `className` | `string` | `""` | Additional CSS classes |
| `style` | `object` | `{}` | Additional inline styles |

## Advanced Usage

### Custom Event Handlers

```jsx
<DrawDB
  onTableChange={(tables) => {
    console.log('Tables updated:', tables);
    // Sync with your backend
  }}
  onRelationshipChange={(relationships) => {
    console.log('Relationships updated:', relationships);
    // Update your database schema
  }}
  onSave={(diagramData) => {
    // Save to your backend
    fetch('/api/diagrams', {
      method: 'POST',
      body: JSON.stringify(diagramData)
    });
  }}
/>
```

### Read-Only Mode

```jsx
<DrawDB
  readOnly={true}
  initialData={`
    Table users {
      id int [pk]
      name varchar
      email varchar
    }
  `}
/>
```

### Custom Database Type

```jsx
<DrawDB
  database="postgres"
  customSettings={{
    showEnums: true,
    showTypes: true,
    defaultCollation: 'utf8mb4_unicode_ci'
  }}
/>
```

## Supported Database Types

- **MySQL** - Full support with all features
- **PostgreSQL** - Full support with enums and custom types
- **SQLite** - Basic support
- **SQL Server** - Full support
- **Oracle** - Full support
- **MariaDB** - Full support

## Export Formats

- **DBML** - Database Markup Language
- **SQL** - Database-specific SQL scripts
- **Mermaid** - Mermaid diagram syntax
- **Documentation** - Markdown documentation
- **Image** - PNG/SVG exports

## Styling

The component includes its own CSS, but you can customize it:

```css
.drawdb-container {
  /* Your custom styles */
  border: 1px solid #ccc;
  border-radius: 8px;
}

.drawdb-container .canvas {
  /* Override canvas styles */
}
```

## Context Providers

For advanced usage, you can access individual context providers:

```jsx
import {
  DrawDB,
  TablesContextProvider,
  AreasContextProvider,
  useDiagram
} from '@nokhalal-mahato/drawdb';

function CustomComponent() {
  const { tables, setTables } = useDiagram();
  
  return (
    <div>
      <p>Total tables: {tables.length}</p>
      {/* Your custom UI */}
    </div>
  );
}
```

## Hooks

The package exports several custom hooks:

```jsx
import {
  useDiagram,
  useAreas,
  useNotes,
  useTypes,
  useEnums,
  useLayout,
  useSettings
} from '@nokhalal-mahato/drawdb';

function MyComponent() {
  const { tables, relationships } = useDiagram();
  const { areas } = useAreas();
  const { settings } = useSettings();
  
  // Use the data in your component
}
```

## Development

### Building the Package

```bash
# Install dependencies
npm install

# Build the library
npm run build:lib

# Build for development
npm run build
```

### Local Development

```bash
# Start development server
npm run dev

# Preview production build
npm run preview
```

## Publishing

### To GitHub Packages

1. Update the package name in `package.json` to match your GitHub username (already done)
2. Create a GitHub Personal Access Token with `write:packages` scope
3. Login to npm with your token:
   ```bash
   npm login --scope=@nokhalal-mahato --registry=https://npm.pkg.github.com
   ```
4. Publish the package:
   ```bash
   npm publish
   ```

### To NPM

1. Remove the `publishConfig` from `package.json`
2. Update the package name to remove the scope
3. Login to npm:
   ```bash
   npm login
   ```
4. Publish:
   ```bash
   npm publish
   ```

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## Support

- 📧 Create an issue on GitHub
- 📖 Check the documentation
- 💬 Join our community discussions

## Changelog

### v1.0.0
- Initial release
- Core database diagram functionality
- Multiple database support
- DBML import/export
- SQL generation
- Internationalization support
- Theme customization
