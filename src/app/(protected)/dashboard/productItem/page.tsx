"use client";
import AddProductItem from "@/components/admin/ProductItem/AddProductItem";
import { useSearchParams } from "next/navigation";
import "react-toastify/ReactToastify.min.css";

export default function ProductItem() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id") ?? ""; // Ensure productId is always string

  return (
    <>
      <AddProductItem productId={productId} />
    </>
  );
}
