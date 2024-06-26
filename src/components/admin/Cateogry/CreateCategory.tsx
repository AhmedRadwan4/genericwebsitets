"use server";
import { db } from "@/lib/db";

export async function CreateCategory(data: any) {
  db.$connect();
  const test = await db.category.findFirst({
    where: {
      name: data.name,
    },
  });

  if (test) {
    return {
      error: true,
    };
  } else {
    await db.category.create({
      data: {
        name: data.name,
      },
    });
    return { error: false };
  }
}
