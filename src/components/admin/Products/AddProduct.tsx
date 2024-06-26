"use client";
import * as React from "react";
import * as z from "zod";
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
import { ProductSchema } from "@/schemas";
import { useTransition } from "react";
import { CreateProduct } from "./CreateProduct";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GetCategories } from "../Cateogry/GetCategories";
import { toast } from "react-toastify";
import { Category, SubCategory } from "@prisma/client";
import { GetSubCategories } from "../SubCategory/GetSubCategories";
import { useRouter } from "next/navigation";
import { MdOutlineCancelPresentation } from "react-icons/md";

export default function AddProduct() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isAdding, setisAdding] = useState(false); // Loading state
  const [categories, setCategories] = useState<Category[]>([]);
  const [SubCategories, setSubCategories] = useState<SubCategory[]>([]);
  useEffect(() => {
    async function fetchCategories() {
      try {
        const categories = await GetCategories();
        setCategories(categories);
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchSubCategories() {
      try {
        const Subcategories = await GetSubCategories();
        setSubCategories(Subcategories);
      } catch (error) {
        toast.error("Failed to fetch SubCategories");
      }
    }

    fetchSubCategories();
  }, []);

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      brand: "",
      description: "",
      categoryId: "",
      SubcategoryId: "",
    },
  });

  const OnSubmit = async (data: z.infer<typeof ProductSchema>) => {
    try {
      const error = await CreateProduct(data);
      if (error.error) {
        toast.error("Product Already Exists");
      } else {
        toast.success("Product Added");
        setisAdding(false);
        router.refresh();
      }
    } catch (err) {
      toast.error("An error occurred while adding the Product");
    }
  };

  return (
    <>
      {!isAdding && (
        <Button className=" w-1/2 mx-auto" onClick={() => setisAdding(true)}>
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
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="Brand"
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
                      <FormLabel>Description (Optional)</FormLabel>
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
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Choose Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                {/* subcategory */}
                <FormField
                  control={form.control}
                  name="SubcategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Choose SubCategory</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Subcategory" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SubCategories.map((Subcategories) => (
                            <SelectItem
                              key={Subcategories.id}
                              value={Subcategories.id}
                            >
                              {Subcategories.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
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
