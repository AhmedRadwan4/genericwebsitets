"use client";
import AddSubProduct from "@/components/admin/Products/SubProducts/AddSubProduct";
import { useSearchParams } from "next/navigation";
import "react-toastify/ReactToastify.min.css";

export default function SubProducts() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id") || "";

  return (
    <div className="flex justify-center w-dvw">
      <AddSubProduct pId={productId} />
    </div>
  );
}
