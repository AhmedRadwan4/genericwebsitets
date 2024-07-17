"use server";
import { db } from "@/lib/db";

export async function GetProducts() {
  const products = await db.product.findMany();

  return products;
}

export async function GetProduct(productId: string) {
  const products = await db.product.findFirst({
    where: { id: productId },
  });

  return products;
}

export async function CheckProduct(productName: string, categoryId: string) {
  const Category = await db.product.findFirst({
    where: { name: productName, categoryId: categoryId },
  });

  return Category;
}
