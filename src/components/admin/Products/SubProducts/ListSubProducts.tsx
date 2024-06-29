"use client";
import React, { useEffect, useState } from "react";
import { GetSubProducts } from "./GetSubProducts";
import { SubProduct } from "@prisma/client";
import Image from "next/image";
import { Button, Modal, TextInput, Label } from "flowbite-react"; // Modal, TextInput, and Label components from flowbite-react
import { FaRegEdit, FaTrash } from "react-icons/fa"; // Icons for edit, delete
import { toast } from "react-toastify"; // Toast notifications library
import DeleteSubProduct from "./DeleteSubProduct"; // Function to delete subproduct
import { HiOutlineExclamationCircle } from "react-icons/hi";

interface SubProductsComponentProps {
  ProductId: string;
}

const SubProductsComponent: React.FC<SubProductsComponentProps> = ({
  ProductId,
}) => {
  const [subProducts, setSubProducts] = useState<SubProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState(false); // Control modal visibility for delete confirmation
  const [editModalOpen, setEditModalOpen] = useState(false); // Control modal visibility for edit
  const [subProductIdToDelete, setSubProductIdToDelete] = useState<string>(""); // ID of subproduct to delete
  const [subProductNameToDelete, setSubProductNameToDelete] =
    useState<string>(""); // Name of subproduct to delete
  const [currentEditSubProduct, setCurrentEditSubProduct] =
    useState<SubProduct | null>(null); // SubProduct being edited

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

  const handleEditClick = (subProduct: SubProduct) => {
    setCurrentEditSubProduct(subProduct); // Set the subproduct to be edited
    setEditModalOpen(true); // Open the edit modal
  };

  const handleSaveEdit = () => {
    if (currentEditSubProduct) {
      setSubProducts((prevSubProducts) =>
        prevSubProducts.map((subProduct) =>
          subProduct.id === currentEditSubProduct.id
            ? currentEditSubProduct
            : subProduct
        )
      );
      setEditModalOpen(false); // Close the edit modal
      toast.success("SubProduct updated"); // Display success toast notification
    }
  };

  const handleDeleteClick = async (subProductId: string) => {
    setSubProducts((prevSubProducts) =>
      prevSubProducts.filter((subProduct) => subProduct.id !== subProductId)
    );
    try {
      await DeleteSubProduct(subProductId); // Call DeleteSubProduct function to delete the subproduct
      setOpenModal(false); // Close the delete confirmation modal
      toast.success("SubProduct Deleted"); // Display success toast notification
    } catch (error) {
      console.error("Error deleting subproduct:", error);
      // Handle error deleting subproduct
    }
  };

  const openDeleteModal = (subProduct: SubProduct) => {
    setSubProductIdToDelete(subProduct.id); // Set subProductIdToDelete to the ID of the subproduct to delete
    setSubProductNameToDelete(subProduct.sku); // Set subProductNameToDelete to the SKU of the subproduct to delete
    setOpenModal(true); // Open the delete confirmation modal
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {subProducts.map((subProduct) => (
        <div
          key={subProduct.id}
          className="flex flex-col space-y-4 border-b border-gray-300 pb-4 mb-4"
        >
          <div className="flex flex-row justify-between">
            <p>SKU: {subProduct.sku}</p>
            <p>Price: {subProduct.price}</p>
            <p>Stock: {subProduct.stock}</p>
            <p>Discount: {subProduct.discount}%</p>
            <p>Sold: {subProduct.sold}</p>
          </div>
          <div className="flex flex-row space-x-4">
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
          <div className="flex flex-row space-x-2">
            <button
              onClick={() => handleEditClick(subProduct)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => openDeleteModal(subProduct)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Delete confirmation modal */}
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete {subProductNameToDelete}?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handleDeleteClick(subProductIdToDelete)}
              >
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                {"No, cancel"}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Edit modal */}
      {currentEditSubProduct && (
        <Modal
          show={editModalOpen}
          size="md"
          onClose={() => setEditModalOpen(false)}
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="flex flex-col space-y-4">
              <div>
                <Label htmlFor="sku">SKU</Label>
                <TextInput
                  id="sku"
                  value={currentEditSubProduct.sku || ""}
                  onChange={(e) =>
                    setCurrentEditSubProduct({
                      ...currentEditSubProduct,
                      sku: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <TextInput
                  id="price"
                  type="number"
                  value={currentEditSubProduct.price || 0}
                  onChange={(e) =>
                    setCurrentEditSubProduct({
                      ...currentEditSubProduct,
                      price: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <TextInput
                  id="stock"
                  type="number"
                  value={currentEditSubProduct.stock || 0}
                  onChange={(e) =>
                    setCurrentEditSubProduct({
                      ...currentEditSubProduct,
                      stock: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="discount">Discount</Label>
                <TextInput
                  id="discount"
                  type="number"
                  value={currentEditSubProduct.discount || 0}
                  onChange={(e) =>
                    setCurrentEditSubProduct({
                      ...currentEditSubProduct,
                      discount: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button color="gray" onClick={() => setEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button color="success" onClick={handleSaveEdit}>
                  Save
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default SubProductsComponent;
