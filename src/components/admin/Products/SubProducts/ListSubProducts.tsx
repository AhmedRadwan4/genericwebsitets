"use client";
import React, { useEffect, useState } from "react";
import { GetSubProducts } from "./GetSubProducts";
import { SubProduct } from "@prisma/client";
import Image from "next/image";

interface SubProductsComponentProps {
  ProductId: string;
}

const SubProductsComponent: React.FC<SubProductsComponentProps> = ({
  ProductId,
}) => {
  const [subProducts, setSubProducts] = useState<SubProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchSubProducts() {
      try {
        const result = await GetSubProducts(ProductId);
        setSubProducts(result);
      } finally {
        setLoading(false);
      }
    }

    fetchSubProducts();
  }, [ProductId]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {subProducts.map((subProduct) => (
        <div key={subProduct.id} className="flex flex-row justify-between">
          <p>SKU:{subProduct.sku}</p>
          <p>Price: {subProduct.price}</p>
          <p>Stock: {subProduct.stock}</p>
          <p>Discount: {subProduct.discount}%</p>
          <p>Sold: {subProduct.sold}</p>
          {subProduct.images.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt="Product image"
              width={200}
              height={200}
            />
          ))}
        </div>
      ))}
    </>
  );
};

export default SubProductsComponent;
