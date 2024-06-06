"use client";

import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { useSession } from "next-auth/react";
import { signOut } from "@/auth";

export default function Header() {
  const { data: session, status } = useSession();
  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="https://flowbite-react.com">
        logo
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          name
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
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
            <span className="block text-sm">{session?.user.name}</span>
            <span className="block truncate text-sm font-medium">
              {session?.user.email}
            </span>
          </Dropdown.Header>
          <Dropdown.Item>Dashboard</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Item>Earnings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>
            <button onClick={() => signOut({ redirectTo: "/auth/login" })}>
              Sign out
            </button>
          </Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="#">Home</Navbar.Link>
        <Navbar.Link href="#">About</Navbar.Link>
        <Navbar.Link href="#">Services</Navbar.Link>
        <Navbar.Link href="#">Pricing</Navbar.Link>
        <Navbar.Link href="#">Contact</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
