"use server";
import { db } from "@/lib/db";

interface SubCategoryData {
  name: string;
  categoryId: string;
}

interface CheckThenAddSubCategoryResult {
  error: boolean;
}

export async function CheckThenAddSubCategory(
  data: SubCategoryData
): Promise<CheckThenAddSubCategoryResult> {
  await db.$connect();

  const test = await db.subCategory.findFirst({
    where: {
      name: data.name,
    },
  });

  if (test) {
    return {
      error: true,
    };
  } else {
    await db.subCategory.create({
      data: {
        name: data.name,
        categoryId: data.categoryId, // Ensure this matches the actual field name in your database schema
      },
    });
    return { error: false };
  }
}
