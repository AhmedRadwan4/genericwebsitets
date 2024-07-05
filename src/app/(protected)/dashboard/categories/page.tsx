import AddCategory from "@/components/admin/Categories/AddCategory";
import ListCategory from "@/components/admin/Categories/ListCategories";

export default function Categories() {
  return (
    <>
      <div className="flex flex-col">
        <div className="">
          <AddCategory />
        </div>
        <div className="">
          <ListCategory />
        </div>
      </div>
    </>
  );
}
