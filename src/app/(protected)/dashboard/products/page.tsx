import AddProduct from "@/components/admin/Products/AddProduct";
import ListProducts from "@/components/admin/Products/ListProducts";
import "react-toastify/ReactToastify.min.css";
export default function Product() {
  return (
    <>
      <div>
        <div className="flex justify-center w-dvw">
          <AddProduct />
        </div>
        <div className="flex justify-center w-dvw pt-9">
          <ListProducts />
        </div>
      </div>
    </>
  );
}
