export const tableHeaderHeight = 36;
export const tableWidth = 220;
export const gridSize = 24;
export const gridCircleRadius = 0.85;
export const tableFieldHeight = 36;
export const tableColorStripHeight = 7;
export const tableFieldCenterOffset = 20;
export const tableDotRadius = 3.5;
export const tableDotOffset = 8;

export const Cardinality = {
  ONE_TO_ONE: "one_to_one",
  ONE_TO_MANY: "one_to_many",
  MANY_TO_ONE: "many_to_one",
};

export const Constraint = {
  NONE: "No action",
  RESTRICT: "Restrict",
  CASCADE: "Cascade",
  SET_NULL: "Set null",
  SET_DEFAULT: "Set default",
};

export const Tab = {
  TABLES: "1",
  RELATIONSHIPS: "2",
};

export const WorkspaceTab = {
  PLAYGROUND: "playground",
  CODE: "code",
};

export const ObjectType = {
  NONE: 0,
  TABLE: 1,
  RELATIONSHIP: 4,
};

export const Action = {
  ADD: 0,
  MOVE: 1,
  DELETE: 2,
  EDIT: 3,
};

export const State = {
  NONE: 0,
  SAVING: 1,
  SAVED: 2,
  LOADING: 3,
  ERROR: 4,
  FAILED_TO_LOAD: 5,
};

export const DB = {
  SQLITE: "sqlite",
};
