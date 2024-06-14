"use client";
import React, { useEffect, useState, useRef } from "react";
import GetCategories from "./GetCategories"; // Function to fetch categories from API
import { FaRegEdit, FaSave, FaTrash } from "react-icons/fa"; // Icons for edit, save, delete
import { Button, Modal } from "flowbite-react"; // Modal and button components from flowbite-react
import { HiOutlineExclamationCircle } from "react-icons/hi"; // Icon for delete confirmation
import DeleteCategory from "./DeleteCategory"; // Component to handle category deletion
import EditCategory from "./EditCategory"; // Component to handle category editing API calls
import { toast } from "react-toastify"; // Toast notifications library

// Interface for defining the structure of a Category
interface Category {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  name: string;
  description: string | null;
}

// Functional component ListCategories
const ListCategories: React.FC = () => {
  // State variables
  const [editId, setEditId] = useState<string | null>(null); // Track currently editing category ID
  const [categoriesObject, setCategoriesObject] = useState<Category[]>([]); // Array of categories fetched from API
  const [editedName, setEditedName] = useState<string>(""); // Edited name of the category
  const [openModal, setOpenModal] = useState(false); // Control modal visibility for delete confirmation
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<string>(""); // ID of category to delete
  const [categoryNameToDelete, setCategoryNameToDelete] = useState<string>(""); // Name of category to delete
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const editInputRef = useRef<HTMLInputElement>(null); // Ref for the edit input field

  // State to track whether in edit mode or not
  const [isEditing, setIsEditing] = useState(false);

  // Effect to fetch categories when component mounts
  useEffect(() => {
    setIsLoading(true); // Set loading state to true before fetching

    GetCategories()
      .then((categories) => {
        // Ensure that each category has a description property
        const categoriesWithDescription = categories.map((category: any) => ({
          ...category,
          description: category.description ?? null,
        }));
        setCategoriesObject(categoriesWithDescription);
        setIsLoading(false); // Set loading state to false after fetching
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setIsLoading(false); // Set loading state to false in case of error
        // Handle error fetching categories
      });
  }, []);

  // Effect to focus on the input field when entering edit mode
  useEffect(() => {
    if (editId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editId]);

  // Function to handle clicking on the edit button
  const handleEditClick = (category: Category) => {
    setEditId(category.id); // Set editId to the ID of the category being edited
    setEditedName(category.name); // Set editedName to the current name of the category
    setIsEditing(true); // Set isEditing to true to indicate entering edit mode
  };

  // Function to handle saving changes after editing
  const handleSaveClick = async (categoryId: string, editedName: string) => {
    // Perform validation if necessary before saving
    if (editedName.trim() === "") {
      alert("Category name cannot be empty");
      return;
    }

    try {
      // Call EditCategory function to update category name
      await EditCategory(categoryId, editedName);

      // Update the category in categoriesObject after successful update
      setCategoriesObject((prevCategories) =>
        prevCategories.map((category) =>
          category.id === categoryId
            ? { ...category, name: editedName }
            : category
        )
      );
      toast.success("Category Updated"); // Display success toast notification
      // Reset edit mode
      setEditId(null); // Exit edit mode
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error editing category:", error);
      // Handle error editing category
    }
  };

  // Function to handle canceling the edit process
  const handleCancelEdit = () => {
    setEditId(null); // Reset editId to null
    setIsEditing(false); // Exit edit mode
  };

  // Function to handle clicking on the delete button
  const handleDeleteClick = async (categoryId: string) => {
    setCategoriesObject((prevCategories) =>
      prevCategories.filter((category) => category.id !== categoryId)
    );
    try {
      await DeleteCategory(categoryId); // Call DeleteCategory function to delete the category
      setOpenModal(false); // Close the delete confirmation modal
      toast.success("Category Deleted"); // Display success toast notification
    } catch (error) {
      console.error("Error deleting category:", error);
      // Handle error deleting category
    }
  };

  // Function to open the delete confirmation modal
  const openDeleteModal = (category: Category) => {
    setCategoryIdToDelete(category.id); // Set categoryIdToDelete to the ID of the category to delete
    setCategoryNameToDelete(category.name); // Set categoryNameToDelete to the name of the category to delete
    setOpenModal(true); // Open the delete confirmation modal
  };

  // JSX returned by the component
  return (
    <>
      {/* Render loading indicator if categories are loading */}
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

      {/* Render the list of categories if not loading */}
      {!isLoading && (
        <>
          <ul className="space-y-4 p-4">
            {categoriesObject.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg transition-transform transform hover:scale-105 hover:shadow-lg dark:bg-gray-800 dark:text-white"
              >
                {/* Render input field if in edit mode, otherwise render category name */}
                {editId === category.id ? (
                  <div className="flex-1">
                    <input
                      ref={editInputRef} // Reference to the input element
                      type="text"
                      value={editedName}
                      className="bg-gray-100 p-2 rounded-lg flex-1 dark:bg-gray-700"
                      onChange={(e) => setEditedName(e.target.value)}
                    />
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleSaveClick(category.id, editedName)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaSave size={20} />
                      </button>
                      <button
                        onClick={handleCancelEdit} // Call handleCancelEdit to cancel editing
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="flex-1">{category.name}</span>
                    {/* Render edit and delete buttons */}
                    <div className="ml-4 flex space-x-2">
                      <button
                        onClick={() => handleEditClick(category)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaRegEdit size={20} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(category)}
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
                  Are you sure you want to delete {categoryNameToDelete}?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button
                    color="failure"
                    onClick={() => handleDeleteClick(categoryIdToDelete)}
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

export default ListCategories;
