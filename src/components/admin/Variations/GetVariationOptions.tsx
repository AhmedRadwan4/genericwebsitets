"use server";
import { db } from "@/lib/db";

export async function GetVariationOption(variationId: string) {
  const variations = await db.variationOption.findMany({
    where: { variationId: variationId },
  });

  return variations;
}
