import CreateSubCategory from "@/components/admin/SubCategory/CreateSubCategory";
import ListSubCategory from "@/components/admin/SubCategory/ListSubCategory";

export default function Categories() {
  return (
    <>
      <div className="flex flex-col">
        <div className="">
          <CreateSubCategory />
        </div>
        <div className="">
          <ListSubCategory />
        </div>
      </div>
    </>
  );
}
