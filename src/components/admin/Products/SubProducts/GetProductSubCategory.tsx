// Import necessary dependencies as needed
import React, { useState, useEffect } from "react";
import { GetSubCategory } from "../../SubCategory/GetSubCategories"; // Adjust this import based on your API fetching logic
import { SubCategory } from "@prisma/client";

interface GetProductCategoryProps {
  productsubCategoryId: string;
}

const GetProductCategory: React.FC<GetProductCategoryProps> = ({
  productsubCategoryId,
}) => {
  const [subcategory, setsubCategory] = useState<SubCategory | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const subcategoryData = await GetSubCategory(productsubCategoryId); // Replace with your API fetching logic
        setsubCategory(subcategoryData);
      } catch (error) {
        console.error("Error fetching product category:", error);
        setsubCategory(null); // Handle error state as needed
      }
    };

    fetchCategory();
  }, [productsubCategoryId]);

  if (!subcategory) {
    return null;
  }

  return <span>{subcategory.name}</span>; // Render the category name or other data as needed
};

export default GetProductCategory;
