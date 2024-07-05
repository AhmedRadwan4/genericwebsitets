"use client";
import React, { useEffect, useState } from "react";
import { FaRegEdit, FaSave, FaTrash } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { GetVariations } from "./GetVariations";
import { GetCategory } from "../Categories/GetCategories";
import { Variation } from "@prisma/client";
import { CreateVariationOption } from "./CreateVariationOption";
import { GetVariationOption } from "./GetVariationOptions";

const ListVariations: React.FC = () => {
  const [variationsObject, setVariationsObject] = useState<Variation[]>([]);
  const [categoryNames, setCategoryNames] = useState<{ [key: string]: string }>(
    {}
  );
  const [parentCategoryNames, setParentCategoryNames] = useState<{
    [key: string]: string;
  }>({});
  const [openModal, setOpenModal] = useState(false);
  const [variationIdToDelete, setVariationIdToDelete] = useState<string>("");
  const [variationNameToDelete, setVariationNameToDelete] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingVariation, setEditingVariation] = useState<Variation | null>(
    null
  );
  const [newVariationName, setNewVariationName] = useState<string>("");
  const [isAdding, setIsAdding] = useState<string | null>(null);
  const [valueName, setValueName] = useState<string>("");
  const [variationOptions, setVariationOptions] = useState<{
    [key: string]: string[];
  }>({});

  // Update the setVariationOptions to store the variation option names
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const variations = await GetVariations();
        setVariationsObject(variations);

        const categories = await Promise.all(
          variations.map(async (variation) => {
            if (variation.categoryId) {
              const category = await GetCategory(variation.categoryId);
              const parentCategory = await GetCategory(
                category?.parentCategoryId || ""
              );

              return { category, parentCategory };
            } else {
              return { category: null, parentCategory: null };
            }
          })
        );

        const categoryMap = categories.reduce((acc, { category }) => {
          if (category) {
            acc[category.id] = category.categoryName;
          }
          return acc;
        }, {} as { [key: string]: string });

        setCategoryNames(categoryMap);

        const parentCategoryMap = categories.reduce(
          (acc, { category, parentCategory }) => {
            if (category && parentCategory) {
              acc[category.id] = parentCategory.categoryName;
            }
            return acc;
          },
          {} as { [key: string]: string }
        );

        setParentCategoryNames(parentCategoryMap);

        const optionsMap = await Promise.all(
          variations.map(async (variation) => {
            const options = await GetVariationOption(variation.id);
            return { [variation.id]: options.map((option) => option.value) };
          })
        );

        setVariationOptions(Object.assign({}, ...optionsMap));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddingClick = (variation: Variation) => {
    setIsAdding(variation.id);
  };

  const handleAddSaveClick = async () => {
    if (isAdding) {
      await CreateVariationOption(valueName, isAdding);
      // Refresh variations after adding a new option
      const variations = await GetVariations();
      setVariationsObject(variations);
      setIsAdding(null);
      setValueName("");
    }
  };

  const handleAddCancelClick = () => {
    setIsAdding(null);
    setValueName("");
  };

  const handleEditClick = (variation: Variation) => {
    setEditingVariation(variation);
    setNewVariationName(variation.name);
  };

  const handleSaveClick = async () => {
    if (editingVariation) {
      // Save the edited variation
      // Example: await saveVariation(editingVariation.id, newVariationName);
      setEditingVariation(null);
    }
  };

  const handleCancelEditClick = () => {
    setEditingVariation(null);
    setNewVariationName("");
  };

  const handleDeleteClick = async (variationId: string) => {
    // Handle delete logic
  };

  const openDeleteModal = (variation: Variation) => {
    setVariationIdToDelete(variation.id || ""); // Ensure variation.id is not null/undefined
    setVariationNameToDelete(variation.name || ""); // Ensure variation.name is not null/undefined
    setOpenModal(true);
  };

  const groupedVariations = variationsObject.reduce((groups, variation) => {
    const category =
      categoryNames[variation.categoryId] || variation.categoryId || "";
    const parentCategory = parentCategoryNames[variation.categoryId] || "";

    if (!groups[parentCategory]) {
      groups[parentCategory] = {};
    }

    if (!groups[parentCategory][category]) {
      groups[parentCategory][category] = [];
    }

    groups[parentCategory][category].push(variation);
    return groups;
  }, {} as { [key: string]: { [key: string]: Variation[] } });

  return (
    <>
      {isLoading && (
        <div className="text-center">
          <div role="status">{/* Loading indicator */}</div>
        </div>
      )}

      {!isLoading && (
        <>
          {Object.entries(groupedVariations).map(
            ([parentCategory, categories], index) => (
              <div key={parentCategory} className="mb-6">
                <h2 className="text-xl font-bold mb-4">
                  <hr className="my-4 border-gray-300 border-t-2" />

                  {parentCategory || "Uncategorized"}
                </h2>

                {Object.entries(categories).map(
                  ([category, variations], subIndex) => (
                    <div key={category} className="mb-6 ml-4">
                      {subIndex > 0 && <hr className="my-4 border-gray-300" />}
                      <h3 className="text-lg font-semibold mb-2">{category}</h3>
                      <ul className="space-y-4 p-10 flex justify-center w-full flex-col">
                        {variations.map((variation) => (
                          <li
                            key={variation.id}
                            className="p-4 w-10/12 bg-white shadow-md rounded-lg transition-transform transform hover:shadow-lg dark:bg-gray-800 dark:text-white"
                          >
                            <div className="flex justify-between items-center">
                              {editingVariation?.id === variation.id ? (
                                <input
                                  type="text"
                                  value={newVariationName}
                                  onChange={(e) =>
                                    setNewVariationName(e.target.value)
                                  }
                                  className="flex-1 mr-4"
                                />
                              ) : (
                                <div className="flex-1">
                                  <span>{variation.name}</span>
                                  {variationOptions[variation.id] &&
                                    variationOptions[variation.id].length >
                                      0 && (
                                      <div className="mt-2 text-gray-600 dark:text-gray-400">
                                        Options:{" "}
                                        {variationOptions[variation.id].join(
                                          ", "
                                        )}
                                      </div>
                                    )}
                                </div>
                              )}
                              <div className="mt-4 flex flex-row-reverse space-x-2">
                                {editingVariation?.id === variation.id ? (
                                  <>
                                    <button
                                      onClick={handleSaveClick}
                                      className="text-green-500 hover:text-green-700"
                                    >
                                      <FaSave size={30} />
                                    </button>
                                    <button
                                      onClick={handleCancelEditClick}
                                      className="text-gray-500 hover:text-gray-700"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => openDeleteModal(variation)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <FaTrash size={20} />
                                    </button>

                                    <button
                                      onClick={() => handleEditClick(variation)}
                                      className="text-blue-500 hover:text-blue-700"
                                    >
                                      <FaRegEdit size={20} />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleAddingClick(variation)
                                      }
                                      className="text-green-500 hover:text-green-700"
                                    >
                                      <IoMdAddCircleOutline size={20} />
                                    </button>
                                    {isAdding === variation.id && (
                                      <div className="mt-4">
                                        <input
                                          type="text"
                                          value={valueName}
                                          onChange={(e) =>
                                            setValueName(e.target.value)
                                          }
                                          placeholder="Enter value name"
                                          className="mr-2"
                                        />
                                        <button
                                          onClick={handleAddSaveClick}
                                          className="text-green-500 hover:text-green-700"
                                        >
                                          <FaSave size={30} />
                                        </button>
                                        <button
                                          onClick={handleAddCancelClick}
                                          className="text-gray-500 hover:text-gray-700"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            )
          )}

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
                  Are you sure you want to delete {variationNameToDelete}?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button
                    color="failure"
                    onClick={() => handleDeleteClick(variationIdToDelete)}
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

export default ListVariations;
