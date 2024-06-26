"use server";
import { db } from "@/lib/db";

export default async function GetProducts() {
  const products = await db.product.findMany();

  return products;
}
