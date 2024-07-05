"use server";
import { db } from "@/lib/db";

export async function GetVariations() {
  const variations = await db.variation.findMany();

  return variations;
}

export async function CheckVariations(
  variationName: string,
  categoryId: string
) {
  const variation = await db.variation.findFirst({
    where: { name: variationName, categoryId: categoryId },
  });

  return variation;
}
