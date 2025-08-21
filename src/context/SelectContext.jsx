import { createContext, useState } from "react";
import { ObjectType, Tab } from "../data/constants";

export const SelectContext = createContext(null);

export default function SelectContextProvider({ children }) {
  const [selectedElement, setSelectedElement] = useState({
    element: ObjectType.NONE,
    id: -1,
    currentTab: Tab.TABLES,
    open: false,
  });
  const [bulkSelectedElements, setBulkSelectedElements] = useState([]);

  return (
    <SelectContext.Provider
      value={{
        selectedElement,
        setSelectedElement,
        bulkSelectedElements,
        setBulkSelectedElements,
      }}
    >
      {children}
    </SelectContext.Provider>
  );
}
