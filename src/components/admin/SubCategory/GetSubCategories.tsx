"use server";
import { db } from "@/lib/db";

export async function GetSubCategories() {
  const Subcategories = await db.subCategory.findMany({});

  return Subcategories;
}

export async function GetSubCategory(subcategory?: string) {
  const subCategory = await db.subCategory.findFirst({
    where: { id: subcategory },
  });

  return subCategory;
}
