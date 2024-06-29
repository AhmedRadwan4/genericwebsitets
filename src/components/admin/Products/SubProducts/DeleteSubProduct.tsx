"use server";
import { db } from "@/lib/db";
import axios from "axios";

async function DeleteFromS3(imageUrls: string[]): Promise<void> {
  try {
    await axios.post(
      "https://express-7kj0tm20p-ahmedradwan4s-projects.vercel.app/delete",
      { images: imageUrls },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting images from S3:", error);
  }
}

export default async function DeleteCategory(subProductId: string) {
  // Fetch the images to be deleted
  const subProduct = await db.subProduct.findUnique({
    where: { id: subProductId },
    select: { images: true },
  });

  if (!subProduct || !subProduct.images) {
    console.log("No images found for the sub-product.");
    return false;
  }

  const imageUrls = subProduct.images;

  // Delete images from S3
  await DeleteFromS3(imageUrls);

  // Delete the sub-product from the database
  await db.subProduct.delete({ where: { id: subProductId } });

  return true;
}
