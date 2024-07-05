"use server";
import { db } from "@/lib/db";

export async function CreateProduct(
  ProductCategoryId: string,
  ProductName: string,
  ProductDescription: string,
  ProductImage: string
) {
  db.$connect();
  const test = await db.product.findFirst({
    where: {
      name: ProductName,
      categoryId: ProductCategoryId,
    },
  });

  if (test) {
    return {
      error: true,
    };
  } else {
    await db.product.create({
      data: {
        name: ProductName,
        description: ProductDescription,
        productImage: ProductImage,
        categoryId: ProductCategoryId,
      },
    });
    return { error: false };
  }
}
