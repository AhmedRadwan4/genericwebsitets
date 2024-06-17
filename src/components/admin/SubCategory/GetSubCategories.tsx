"use server";
import { db } from "@/lib/db";

export default async function GetSubCategories() {
  const Subcategories = await db.subCategory.findMany({});

  return Subcategories;
}
