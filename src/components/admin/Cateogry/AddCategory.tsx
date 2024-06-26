"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { CategorySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { CreateCategory } from "./CreateCategory";

export default function AddCategory() {
  const router = useRouter();

  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const [isPending] = useTransition();

  const OnSubmit = async (data: z.infer<typeof CategorySchema>) => {
    try {
      const error = await CreateCategory(data);
      if (error.error) {
        toast.error("Category Already Exists");
      } else {
        toast.success("Category Added");
        router.refresh();
      }
    } catch (err) {
      toast.error("An error occurred while adding the category");
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(OnSubmit)}
          className="space-y-6 w-1/2 mx-auto"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Create Category</FormLabel>
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
          ></FormField>

          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? <span>Loading...</span> : <span>Add Category</span>}
          </Button>
        </form>
      </Form>
    </>
  );
}
