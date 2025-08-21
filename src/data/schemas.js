export const tableSchema = {
  type: "object",
  properties: {
    id: { type: ["integer", "string"] },
    name: { type: "string" },
    x: { type: "number" },
    y: { type: "number" },
    fields: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: ["integer", "string"] },
          name: { type: "string" },
          type: { type: "string" },
          default: { type: "string" },
          check: { type: "string" },
          primary: { type: "boolean" },
          unique: { type: "boolean" },
          notNull: { type: "boolean" },
          increment: { type: "boolean" },
          size: { type: ["string", "number"] },
          values: { type: "array", items: { type: "string" } },
        },
        required: [
          "id",
          "name",
          "type",
          "default",
          "check",
          "primary",
          "unique",
          "notNull",
          "increment",
        ],
      },
    },
    indices: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          unique: { type: "boolean" },
          fields: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["name", "unique", "fields"],
      },
    },
  },
  inherits: {
    type: "array",
    items: { type: ["string"] },
  },
  required: ["id", "name", "x", "y", "fields", "indices"],
};

export const jsonSchema = {
  type: "object",
  properties: {
    tables: {
      type: "array",
      items: { ...tableSchema },
    },
    relationships: {
      type: "array",
      items: {
        type: "object",
        properties: {
          startTableId: { type: ["integer", "string"] },
          startFieldId: { type: ["integer", "string"] },
          endTableId: { type: ["integer", "string"] },
          endFieldId: { type: ["integer", "string"] },
          name: { type: "string" },
          cardinality: { type: "string" },
          updateConstraint: { type: "string" },
          deleteConstraint: { type: "string" },
          id: { type: "integer" },
        },
        required: [
          "startTableId",
          "startFieldId",
          "endTableId",
          "endFieldId",
          "name",
          "cardinality",
          "updateConstraint",
          "deleteConstraint",
          "id",
        ],
      },
    },
    title: { type: "string" },
    database: { type: "string" },
  },
  required: ["tables", "relationships"],
};
