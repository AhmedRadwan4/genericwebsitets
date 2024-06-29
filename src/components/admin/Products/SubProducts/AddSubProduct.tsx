"use client";
import * as React from "react";
import * as z from "zod";
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
import { SubProductSchema } from "@/schemas";
import { useState, useTransition } from "react";
import {
  CheckSubProductExists,
  CreateSubProduct,
} from "@/components/admin/Products/SubProducts/CreateSubProduct";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { BsImages, BsPaperclip } from "react-icons/bs";
import Image from "next/image";
import axios from "axios";

async function UploadToS3(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      // external express server for handling aws s3 uploading
      // https://github.com/AhmedRadwan4/express
      `https://express-7kj0tm20p-ahmedradwan4s-projects.vercel.app/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to upload file.");
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}

export default function AddSubProduct(pId: any) {
  const pIdValue = pId.pId;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const form = useForm<z.infer<typeof SubProductSchema>>({
    resolver: zodResolver(SubProductSchema),
    defaultValues: {
      sku: "",
      size: "",
      price: "",
      stock: "",
      discount: "",
      color: "",
      images: undefined,
    },
  });

  // Handles form submission
  const onSubmit = async (data: z.infer<typeof SubProductSchema>) => {
    const subProductExists = await CheckSubProductExists(data.sku);
    if (subProductExists) {
      return toast.error("Product Already Exists");
    } else {
      try {
        console.log("sending imgs to s3");
        const imageUrls = await Promise.all(
          selectedImages.map(async (file) => await UploadToS3(file))
        );

        console.log("before aws", data.images);
        data.images = imageUrls.filter((url) => url !== null); // Filter out null values

        console.log("after aws", data.images);
      } catch (error) {
        console.error("An error occurred while uploading images:", error);
        toast.error("An error occurred while uploading images");
      }

      try {
        const error = await CreateSubProduct(pIdValue, data);

        if (error.error) {
          toast.error("Product Already Exists");
        } else {
          toast.success("Product Added");
          form.reset();
          setSelectedImages([]); // Clear the selected images
          router.refresh();
        }
      } catch (error) {
        toast.error("An error occurred while adding the Product");
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-[80%]"
      >
        <div className="space-y-4">
          {/* SKU Field */}
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Enter Stock Keeping Unit"
                    type="text"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Size Field */}
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="36/37/38/39/..."
                    type="text"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price Field */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Price in EGP"
                    type="number"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stock Field */}
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Amount of Items"
                    type="number"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Discount Field */}
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Discount in %"
                    type="number"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Color Field */}
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Color"
                    type="text"
                    autoComplete="off"
                  />
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
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Button size="lg" type="button">
                      <input
                        type="file"
                        className="hidden"
                        id="fileInput"
                        accept="image/*"
                        multiple
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
                          Choose your images
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
  );
}
