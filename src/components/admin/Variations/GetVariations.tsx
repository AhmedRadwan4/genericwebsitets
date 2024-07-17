"use server";
import { db } from "@/lib/db";

export async function GetVariations() {
  const variations = await db.variation.findMany();

  return variations;
}

export async function GetVariationsForCategory(categoryId: string) {
  const variations = await db.variation.findMany({
    where: { categoryId: categoryId },
  });

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
export async function GetVariationOptions(variationId: string) {
  const variations = await db.variationOption.findMany({
    where: { variationId: variationId },
  });

  return variations;
}
export async function GetVariationOption(variationId: string, value: string) {
  const variation = await db.variationOption.findFirst({
    where: { variationId: variationId, AND: { value: value } },
  });

  return variation;
}
