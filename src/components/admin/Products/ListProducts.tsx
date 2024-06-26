"use client";
import React, { useEffect, useState } from "react";
import GetProducts from "./GetProducts"; // Function to fetch products from API
import { FaRegEdit, FaTrash } from "react-icons/fa"; // Icons for edit, save, delete
import { IoMdAddCircleOutline } from "react-icons/io"; // Icon for add product
import { Button, Modal } from "flowbite-react"; // Modal and button components from flowbite-react
import { HiOutlineExclamationCircle } from "react-icons/hi"; // Icon for delete confirmation
import DeleteProduct from "./DeleteProduct"; // Component to handle product deletion
import { toast } from "react-toastify"; // Toast notifications library
import { Product } from "@prisma/client";
import GetProductCategory from "./GetProductCategory";
import GetProductSubCategory from "./SubProducts/GetProductSubCategory";
import SubProducts from "./SubProducts/ListSubProducts";
import Link from "next/link";

// Functional component ListProducts
const ListProducts: React.FC = () => {
  // State variables
  const [ProductsObject, setProductsObject] = useState<Product[]>([]); // Array of products fetched from API
  const [openModal, setOpenModal] = useState(false); // Control modal visibility for delete confirmation
  const [productIdToDelete, setProductIdToDelete] = useState<string>(""); // ID of product to delete
  const [productNameToDelete, setProductNameToDelete] = useState<string>(""); // Name of product to delete
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Effect to fetch products when component mounts
  useEffect(() => {
    setIsLoading(true); // Set loading state to true before fetching

    GetProducts()
      .then((products) => {
        // Ensure that each product has a description property
        const productsWithDescription = products.map((product: any) => ({
          ...product,
          description: product.description ?? null,
        }));
        setProductsObject(productsWithDescription);
        setIsLoading(false); // Set loading state to false after fetching
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setIsLoading(false); // Set loading state to false in case of error
        // Handle error fetching products
      });
  }, []);

  // Function to handle clicking on the edit button
  const handleEditClick = async (product: Product) => {
    //TODO: Handle edit click
  };

  const handleAddClick = async (product: Product) => {};

  // Function to handle clicking on the delete button
  const handleDeleteClick = async (productId: string) => {
    setProductsObject((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
    try {
      await DeleteProduct(productId); // Call DeleteProduct function to delete the product
      setOpenModal(false); // Close the delete confirmation modal
      toast.success("Product Deleted"); // Display success toast notification
    } catch (error) {
      console.error("Error deleting product:", error);
      // Handle error deleting product
    }
  };

  // Function to open the delete confirmation modal
  const openDeleteModal = (product: Product) => {
    setProductIdToDelete(product.id); // Set productIdToDelete to the ID of the product to delete
    setProductNameToDelete(product.name); // Set productNameToDelete to the name of the product to delete
    setOpenModal(true); // Open the delete confirmation modal
  };

  // JSX returned by the component
  return (
    <>
      {/* Render loading indicator if products are loading */}
      {isLoading && (
        <div className="text-center">
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {/* Render the list of products if not loading */}
      {!isLoading && (
        <>
          <ul className="space-y-4 p-10 flex justify-center w-dvw flex-col">
            {ProductsObject.map((product) => (
              <li
                key={product.id}
                className="p-4 w-10/12 bg-white shadow-md rounded-lg transition-transform transform hover:scale-105 hover:shadow-lg dark:bg-gray-800 dark:text-white"
              >
                {
                  <>
                    <span className="flex-1">{product.name}</span>
                    {/* Render edit and delete buttons */}
                    <div className="mt-4  flex flex-row-reverse space-x-2">
                      <button
                        onClick={() => openDeleteModal(product)}
                        className="text-red-500 hover:text-red-700 "
                      >
                        <FaTrash size={20} />
                      </button>

                      <button
                        onClick={() => handleEditClick(product)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaRegEdit size={20} />
                      </button>
                      <Link
                        href={{
                          pathname: "/dashboard/subproducts",
                          query: { id: product.id },
                        }}
                        className="text-green-500 hover:green-700 "
                      >
                        <IoMdAddCircleOutline size={20} />
                      </Link>
                    </div>
                    {/* Render product details */}
                    <ul className="list-none pl-6 flex flex-col ">
                      <li>Description: {product.description}</li>
                      <li>
                        Category:{" "}
                        <GetProductCategory
                          productCategoryId={product.categoryId}
                        />
                      </li>
                      <li>
                        SubCategory:{" "}
                        <GetProductSubCategory
                          productsubCategoryId={product.subCategoryId}
                        />
                      </li>
                      <li className="grid">
                        <SubProducts ProductId={product.id} />
                      </li>
                    </ul>
                  </>
                }
              </li>
            ))}
          </ul>

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
                  Are you sure you want to delete {productNameToDelete}?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button
                    color="failure"
                    onClick={() => handleDeleteClick(productIdToDelete)}
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
        </>
      )}
    </>
  );
};

export default ListProducts;
