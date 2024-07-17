"use server";
import { db } from "@/lib/db";

export async function CheckProductItem(sku: string) {
  const Category = await db.productItem.findFirst({
    where: { sku: sku },
  });

  return Category;
}
