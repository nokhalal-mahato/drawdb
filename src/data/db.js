import Dexie from "dexie";

export const db = new Dexie("drawDB");

db.version(6).stores({
  diagrams: "++id, lastModified, loadedFromGistId",
  templates: "++id, custom",
});
