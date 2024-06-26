"use server";
import { db } from "@/lib/db";

export default async function DeleteCategory(productId: string) {
  const del = await db.product.delete({ where: { id: productId } });

  return true;
}
