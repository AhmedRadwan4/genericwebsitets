"use client";
import AddSubProduct from "@/components/admin/Products/SubProducts/AddSubProduct";
import { Product } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import "react-toastify/ReactToastify.min.css";

export default function SubProducts(product: Product) {
  const searchParams = useSearchParams();
  const pId = searchParams.get("id"); // Assuming the parameter name is 'id'

  // Create a new object that includes the id property
  const newProduct: Product = { ...product, id: pId || product.id };

  return (
    <div className="flex justify-center w-dvw">
      <AddSubProduct {...newProduct} />
    </div>
  );
}
