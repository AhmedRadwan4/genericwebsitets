"use server";
import { db } from "@/lib/db";

export default async function EditSubCategory(
  productCategoryId: string,
  editedName: string,
  editedParentCategoryId: string
) {
  try {
    // Check if the new name already exists in any other subcategory
    const existingSubCategory = await db.productCategory.findFirst({
      where: {
        categoryName: editedName,
        parentCategoryId: editedParentCategoryId,
        NOT: {
          id: productCategoryId, // Exclude the current subcategory being updated
        },
      },
    });

    if (existingSubCategory) {
      return { success: false, error: "Subcategory name already exists." };
    }

    // Perform the update
    const updatedCategory = await db.productCategory.update({
      where: { id: productCategoryId },
      data: {
        categoryName: editedName,
      },
    });

    if (updatedCategory) {
      return { success: true };
    } else {
      return { success: false, error: "Failed to update subcategory." };
    }
  } catch (error: any) {
    return { success: false, error: error.message as string };
  }
}
