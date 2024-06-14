"use client";
import * as im from "@/../public/1.jpg";
import { Carousel, Card } from "flowbite-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid h-full pt-9 ">
      <Carousel pauseOnHover className="h-80">
        <Image src={im} alt="..." height={800} width={800} quality={100} />
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
      {/* featured */}
      <div className="grid">
        <Card
          className="max-w-sm"
          imgAlt="Apple Watch Series 7 in colors pink, silver, and black"
          imgSrc="https://flowbite.com/docs/images/carousel/carousel-5.svg"
        >
          <a href="#">
            <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Apple Watch Series 7 GPS, Aluminium Case, Starlight Sport
            </h5>
          </a>

          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              $599
            </span>
            <a
              href="#"
              className="rounded-lg bg-cyan-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
            >
              Add to cart
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
