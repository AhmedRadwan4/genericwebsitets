"use client";
import * as React from "react";
import * as z from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateProduct } from "./CreateProduct";
import { GetCategories } from "../Categories/GetCategories";
import { toast } from "react-toastify";
import { ProductCategory } from "@prisma/client";
import { useRouter } from "next/navigation";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { BsImages, BsPaperclip } from "react-icons/bs";
import { ProductSchema } from "@/schemas";
import { CheckProduct } from "./GetProducts";
import { UploadToS3 } from "@/components/AWS-S3-Express";

// Define type/interface for ProductCategoryGroup
interface ProductCategoryGroup {
  [key: string]: ProductCategory[];
}

export default function AddProduct() {
  const router = useRouter();
  const [isPending, startTransition] = useState(false);
  const [isAdding, setisAdding] = useState(false); // Loading state
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>(
    []
  );
  const [groupedCategories, setGroupedCategories] =
    useState<ProductCategoryGroup>({});

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

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      description: "",
      parentCategoryId: "",
      productImage: "",
    },
  });

  const OnSubmit = async (formData: z.infer<typeof ProductSchema>) => {
    const data = { ...formData };

    const ProductCategoryExists = await CheckProduct(
      data.name,
      data.parentCategoryId
    );

    if (ProductCategoryExists) {
      toast.error("Product Already Exists");
      return;
    }

    try {
      const imageUrls = await Promise.all(
        selectedImages.map(async (file) => await UploadToS3(file))
      );

      const validImageUrls = imageUrls.filter(
        (url): url is string => url !== null
      );

      data.productImage = validImageUrls.length > 0 ? validImageUrls[0] : "";

      await CreateProduct(
        data.parentCategoryId,
        data.name,
        data.description,
        data.productImage
      );

      toast.success("Product Added");
      setSelectedImages([]); // Clear the selected images

      window.location.reload(); // Refresh the page on successful submission
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An error occurred while processing your request");
    }
  };

  return (
    <>
      {!isAdding && (
        <Button className="w-1/2 mx-auto" onClick={() => setisAdding(true)}>
          Add Product
        </Button>
      )}
      {isAdding && (
        <>
          <button
            className="absolute top-10 right-20"
            onClick={() => setisAdding(false)}
          >
            <MdOutlineCancelPresentation
              className="text-destructive hover:text-red-600"
              size={30}
            />
          </button>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="Product Name"
                          type="text"
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="Description"
                          type="text"
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parentCategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Choose Category</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="bg-gray-100 p-2 rounded-lg mt-2 dark:bg-gray-700 w-full"
                          disabled={isPending}
                          value={field.value || "root"}
                          onChange={(e) => {
                            form.setValue("parentCategoryId", e.target.value);
                          }}
                        >
                          {Object.entries(groupedCategories).map(
                            ([parentId, group]) => {
                              // Filter out categories with parentId as "root"
                              if (parentId === "root") {
                                return null; // Skip rendering for root categories
                              }

                              const parentCategoryName =
                                productCategories.find(
                                  (cat) => cat.id === parentId
                                )?.categoryName || "Unknown Category";

                              return (
                                <optgroup
                                  key={parentId}
                                  label={parentCategoryName}
                                >
                                  {group.map((category) => (
                                    <option
                                      key={category.id}
                                      value={category.id}
                                    >
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
                    name="productImage"
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
                                Choose The Product&apos;s Main Image
                              </span>
                            </label>
                          </Button>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button disabled={isPending} type="submit" className="w-full">
                <span>Submit</span>
              </Button>
            </form>
          </Form>
        </>
      )}
    </>
  );
}
