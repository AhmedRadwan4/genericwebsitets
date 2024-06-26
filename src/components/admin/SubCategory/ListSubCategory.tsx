"use client";
import React, { useEffect, useState, useRef } from "react";
import { GetSubCategories } from "./GetSubCategories"; // Function to fetch subcategories from API
import { GetCategories } from "../Cateogry/GetCategories"; // Function to fetch categories from API
import { FaRegEdit, FaSave, FaTrash } from "react-icons/fa"; // Icons for edit, save, delete
import { Button, Modal } from "flowbite-react"; // Modal and button components from flowbite-react
import { HiOutlineExclamationCircle } from "react-icons/hi"; // Icon for delete confirmation
import DeleteSubCategory from "./DeleteSubCategory"; // Component to handle subcategory deletion
import EditSubCategory from "./EditSubCategory"; // Function to handle subcategory editing API calls
import { toast } from "react-toastify"; // Toast notifications library
import { useSubCategoryContext } from "./SubCategoryProvider"; // Adjust the path accordingly

// Interface for defining the structure of a SubCategory
interface SubCategory {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  name: string;
  description: string | null;
  mainCategoryId: string;
}

interface MainCategory {
  id: string;
  name: string;
}

const ListsSubCategories: React.FC = () => {
  const { refresh } = useSubCategoryContext();
  const [editId, setEditId] = useState<string | null>(null);
  const [subcategoriesObject, setSubCategoriesObject] = useState<SubCategory[]>(
    []
  );
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [editedName, setEditedName] = useState<string>("");
  const [editedMainCategoryId, setEditedMainCategoryId] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);
  const [subcategoryIdToDelete, setSubcategoryIdToDelete] =
    useState<string>("");
  const [subcategoryNameToDelete, setSubcategoryNameToDelete] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const editInputRef = useRef<HTMLInputElement>(null);

  const fetchSubCategories = async () => {
    setIsLoading(true);
    try {
      const subCategories = await GetSubCategories();
      const categoriesWithDescription = subCategories.map(
        (subcategory: any) => ({
          ...subcategory,
          description: subcategory.description ?? null,
        })
      );
      setSubCategoriesObject(categoriesWithDescription);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setIsLoading(false);
    }
  };

  const fetchMainCategories = async () => {
    try {
      const mainCategories = await GetCategories();
      setMainCategories(mainCategories);
    } catch (error) {
      console.error("Error fetching main categories:", error);
    }
  };

  useEffect(() => {
    fetchSubCategories();
    fetchMainCategories();
  }, [refresh]);

  useEffect(() => {
    if (editId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editId]);

  const handleEditClick = (subcategory: SubCategory) => {
    setEditId(subcategory.id);
    setEditedName(subcategory.name);
    setEditedMainCategoryId(subcategory.mainCategoryId);
  };

  const handleSaveClick = async (
    subcategoryId: string,
    editedName: string,
    editedMainCategoryId: string
  ) => {
    try {
      if (editedName.trim() === "") {
        toast.error("SubCategory name cannot be empty");
        return;
      }

      const result = await EditSubCategory(
        subcategoryId,
        editedName,
        editedMainCategoryId
      );

      if (result.success) {
        // Update subcategoriesObject with updated data
        setSubCategoriesObject((prevSubCategories) =>
          prevSubCategories.map((subcategory) =>
            subcategory.id === subcategoryId
              ? {
                  ...subcategory,
                  name: editedName,
                  mainCategoryId: editedMainCategoryId,
                }
              : subcategory
          )
        );

        toast.success("SubCategory Updated");
        setEditId(null); // Exit edit mode
      } else {
        toast.error(result.error ?? "Failed to update SubCategory");
      }
    } catch (error) {
      console.error("Error editing SubCategory:", error);
      toast.error("Failed to update SubCategory");
    }
  };

  const handleCancelEdit = () => {
    setEditId(null); // Reset edit state
  };

  const handleDeleteClick = async (subcategoryId: string) => {
    try {
      // Remove subcategory from local state
      setSubCategoriesObject((prevSubCategories) =>
        prevSubCategories.filter(
          (subcategory) => subcategory.id !== subcategoryId
        )
      );

      // Call delete function
      await DeleteSubCategory(subcategoryId);

      setOpenModal(false); // Close delete confirmation modal
      toast.success("SubCategory Deleted");
    } catch (error) {
      console.error("Error deleting SubCategory:", error);
      toast.error("Failed to delete SubCategory");
    }
  };

  const openDeleteModal = (subcategory: SubCategory) => {
    setSubcategoryIdToDelete(subcategory.id);
    setSubcategoryNameToDelete(subcategory.name);
    setOpenModal(true);
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

      {!isLoading && (
        <>
          <ul className="space-y-4 p-4">
            {subcategoriesObject.map((subcategory) => (
              <li
                key={subcategory.id}
                className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg transition-transform transform hover:scale-105 hover:shadow-lg dark:bg-gray-800 dark:text-white"
              >
                {editId === subcategory.id ? (
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
                          {mainCategory.name}
                        </option>
                      ))}
                    </select>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() =>
                          handleSaveClick(
                            subcategory.id,
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
                    <span className="flex-1">{subcategory.name}</span>
                    <div className="ml-4 flex space-x-2">
                      <button
                        onClick={() => handleEditClick(subcategory)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaRegEdit size={20} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(subcategory)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash size={20} />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>

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
      )}
    </>
  );
};

export default ListsSubCategories;
