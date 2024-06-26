"use server";
import { db } from "@/lib/db";

export async function GetCategories() {
  const categories = await db.category.findMany();

  return categories;
}

export async function GetCategory(categoryId?: string) {
  const category = await db.category.findFirst({ where: { id: categoryId } });

  return category;
}
