"use client";

import { Avatar, Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiUser,
} from "react-icons/hi";
import { FaBoxes } from "react-icons/fa";
import { FaCodeBranch } from "react-icons/fa6";
import { TbCategory2 } from "react-icons/tb";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (session?.user.role !== "ADMIN") {
    return <div>Not authenticated</div>;
  }

  return (
    <>
      <Sidebar className="col-span-2 ">
        <Sidebar.Logo href="#" img="" imgAlt="brand logo">
          brand name
        </Sidebar.Logo>
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Avatar
              img={session?.user.image || ""}
              rounded
              className="justify-start"
            >
              <div className="space-y-1 dark:text-white">
                <div>Welcome Back,</div>
                <div className="font-medium">
                  {session?.user.name || "Admin"}
                </div>
              </div>
            </Avatar>
          </Sidebar.ItemGroup>

          <Sidebar.ItemGroup>
            <Sidebar.Item
              href="/dashboard"
              icon={HiChartPie}
              active={pathname === "/dashboard"}
            >
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item
              href="/dashboard/products"
              icon={FaBoxes}
              active={pathname === "/dashboard/products"}
            >
              Products
            </Sidebar.Item>
            <Sidebar.Collapse
              icon={HiShoppingBag}
              label="Categorization"
              open={true}
            >
              <Sidebar.Item
                href="/dashboard/categories"
                icon={TbCategory2}
                active={pathname === "/dashboard/categories"}
              >
                Categories
              </Sidebar.Item>
              <Sidebar.Item
                href="/dashboard/subcategories"
                icon={FaCodeBranch}
                active={pathname === "/dashboard/subcategories"}
              >
                SubCategories
              </Sidebar.Item>
            </Sidebar.Collapse>
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup>
            <Sidebar.Item
              href="/dashboard/users"
              icon={HiUser}
              active={pathname === "/dashboard/users"}
            >
              Users
            </Sidebar.Item>

            <Sidebar.Item href="#" icon={HiInbox}>
              Orders
            </Sidebar.Item>
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup>
            <Sidebar.Item href="#" icon={HiArrowSmRight}>
              Sign out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>

      <div className="pt-3 col-span-5 w-full">{children}</div>
    </>
  );
}
