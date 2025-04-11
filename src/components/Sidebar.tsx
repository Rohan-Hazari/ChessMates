import Link from "next/link";
import React, { ReactNode } from "react";
import { Home, Users2, UserCheckIcon, Info } from "lucide-react";
import { Button } from "./ui/Button";

const Sidebar = () => {
  return (
    <>
      <div className="bg-transparent backdrop-blur-sm z-10 fixed top-16 sm:top-34 left-0 h-screen w-12 lg:w-28 lg:w-30 flex flex-col  rounded-sm border-r shadow-md">
        <Link href="/">
          <SideBarIcon icon={<Home />} label="Home" />
        </Link>
        <Link href="/">
          <SideBarIcon icon={<Users2 />} label=" Communities" />
        </Link>
        <Link href="/">
          <SideBarIcon icon={<UserCheckIcon />} label="Settings" />
        </Link>
        <Link href="/">
          <SideBarIcon icon={<Info />} label="About Us" />
        </Link>
      </div>
    </>
  );
};

const SideBarIcon = ({ icon, label }: { icon: ReactNode; label: string }) => {
  return (
    <Button variant="ghost" type="button" className="sidebar-icon group">
      <div className="flex justify-center sm:justify-start items-center w-full mr-2 ">
        <div className="sm:text-2xl">{icon}</div>
      </div>
      <span className=" text-zinc-700 whitespace-nowrap sidebar-tooltip group-hover:scale-100 lg:scale-100 scale-0  ">
        {label}
      </span>
    </Button>
  );
};

export default Sidebar;
