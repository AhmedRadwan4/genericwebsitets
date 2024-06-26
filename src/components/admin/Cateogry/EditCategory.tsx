"use server";
import { db } from "@/lib/db";

interface UpdateCategoryResult {
  success: boolean;
  error?: string; // Optional error message in case of failure
}

export default async function EditCategory(
  categoryId: string,
  newName: string
): Promise<UpdateCategoryResult> {
  try {
    // Check if the new name already exists in any other category
    const existingCategory = await db.category.findFirst({
      where: {
        name: newName,
        NOT: {
          id: {
            equals: categoryId, // Exclude the current category being updated
          },
        },
      },
    });

    if (existingCategory) {
      return { success: false, error: "Category name already exists." };
    }

    // Perform the update if the name is unique
    const update = await db.category.update({
      where: { id: categoryId },
      data: {
        name: newName,
      },
    });

    if (update) {
      return { success: true };
    } else {
      return { success: false, error: "Failed to update category." };
    }
  } catch (error: any) {
    // Explicitly specify 'any' type for 'error'
    return { success: false, error: error.message as string };
  }
}
