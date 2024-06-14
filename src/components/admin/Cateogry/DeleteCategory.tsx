"use server";
import { db } from "@/lib/db";

export default async function DeleteCategory(categoryId: string) {
  const del = await db.category.delete({ where: { id: categoryId } });

  return true;
}
