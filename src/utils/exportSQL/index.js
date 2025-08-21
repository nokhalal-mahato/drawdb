import { toSqlite } from "./sqlite";

export function exportSQL(diagram) {
  return toSqlite(diagram);
}
