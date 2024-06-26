import AddCategory from "@/components/admin/Cateogry/AddCategory";
import ListCategories from "@/components/admin/Cateogry/ListCategory";

export default function Categories() {
  return (
    <>
      <div className="block w-full">
        <AddCategory />
      </div>
      <div className="">
        <ListCategories />
      </div>
    </>
  );
}
