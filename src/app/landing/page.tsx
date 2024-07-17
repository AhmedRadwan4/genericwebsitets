"use client";
import { useDispatch, useSelector } from "react-redux";
import { addItem, deleteItem } from "../../redux/slices/cartslice";
import { Carousel, Card } from "flowbite-react";
import Image from "next/image";
import { RootState } from "../../redux/store"; // Adjust the path to your store
// Define the Product type

export default function Home() {
  //   const cart = useSelector((state: RootState) => state.cart.cart) || [];
  //   const allIds = cart.map((item: Product) => item.id);
  //   console.log(cart);
  //   const dispatch = useDispatch();

  //   const handleAddToCart = (product: Product) => {
  //     dispatch(addItem(product));
  //   };

  //   const handleDelete = (product: Product) => {
  //     dispatch(deleteItem(product.id));
  //   };

  return (
    <div className="grid h-full pt-9 ">
      <Carousel pauseOnHover className="h-80">
        <Image
          src="/../../public/1.jpg"
          alt="..."
          height={800}
          width={800}
          quality={100}
        />
        <Image
          src="https://flowbite.com/docs/images/carousel/carousel-2.svg"
          alt="..."
          height={300}
          width={50}
        />
        <Image
          src="https://flowbite.com/docs/images/carousel/carousel-3.svg"
          alt="..."
          height={300}
          width={50}
        />
        <Image
          src="https://flowbite.com/docs/images/carousel/carousel-4.svg"
          alt="..."
          height={300}
          width={50}
        />
        <Image
          src="https://flowbite.com/docs/images/carousel/carousel-5.svg"
          alt="..."
          height={300}
          width={50}
        />
      </Carousel>

      {/* <div className="grid w-[90%] mx-auto grid-cols-3">
        {products.map((product) => (
          <Card
            key={product.id}
            className="max-w-sm mb-5"
            imgAlt={product.title}
            imgSrc={product.imgSrc}
          >
            <a href="#">
              <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {product.title}
              </h5>
            </a>

            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {product.price}
              </span>

              {allIds.includes(product.id) ? (
                <a
                  href="#"
                  className="rounded-lg bg-cyan-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                  onClick={() => handleDelete(product)}
                >
                  Delete
                </a>
              ) : (
                <a
                  href="#"
                  className="rounded-lg bg-cyan-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to cart
                </a>
              )}
            </div>
          </Card>
        ))}
      </div> */}
    </div>
  );
}
