"use server";
import { db } from "@/lib/db";
import { GetVariationOption } from "./GetVariations";

export async function EditVariation(
  variationId: string,
  variationName: string
) {
  try {
    // Check if the new name already exists in any other subcategory
    const existingVariation = await db.variation.findFirst({
      where: {
        id: variationId,
        name: variationName,
        NOT: {
          id: variationId, // Exclude the current subcategory being updated
        },
      },
    });

    if (existingVariation) {
      return { success: false, error: "Variation name already exists." };
    }

    // Perform the update
    const updatedVariation = await db.variation.update({
      where: { id: variationId },
      data: {
        name: variationName,
      },
    });

    if (updatedVariation) {
      return { success: true };
    } else {
      return { success: false, error: "Failed to update Variation." };
    }
  } catch (error: any) {
    return { success: false, error: error.message as string };
  }
}

export async function EditVariationOption(
  variationId: string,
  variationOptionValue: string,
  oldVariationOptionValue: string
) {
  try {
    const VariationOptionId = await GetVariationOption(
      variationId,
      oldVariationOptionValue
    );

    // Perform the update
    const updatedVariationOption = await db.variationOption.update({
      where: {
        id: VariationOptionId?.id,
        AND: { value: oldVariationOptionValue },
      },
      data: {
        value: variationOptionValue,
      },
    });
    if (updatedVariationOption) {
      return { success: true };
    } else {
      return { success: false, error: "Failed to update VariationOptions." };
    }
  } catch (error: any) {
    return { success: false, error: error.message as string };
  }
}
