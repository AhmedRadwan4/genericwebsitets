"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// Define a context for the subcategory refresh
const CategoryContext = createContext({
  refresh: () => {},
});

export const useSubCategoryContext = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((prevKey) => prevKey + 1);

  return (
    <CategoryContext.Provider value={{ refresh }}>
      {children}
    </CategoryContext.Provider>
  );
};
