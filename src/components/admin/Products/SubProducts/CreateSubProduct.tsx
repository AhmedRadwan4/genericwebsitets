"use server";
import { db } from "@/lib/db";
import { SubProductSchema } from "@/schemas";
import * as z from "zod";

export async function CheckSubProductExists(sku: string) {
  db.$connect();
  const existingSubProduct = await db.subProduct.findFirst({
    where: {
      sku: sku,
    },
  });

  return !!existingSubProduct;
}

export async function CreateSubProduct(
  pId: string,
  data: z.infer<typeof SubProductSchema>
) {
  const price = Number(data.price);
  const stock = Number(data.stock);
  const discount = Number(data.discount);

  const subProductExists = await CheckSubProductExists(data.sku);

  if (subProductExists) {
    return { error: true };
  }

  try {
    await db.$connect();
    await db.subProduct.create({
      data: {
        sku: data.sku,
        price: price,
        stock: stock,
        images: data.images,
        discount: discount,
        productId: pId,
      },
    });
    return { error: false };
  } catch (error) {
    console.error("Error creating subProduct:", error);
    return { error: true };
  } finally {
    await db.$disconnect();
  }
}
