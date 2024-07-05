"use server";
import { db } from "@/lib/db";

export async function CreateCategory(
  CategoryName: string,
  ParentCategoryId: string,
  CategoryImage: string
) {
  await db.$connect();

  // Check if the parentCategoryId is provided
  if (ParentCategoryId) {
    const existingCategory = await db.productCategory.findFirst({
      where: {
        categoryName: CategoryName,
        parentCategoryId: ParentCategoryId,
      },
    });

    if (existingCategory) {
      return {
        error: true,
      };
    }

    await db.productCategory.create({
      data: {
        categoryName: CategoryName,
        parentCategoryId: ParentCategoryId,
        categoryImage: CategoryImage,
      },
    });

    // Update parent category's hasSubcategories attribute
    await db.productCategory.update({
      where: {
        id: ParentCategoryId,
      },
      data: {
        hasSubcategories: true,
      },
    });

    return { error: false };
  } else {
    // No parentCategoryId provided, handle accordingly
    const existingCategory = await db.productCategory.findFirst({
      where: {
        categoryName: CategoryName,
        parentCategoryId: null,
      },
    });

    if (existingCategory) {
      return {
        error: true,
      };
    }

    await db.productCategory.create({
      data: {
        categoryName: CategoryName,
        parentCategoryId: null,
      },
    });

    return { error: false };
  }
}
