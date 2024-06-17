"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SubCategorySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { CheckThenAddSubCategory } from "./CheckThenAddSubCategory";
import { useSubCategoryContext } from "./SubCategoryProvider";
import GetCategories from "../Cateogry/GetCategories";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  name: string;
}

export default function CreateSubCategory() {
  const { refresh } = useSubCategoryContext();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState<Category[]>([]);

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

  const form = useForm<z.infer<typeof SubCategorySchema>>({
    resolver: zodResolver(SubCategorySchema),
    defaultValues: {
      name: "",
      categoryId: "",
    },
  });

  const OnSubmit = async (data: z.infer<typeof SubCategorySchema>) => {
    try {
      const error = await CheckThenAddSubCategory(data);
      if (error.error) {
        toast.error("SubCategory Already Exists");
      } else {
        toast.success("SubCategory Added");
        startTransition(() => {
          refresh(); // Notify to refresh
          router.refresh();
        });
      }
    } catch (err) {
      toast.error("An error occurred while adding the SubCategory");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-6">
        {/* subcategory name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Create SubCategory</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="SubCategory Name"
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        {/* choose category */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Choose Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
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

        <Button disabled={isPending} type="submit" className="w-full">
          {isPending ? <span>Loading...</span> : <span>Add SubCategory</span>}
        </Button>
      </form>
    </Form>
  );
}
