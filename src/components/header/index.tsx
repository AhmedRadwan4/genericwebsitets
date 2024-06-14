"use client";

import { RxHamburgerMenu } from "react-icons/rx";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { useSession } from "next-auth/react";
import { signOut } from "@/auth";

export default function Header() {
  const { data: session, status } = useSession();
  return (
    <Navbar fluid rounded className="justify-between h-14 ">
      <div className="flex flex-row-reverse md:order-3 w-1/6 ">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User settings"
              img={session?.user.image || ""}
              rounded
            />
          }
        >
          <Dropdown.Header>
            <span className="block truncate text-sm font-medium">
              Hello,{session?.user.name || "Guest"}
            </span>
          </Dropdown.Header>
          <Dropdown.Item>Orders</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>
            <button onClick={() => signOut({ redirectTo: "/auth/login" })}>
              Sign out
            </button>
          </Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <div className="md:order-1 w-1/6">
        <Navbar.Collapse>
          <Navbar.Link href="#" className="flex">
            <RxHamburgerMenu className="align-middle" />
            Products
          </Navbar.Link>
        </Navbar.Collapse>
      </div>
      <Navbar.Brand
        href="https://flowbite-react.com"
        className="md:order-2 w-4/6 justify-center"
      >
        logo
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          name
        </span>
      </Navbar.Brand>
    </Navbar>
  );
}
