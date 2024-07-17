import * as z from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

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

export const ProductCategorySchema = z.object({
  CategoryName: z.string().min(1, { message: "Category Name is required" }),
  ParentCategoryId: z.string().optional().nullable(),
  CategoryImage: z
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

export const ProductSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  parentCategoryId: z.string().refine((val) => val !== "root", {
    message: "Please select a category",
  }),
  productImage: z
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

export const VariationSchema = z.object({
  variationName: z.string().min(1, { message: "Variation Name is required" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
});

export const ProductItemSchema = z.object({
  productId: z.string(),
  sku: z.string().min(1, { message: "SKU is required" }),
  price: z.coerce.number().min(1, { message: "Price is required" }),
  quantity: z.number().min(1, { message: "Quantity is required" }),
  variationIds: z.record(z.string(), z.string()).optional(),
  productItemImage: z
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
