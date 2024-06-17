"use server";
import { db } from "@/lib/db";

export default async function DeleteSubCategory(subcategoryId: string) {
  const del = await db.subCategory.delete({ where: { id: subcategoryId } });

  return true;
}
