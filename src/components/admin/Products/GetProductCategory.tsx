// Import necessary dependencies as needed
import React, { useState, useEffect } from "react";
import { GetCategory } from "../Cateogry/GetCategories"; // Adjust this import based on your API fetching logic
import { Category } from "@prisma/client";

interface GetProductCategoryProps {
  productCategoryId: string;
}

const GetProductCategory: React.FC<GetProductCategoryProps> = ({
  productCategoryId,
}) => {
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoryData = await GetCategory(productCategoryId);
        setCategory(categoryData);
      } catch (error) {
        console.error("Error fetching product category:", error);
        setCategory(null); // Handle error state as needed
      }
    };

    fetchCategory();
  }, [productCategoryId]);

  if (!category) {
    return null;
  }

  return <span>{category.name}</span>; // Render the category name or other data as needed
};

export default GetProductCategory;
