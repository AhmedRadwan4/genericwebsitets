"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { GetCategories } from "../Categories/GetCategories";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ProductCategory } from "@prisma/client";
import { VariationSchema } from "@/schemas";
import { CreateVariation } from "./CreateVariation";

interface ProductCategoryGroup {
  [key: string]: ProductCategory[];
}
export default function AddCategory() {
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>(
    []
  );
  const [groupedCategories, setGroupedCategories] =
    useState<ProductCategoryGroup>({});
  // Function to fetch categories
  const fetchCategories = async () => {
    try {
      const categories = await GetCategories();
      setCategories(categories);

      const grouped = categories.reduce((acc, category) => {
        const parentId = category.parentCategoryId || "root";
        if (!acc[parentId]) {
          acc[parentId] = [];
        }
        acc[parentId].push(category);
        return acc;
      }, {} as { [key: string]: ProductCategory[] });

      setGroupedCategories(grouped);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categories = await GetCategories();
        setProductCategories(categories);
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    // Group categories by parentId
    const grouped = productCategories.reduce(
      (acc: ProductCategoryGroup, category: ProductCategory) => {
        const parentId = category.parentCategoryId || "root";
        if (!acc[parentId]) {
          acc[parentId] = [];
        }
        acc[parentId].push(category);
        return acc;
      },
      {}
    );

    setGroupedCategories(grouped);
  }, [productCategories]);

  const form = useForm<z.infer<typeof VariationSchema>>({
    resolver: zodResolver(VariationSchema),
    defaultValues: {
      variationName: "",
      categoryId: "",
    },
  });

  const onSubmit = async (formData: z.infer<typeof VariationSchema>) => {
    const data = { ...formData };
    try {
      await CreateVariation(data.variationName, data.categoryId);
      toast.success("Variation Added");
      window.location.reload(); // Refresh the page on successful submission
    } catch (err) {
      toast.error("An error occurred while adding the SubCategory: " + err);
    }
  };
  return (
    <Form {...form}>
      <h1 className="text-3xl font-bold text-center p-5">
        Create New Variation
      </h1>
      <p className="text-xl font-semibold text-center p-5">
        A list of properties that can be configured for products within a
        category, such as Size and Colour
      </p>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-1/2 mx-auto"
      >
        {/* Subcategory name */}
        <FormField
          control={form.control}
          name="variationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Variation Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="Category Name"
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Choose category */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Choose Category</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="bg-gray-100 p-2 rounded-lg mt-2 dark:bg-gray-700 w-full"
                  disabled={isPending}
                  value={field.value || ""}
                  onChange={(e) => {
                    form.setValue("categoryId", e.target.value);
                  }}
                >
                  <option value="">Choose a Category</option>
                  {Object.entries(groupedCategories).map(
                    ([parentId, group]) => {
                      // Filter out categories with parentId as "root"
                      if (parentId === "root") {
                        return null; // Skip rendering for root categories
                      }

                      const parentCategoryName =
                        productCategories.find((cat) => cat.id === parentId)
                          ?.categoryName || "Unknown Category";

                      return (
                        <optgroup key={parentId} label={parentCategoryName}>
                          {group.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.categoryName}
                            </option>
                          ))}
                        </optgroup>
                      );
                    }
                  )}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending} type="submit" className="w-full">
          {isPending ? <span>Loading...</span> : <span>Add Variation</span>}
        </Button>
      </form>
    </Form>
  );
}
