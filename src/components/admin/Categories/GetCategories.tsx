"use server";
import { db } from "@/lib/db";

export async function GetCategories() {
  const Categories = await db.productCategory.findMany({});

  return Categories;
}

export async function GetCategory(productCategoryId: string) {
  const Category = await db.productCategory.findFirst({
    where: { id: productCategoryId },
  });

  return Category;
}

export async function CheckCategory(
  categoryName: string,
  parentCategoryId: string
) {
  const Category = await db.productCategory.findFirst({
    where: { categoryName: categoryName, parentCategoryId: parentCategoryId },
  });

  return Category;
}
