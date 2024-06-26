import AddProduct from "@/components/admin/Products/AddProduct";
import ListProducts from "@/components/admin/Products/ListProducts";
import "react-toastify/ReactToastify.min.css";
export default function Categories() {
  return (
    <>
      <div className="flex justify-center w-dvw">
        <AddProduct></AddProduct>
      </div>
      <div className="flex justify-center w-dvw pt-9">
        <ListProducts></ListProducts>
      </div>
    </>
  );
}
