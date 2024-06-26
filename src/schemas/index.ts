import * as z from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png", "webp"];

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Invalid email",
  }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Invalid email",
  }),
  password: z.string().min(6, { message: "Minimum password is 6 characters" }),
  name: z.string().min(1, { message: "Name is required" }),
});

export const CategorySchema = z.object({
  name: z.string().min(1, { message: "Category Name is required" }),
});

export const SubCategorySchema = z.object({
  name: z.string().min(1, { message: "Category Name is required" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
});

export const ProductSchema = z.object({
  name: z.string().min(1, { message: "Product Name is required" }),
  brand: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1, { message: "Category is required" }),
  SubcategoryId: z.string().min(1, { message: "SubCategory is required" }),
});

export const SubProductSchema = z.object({
  sku: z.string().min(1, { message: "SKU is required" }),
  size: z.string().optional(),
  price: z.string().min(1, { message: "Price is required" }),
  stock: z.string().min(1, { message: "Stock is required" }),
  discount: z.string().optional(),
  color: z.string().min(1, { message: "Color is required" }),
  images: z
    .any()
    .refine((files) => files && files.length > 0, "Please upload a file.")
    .refine((files) => {
      return (
        files &&
        Array.from(files as File[]).every((file) => file.size <= MAX_FILE_SIZE)
      );
    }, `Max image size is 5MB.`)
    .refine((files) => {
      return (
        files &&
        Array.from(files as File[]).every((file) =>
          ACCEPTED_IMAGE_MIME_TYPES.includes(file.type)
        )
      );
    }, "Only .jpg, .jpeg, .png and .webp formats are supported."),
});
