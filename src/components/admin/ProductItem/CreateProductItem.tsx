"use server";
import { db } from "@/lib/db";

export async function CreateProductItem(data: any) {
  await db.$connect();
  const existingProductItem = await db.productItem.findFirst({
    where: {
      sku: data.sku,
    },
  });

  if (existingProductItem) {
    return {
      error: true,
    };
  }

  await db.productItem.create({
    data: {
      productId: data.productId,
      sku: data.sku,
      price: data.price,
      qtyInStock: data.quantity,
      productImage: data.productItemImage,
    },
  });

  return { error: false };
}
