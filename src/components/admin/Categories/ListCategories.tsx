"use client";
import React, { useEffect, useState, useRef } from "react";
import { GetCategories } from "./GetCategories"; // Function to fetch categories from API
import { FaRegEdit, FaSave, FaTrash } from "react-icons/fa"; // Icons for edit, save, delete
import { Button, Modal } from "flowbite-react"; // Modal and button components from flowbite-react
import { HiOutlineExclamationCircle } from "react-icons/hi"; // Icon for delete confirmation
import DeleteSubCategory from "./DeleteCategory"; // Component to handle subcategory deletion
import EditSubCategory from "./EditCategory"; // Function to handle subcategory editing API calls
import { toast } from "react-toastify"; // Toast notifications library
import { ProductCategory } from "@prisma/client";

// Interface for defining the structure of a SubCategory

const ListsCategories: React.FC = () => {
  const [editId, setEditId] = useState<string | null>(null);
  const [mainCategories, setMainCategories] = useState<ProductCategory[]>([]);
  const [editedName, setEditedName] = useState<string>("");
  const [editedMainCategoryId, setEditedMainCategoryId] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);
  const [subcategoryIdToDelete, setSubcategoryIdToDelete] =
    useState<string>("");
  const [subcategoryNameToDelete, setSubcategoryNameToDelete] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [categoriesObject, setCategoriesObject] = useState<ProductCategory[]>(
    []
  );

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const productCategories = await GetCategories();
      setCategoriesObject(productCategories); // Update state with fetched data
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [editId]); // Trigger fetchCategories when editId changes

  const handleEditClick = (productCategory: ProductCategory) => {
    setEditId(productCategory.id);
    setEditedName(productCategory.categoryName);
    setEditedMainCategoryId(productCategory.parentCategoryId ?? "");
  };

  const handleSaveClick = async (
    productCategoryId: string,
    editedName: string,
    editedParentCategoryId: string
  ) => {
    try {
      if (editedName.trim() === "") {
        toast.error("SubCategory name cannot be empty");
        return;
      }

      const result = await EditSubCategory(
        productCategoryId,
        editedName,
        editedParentCategoryId
      );

      if (result.success) {
        toast.success("SubCategory Updated");
        setEditId(null); // Exit edit mode
      } else {
        toast.error(result.error ?? "Failed to update SubCategory");
      }
    } catch (error) {
      console.error("Error editing SubCategory:", error);
      toast.error("Failed to update SubCategory");
    } finally {
      window.location.reload();
    }
  };

  const handleCancelEdit = () => {
    setEditId(null); // Reset edit state
  };

  const handleDeleteClick = async (ProductCategoryId: string) => {
    try {
      const categoryToDelete = categoriesObject.find(
        (cat) => cat.id === ProductCategoryId
      );

      if (!categoryToDelete) {
        toast.error("Category not found");
        return;
      }

      if (categoryToDelete.hasSubcategories) {
        toast.error("Cannot delete category with subcategories");
        return;
      }

      await DeleteSubCategory(ProductCategoryId);

      setOpenModal(false); // Close delete confirmation modal
      toast.success("Category Deleted");
    } catch (error) {
      console.error("Error deleting SubCategory:", error);
      toast.error("Failed to delete SubCategory");
    } finally {
      window.location.reload();
    }
  };

  const openDeleteModal = (productCategory: ProductCategory) => {
    setSubcategoryIdToDelete(productCategory.id);
    setSubcategoryNameToDelete(productCategory.categoryName);
    setOpenModal(true);
  };

  const renderCategories = (
    categories: ProductCategory[],
    parentId: string | null = null
  ) => {
    const filteredCategories = categories.filter(
      (category) => category.parentCategoryId === parentId
    );

    if (filteredCategories.length === 0) {
      return null;
    }

    return (
      <ul className="space-y-4 p-4">
        {filteredCategories.map((productCategory) => (
          <li
            key={productCategory.id}
            className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg transition-transform transform hover:scale-105 hover:shadow-lg dark:bg-gray-800 dark:text-white"
          >
            {editId === productCategory.id ? (
              <div className="flex-1">
                <input
                  ref={editInputRef}
                  type="text"
                  value={editedName}
                  className="bg-gray-100 p-2 rounded-lg flex-1 dark:bg-gray-700"
                  onChange={(e) => setEditedName(e.target.value)}
                />
                <select
                  value={editedMainCategoryId}
                  onChange={(e) => setEditedMainCategoryId(e.target.value)}
                  className="bg-gray-100 p-2 rounded-lg mt-2 dark:bg-gray-700"
                >
                  {mainCategories.map((mainCategory) => (
                    <option key={mainCategory.id} value={mainCategory.id}>
                      {mainCategory.categoryName}
                    </option>
                  ))}
                </select>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() =>
                      handleSaveClick(
                        productCategory.id,
                        editedName,
                        editedMainCategoryId
                      )
                    }
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaSave size={20} />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className="flex-1">{productCategory.categoryName}</span>
                <div className="ml-4 flex space-x-2">
                  <button
                    onClick={() => handleEditClick(productCategory)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaRegEdit size={20} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(productCategory)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              </>
            )}
            {renderCategories(categories, productCategory.id)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
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

      {!isLoading && renderCategories(categoriesObject)}

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
              Are you sure you want to delete {subcategoryNameToDelete}?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handleDeleteClick(subcategoryIdToDelete)}
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
  );
};

export default ListsCategories;
