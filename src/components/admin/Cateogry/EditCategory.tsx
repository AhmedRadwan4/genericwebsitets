"use server";
import { db } from "@/lib/db";

export default async function EditCategory(
  categoryId: string,
  newName: string
) {
  const update = await db.category.update({
    where: { id: categoryId },
    data: {
      name: newName,
    },
  });

  return update;
}
