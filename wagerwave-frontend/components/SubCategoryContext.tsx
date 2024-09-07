// SubCategoryContext.tsx
import React, { createContext, useContext, useState } from "react";

const SubCategoryContext = createContext<any>(null);

export const SubCategoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");

  return (
    <SubCategoryContext.Provider
      value={{ selectedSubCategory, setSelectedSubCategory }}
    >
      {children}
    </SubCategoryContext.Provider>
  );
};

export const useSubCategory = () => useContext(SubCategoryContext);
