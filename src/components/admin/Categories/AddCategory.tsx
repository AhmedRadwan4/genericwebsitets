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
import { CheckCategory, GetCategories } from "./GetCategories";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ProductCategory } from "@prisma/client";
import { ProductCategorySchema } from "@/schemas";
import { CreateCategory } from "./CreateCategory";
import Image from "next/image";
import { BsImages, BsPaperclip } from "react-icons/bs";
import { UploadToS3 } from "@/components/AWS-S3-Express";

export default function AddCategory() {
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [groupedCategories, setGroupedCategories] = useState<{
    [key: string]: ProductCategory[];
  }>({});

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

  const form = useForm<z.infer<typeof ProductCategorySchema>>({
    resolver: zodResolver(ProductCategorySchema),
    defaultValues: {
      CategoryName: "",
      ParentCategoryId: "",
      CategoryImage: "",
    },
  });

  const OnSubmit = async (formData: z.infer<typeof ProductCategorySchema>) => {
    startTransition(async () => {
      const data = { ...formData };
      const ProductCategoryExists = await CheckCategory(
        data.CategoryName,
        data.ParentCategoryId || ""
      );
      if (ProductCategoryExists) {
        toast.error("SubCategory Already Exists");
      } else {
        try {
          const imageUrls = await Promise.all(
            selectedImages.map(async (file) => await UploadToS3(file))
          );

          // Ensure imageUrls is a string (as the returned URL from AWS is a single text)
          const validImageUrls = imageUrls.filter(
            (url): url is string => url !== null
          );

          // Assigning the single URL to CategoryImage
          data.CategoryImage =
            validImageUrls.length > 0 ? validImageUrls[0] : "";
        } catch (error) {
          console.error("An error occurred while uploading images:", error);
          toast.error("An error occurred while uploading images");
          return; // Exit on error
        }

        try {
          await CreateCategory(
            data.CategoryName,
            data?.ParentCategoryId || "",
            data?.CategoryImage
          );
          toast.success("SubCategory Added");
          setSelectedImages([]); // Clear the selected images
          window.location.reload(); // Refresh the page on successful submission
        } catch (err) {
          toast.error("An error occurred while adding the SubCategory: " + err);
        }
      }
    });
  };

  return (
    <Form {...form}>
      <h1 className="text-3xl font-bold text-center p-5">
        Create New Category
      </h1>
      <form
        onSubmit={form.handleSubmit(OnSubmit)}
        className="space-y-6 w-1/2 mx-auto"
      >
        {/* Subcategory name */}
        <FormField
          control={form.control}
          name="CategoryName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Category Name</FormLabel>
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
          name="ParentCategoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Choose Parent Category</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="bg-gray-100 p-2 rounded-lg mt-2 dark:bg-gray-700 w-full"
                  disabled={isPending}
                  value={field.value || "root"}
                >
                  <option value="root">Root Category</option>
                  {Object.entries(groupedCategories).map(
                    ([parentId, group]) => {
                      const parentCategoryName =
                        parentId === "root"
                          ? "Root Categories"
                          : categories.find(
                              (category) => category.id === parentId
                            )?.categoryName || "Unknown Category";
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
        {/* Image Upload Handling */}
        <div className="flex w-[100%] gap-4 p-4 rounded border border-neutral-200 flex-col items-center md:flex-row md:justify-between md:items-center">
          <div className="flex md:flex-[1] h-[fit-content] md:p-4 md:justify-between md:flex-row">
            {selectedImages.length > 0 ? (
              <div className="flex gap-4 flex-wrap">
                {selectedImages.map((image, index) => (
                  <div key={index} className="md:max-w-[200px]">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={`Selected ${index + 1}`}
                      width={200}
                      height={200}
                      className="object-cover w-auto h-auto"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="inline-flex items-center justify-between">
                <div className="p-3 bg-slate-200 justify-center items-center flex">
                  <BsImages size={56} />
                </div>
              </div>
            )}
          </div>
          <FormField
            control={form.control}
            name="CategoryImage"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Button size="lg" type="button">
                    <input
                      type="file"
                      className="hidden"
                      id="fileInput"
                      accept="image/*"
                      onBlur={field.onBlur}
                      name={field.name}
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        field.onChange(files);
                        setSelectedImages(files);
                      }}
                      ref={field.ref}
                    />
                    <label
                      htmlFor="fileInput"
                      className="text-neutral-90 rounded-md cursor-pointer inline-flex items-center"
                    >
                      <BsPaperclip />
                      <span className="whitespace-nowrap">
                        Choose The Category Image
                      </span>
                    </label>
                  </Button>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button disabled={isPending} type="submit" className="w-full">
          {isPending ? <span>Loading...</span> : <span>Add SubCategory</span>}
        </Button>
      </form>
    </Form>
  );
}
