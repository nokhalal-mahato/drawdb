import { dbToTypes } from "../data/datatypes";

import {
  tableFieldHeight,
  tableHeaderHeight,
  tableColorStripHeight,
} from "../data/constants";

export function strHasQuotes(str) {
  if (str.length < 2) return false;

  return (
    (str[0] === str[str.length - 1] && str[0] === "'") ||
    (str[0] === str[str.length - 1] && str[0] === '"') ||
    (str[0] === str[str.length - 1] && str[0] === "`")
  );
}

const keywords = ["CURRENT_TIMESTAMP", "NULL"];

export function isKeyword(str) {
  return keywords.includes(str.toUpperCase());
}

export function isFunction(str) {
  return /\w+\([^)]*\)$/.test(str);
}

export function areFieldsCompatible(db, field1Type, field2Type) {
  const same = field1Type === field2Type;
  const isCompatible =
    dbToTypes[db][field1Type].compatibleWith &&
    dbToTypes[db][field1Type].compatibleWith.includes(field2Type);
  return same || isCompatible;
}

export function getTableHeight(table) {
  return (
    table.fields.length * tableFieldHeight +
    tableHeaderHeight +
    tableColorStripHeight
  );
}
