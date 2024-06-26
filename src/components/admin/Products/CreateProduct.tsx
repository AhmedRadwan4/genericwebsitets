"use server";
import { db } from "@/lib/db";

export async function CreateProduct(data: any) {
  db.$connect();
  const test = await db.product.findFirst({
    where: {
      name: data.name,
    },
  });

  if (test) {
    return {
      error: true,
    };
  } else {
    await db.product.create({
      data: {
        name: data.name,
        description: data.description,
        brand: data.brand,
        subCategoryId: data.SubcategoryId,
        categoryId: data.categoryId,
      },
    });
    return { error: false };
  }
}
