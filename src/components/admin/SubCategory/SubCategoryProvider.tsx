"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// Define a context for the subcategory refresh
const SubCategoryContext = createContext({
  refresh: () => {},
});

export const useSubCategoryContext = () => useContext(SubCategoryContext);

export const SubCategoryProvider = ({ children }: { children: ReactNode }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((prevKey) => prevKey + 1);

  return (
    <SubCategoryContext.Provider value={{ refresh }}>
      {children}
    </SubCategoryContext.Provider>
  );
};
