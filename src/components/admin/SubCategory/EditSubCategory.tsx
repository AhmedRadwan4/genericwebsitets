"use server";
import { db } from "@/lib/db";

interface UpdateSubCategoryResult {
  success: boolean;
  error?: string; // Optional error message in case of failure
}

export default async function EditSubCategory(
  subcategoryId: string,
  newName: string,
  editedMainCategoryId: string
): Promise<UpdateSubCategoryResult> {
  try {
    // Check if the new name already exists in any other subcategory
    const existingSubCategory = await db.subCategory.findFirst({
      where: {
        name: newName,
        NOT: {
          id: subcategoryId, // Exclude the current subcategory being updated
        },
      },
    });

    if (existingSubCategory) {
      return { success: false, error: "Subcategory name already exists." };
    }

    // Check if the editedMainCategoryId exists in the categories table
    const existingCategory = await db.category.findFirst({
      where: {
        id: editedMainCategoryId,
      },
    });

    if (!existingCategory) {
      return { success: false, error: "Invalid categoryId." };
    }

    // Perform the update if both checks pass
    const update = await db.subCategory.update({
      where: { id: subcategoryId },
      data: {
        name: newName,
        categoryId: editedMainCategoryId,
      },
    });

    if (update) {
      return { success: true };
    } else {
      return { success: false, error: "Failed to update subcategory." };
    }
  } catch (error: any) {
    return { success: false, error: error.message as string };
  }
}
