"use server";
import { DeleteFromS3 } from "@/components/AWS-S3-Express";
import { db } from "@/lib/db";
import { toast } from "react-toastify";

export default async function DeleteSubCategory(
  ProductCategoryId: string
): Promise<boolean> {
  try {
    // Delete images from S3
    const category = await db.productCategory.findUnique({
      where: { id: ProductCategoryId },
      select: { categoryImage: true },
    });

    if (category?.categoryImage) {
      DeleteFromS3(category.categoryImage);
    }
  } catch (error) {
    console.error("An error occurred while Deleting images:", error);
    toast.error("An error occurred while uploading images");
    return false; // Exit on error
  }

  try {
    // Delete the product category
    const deletedCategory = await db.productCategory.delete({
      where: { id: ProductCategoryId },
    });

    if (!deletedCategory) {
      throw new Error(`Category to be deleted not found.`);
    }

    // Check if there are any remaining subcategories under the parent category
    const remainingSubcategories = await db.productCategory.findMany({
      where: { parentCategoryId: deletedCategory.parentCategoryId },
    });

    // Update the parent category's hasSubcategories attribute if parent Exists
    if (deletedCategory.parentCategoryId) {
      const parentCategory = await db.productCategory.update({
        where: { id: deletedCategory.parentCategoryId },
        data: {
          hasSubcategories: remainingSubcategories.length > 0, // Update based on remaining subcategories
        },
      });
    }

    return true;
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    return false;
  }
}
