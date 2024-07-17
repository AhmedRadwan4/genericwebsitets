"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "react-toastify";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ProductItemSchema } from "@/schemas";
import Image from "next/image";
import { BsImages, BsPaperclip } from "react-icons/bs";
import { UploadToS3 } from "@/components/AWS-S3-Express";
import { CreateProductItem } from "./CreateProductItem";
import { CheckProductItem } from "./GetProductItem";
import { GetCategory } from "../Categories/GetCategories";
import {
  GetVariationsForCategory,
  GetVariationOptions,
} from "../Variations/GetVariations";
import {
  Product,
  ProductCategory,
  Variation,
  VariationOption,
} from "@prisma/client";
import { GetProduct } from "../Products/GetProducts";

interface AddProductItemProps {
  productId: string;
}

export default function AddProductItem({ productId }: AddProductItemProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [variationOptions, setVariationOptions] = useState<{
    [key: string]: VariationOption[];
  }>({});
  const [product, setProduct] = useState<Product | null>(null);
  const form = useForm<z.infer<typeof ProductItemSchema>>({
    resolver: zodResolver(ProductItemSchema),
    defaultValues: {
      price: 0,
      quantity: 0,
      sku: "",
      productItemImage: "",
    },
  });

  useEffect(() => {
    const fetchProduct = async (productId: string) => {
      try {
        const product = await GetProduct(productId);
        setProduct(product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct(productId);
  }, [productId]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const fetchedCategory = await GetCategory(
          product?.categoryId as string
        );
        setCategory(fetchedCategory);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    if (product?.categoryId) {
      fetchCategory();
    }
  }, [product?.categoryId]);

  useEffect(() => {
    const fetchVariations = async () => {
      try {
        const fetchedVariations = await GetVariationsForCategory(
          category?.id as string
        );
        setVariations(fetchedVariations);
      } catch (error) {
        console.error("Error fetching variations:", error);
      }
    };

    if (category?.id) {
      fetchVariations();
    }
  }, [category?.id]);

  useEffect(() => {
    const fetchOptionsForVariations = async () => {
      try {
        const options = await Promise.all(
          variations.map(async (variation) => {
            const options = await GetVariationOptions(variation.id);
            return { variationId: variation.id, options };
          })
        );

        const optionsMap = options.reduce((acc, { variationId, options }) => {
          acc[variationId] = options;
          return acc;
        }, {} as { [key: string]: VariationOption[] });

        setVariationOptions(optionsMap);
      } catch (error) {
        console.error("Error fetching variation options:", error);
      }
    };

    if (variations.length > 0) {
      fetchOptionsForVariations();
    }
  }, [variations]);

  const onSubmit = async (formData: z.infer<typeof ProductItemSchema>) => {
    debugger;
    startTransition(async () => {
      const data = {
        ...formData,
        price: Number(formData.price),
        productId,
      };

      try {
        const imageUrls = await Promise.all(
          selectedImages.map(async (file) => await UploadToS3(file))
        );

        const validImageUrls = imageUrls.filter(
          (url): url is string => url !== null
        );

        data.productItemImage =
          validImageUrls.length > 0 ? validImageUrls[0] : "";

        const productItemExists = await CheckProductItem(data.sku);

        if (productItemExists) {
          toast.error("Product Item Already Exists");
        } else {
          await CreateProductItem(data);
          toast.success("Product Item Added");
          setSelectedImages([]);
          window.location.reload();
        }
      } catch (error) {
        console.error("An error occurred:", error);
        toast.error("An error occurred while processing the request");
      }
    });
  };

  return (
    <Form {...form}>
      <h1 className="text-3xl font-bold text-center p-5">Create New Product</h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-1/2 mx-auto"
      >
        {/* Sku */}
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sku</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="Stock Keeping Unit"
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Image Upload Handling */}
        <div className="flex w-full gap-4 p-4 rounded border border-neutral-200 flex-col items-center md:flex-row md:justify-between md:items-center">
          <div className="flex md:flex-1 h-[fit-content] md:p-4 md:justify-between md:flex-row">
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
            name="productItemImage"
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
                        if (files.length > 0) {
                          field.onChange(files);
                          setSelectedImages(files);
                        }
                      }}
                      ref={field.ref}
                    />
                    <label
                      htmlFor="fileInput"
                      className="text-neutral-90 rounded-md cursor-pointer inline-flex items-center"
                    >
                      <BsPaperclip />
                      <span className="whitespace-nowrap">
                        Choose The Item Image
                      </span>
                    </label>
                  </Button>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Variation Options */}
        <ul className="list-disc pl-4">
          {variations.map((variation) => (
            <li key={variation.id}>
              <FormField
                control={form.control}
                name={`variationIds.${variation.id}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{variation.name}</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        disabled={isPending}
                      >
                        {variationOptions[variation.id]?.map((option) => (
                          <option key={option.id} value={option.value}>
                            {option.value}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </li>
          ))}
        </ul>
        <Button disabled={isPending} type="submit" className="w-full">
          {isPending ? <span>Loading...</span> : <span>Add Product Item</span>}
        </Button>
      </form>
    </Form>
  );
}
