import CreateCategory from "@/components/admin/Cateogry/CreateCategory";
import ListCategories from "@/components/admin/Cateogry/ListCategory";

export default function Categories() {
  return (
    <>
      <div className="flex flex-col">
        <div className="">
          <CreateCategory />
        </div>
        <div className="">
          <ListCategories />
        </div>
      </div>
    </>
  );
}
