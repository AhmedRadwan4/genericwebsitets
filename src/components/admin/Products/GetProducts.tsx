"use server";
import { db } from "@/lib/db";

export default async function GetProducts() {
  const products = await db.product.findMany();

  return products;
}

export async function CheckProduct(productName: string, categoryId: string) {
  const Category = await db.product.findFirst({
    where: { name: productName, categoryId: categoryId },
  });

  return Category;
}
