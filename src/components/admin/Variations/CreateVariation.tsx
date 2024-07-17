"use server";
import { db } from "@/lib/db";

export async function CreateVariation(
  variationName: string,
  categoryId: string
) {
  db.$connect();
  const test = await db.variation.findFirst({
    where: {
      name: variationName,
      categoryId: categoryId,
    },
  });

  if (test) {
    return {
      error: true,
    };
  } else {
    await db.variation.create({
      data: {
        name: variationName,
        categoryId: categoryId,
      },
    });
    return { error: false };
  }
}
export async function CreateVariationOption(
  valueName: string,
  variationId: string
) {
  db.$connect();
  const test = await db.variationOption.findFirst({
    where: {
      value: valueName,
      variationId: variationId,
    },
  });

  if (test) {
    return {
      error: true,
    };
  } else {
    await db.variationOption.create({
      data: {
        value: valueName,
        variationId: variationId,
      },
    });
    return { error: false };
  }
}
