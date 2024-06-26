"use server";
import { db } from "@/lib/db";

export async function GetSubProducts(ProductId: string) {
  const SubProducts = await db.subProduct.findMany({
    where: {
      productId: ProductId,
    },
  });

  return SubProducts;
}
