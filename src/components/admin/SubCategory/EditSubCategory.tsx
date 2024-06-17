"use server";
import { db } from "@/lib/db";

export default async function EditSubCategory(
  subcategoryId: string,
  newName: string,
  editedMainCategoryId: string
) {
  const update = await db.subCategory.update({
    where: { id: subcategoryId },
    data: {
      name: newName,
      categoryId: editedMainCategoryId,
    },
  });

  return update;
}
