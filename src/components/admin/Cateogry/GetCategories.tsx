"use server";
import { db } from "@/lib/db";

export default async function GetCategories() {
  const categories = await db.category.findMany({});

  return categories;
}
