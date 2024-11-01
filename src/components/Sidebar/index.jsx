"use client";

import { useRouter } from "next/navigation";
import {
  HomeIcon,
  ChartBarIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  DocumentIcon,
  CogIcon,
} from "@heroicons/react/outline";

const SideBar = ({ activeMenuItem }) => {
  const router = useRouter();

  const handleMenuItemClick = (path) => {
    router.push(path);
  };

  return (
    <div className="w-64 bg-white shadow-md fixed top-0 left-0 h-full z-50 flex flex-col pb-6">
      {/* Logo */}
      <div className="pt-14 px-4">
        <img
          src="/Images/logo_aicoms.png"
          alt="AICOMS Logo"
          className="mb-2 w-48 mx-auto"
        />
        <hr className="border-black mt-10" />{" "}
        {/* Garis pembatas setelah logo */}
      </div>

      {/* Dashboard */}
      <div className="mt-2 px-4">
        <button
          onClick={() => handleMenuItemClick("/Dashboard")}
          className={`flex items-center px-6 py-3 w-full text-left hover:bg-gray-200 ${
            activeMenuItem === "dashboard" ? "bg-gray-200" : ""
          }`}
        >
          <HomeIcon className="h-5 w-5 mr-3" />
          <span className="text-gray-900">Dashboard</span>
        </button>
        <hr className="border-black  mt-2" />{" "}
        {/* Garis pembatas setelah Dashboard */}
      </div>

      {/* Imprest Fund */}
      <div className="mt-1 px-4">
        <button
          onClick={() => handleMenuItemClick("/Imprest")}
          className={`flex items-center px-6 py-3 w-full text-left hover:bg-gray-200 ${
            activeMenuItem === "imprest" ? "bg-gray-200" : ""
          }`}
        >
          <ArrowUpIcon className="h-5 w-5 mr-3" />
          <span className="text-gray-900">Imprest Fund</span>
        </button>
      </div>

      {/* Cash Money */}
      <div className="mt-1 px-4">
        <button
          onClick={() => handleMenuItemClick("/LabCash")}
          className={`flex items-center px-6 py-3 w-full text-left hover:bg-gray-200 ${
            activeMenuItem === "cashmoney" ? "bg-gray-200" : ""
          }`}
        >
          <ArrowDownIcon className="h-5 w-5 mr-3" />
          <span className="text-gray-900">Cash Money</span>
        </button>
        <hr className="border-black mt-1" />{" "}
        {/* Garis pembatas setelah Cash Money */}
      </div>

      {/* Debt */}
      <div className="mt-1 px-4">
        <button
          onClick={() => handleMenuItemClick("/Debt")}
          className={`flex items-center px-6 py-3 w-full text-left hover:bg-gray-200 ${
            activeMenuItem === "debt" ? "bg-gray-200" : ""
          }`}
        >
          <DocumentIcon className="h-5 w-5 mr-3" />
          <span className="text-gray-900">Debt</span>
        </button>
      </div>

      {/* Report */}
      <div className="mt-1 px-4">
        <button
          onClick={() => handleMenuItemClick("/Laporan")}
          className={`flex items-center px-6 py-3 w-full text-left hover:bg-gray-200 ${
            activeMenuItem === "report" ? "bg-gray-200" : ""
          }`}
        >
          <ChartBarIcon className="h-5 w-5 mr-3" />
          <span className="text-gray-900">Report</span>
        </button>
        <hr className="border-black  mt-1" />{" "}
        {/* Garis pembatas setelah Report */}
      </div>

      {/* Input Money */}
      <div className="mt-1 px-4">
        <button
          onClick={() => handleMenuItemClick("/Input")}
          className={`flex items-center px-6 py-3 w-full text-left hover:bg-gray-200 ${
            activeMenuItem === "inputmoney" ? "bg-gray-200" : ""
          }`}
        >
          <CogIcon className="h-5 w-5 mr-3" />
          <span className="text-gray-900">Input Money</span>
        </button>
        <hr className="border-black  mt-1" />{" "}
        {/* Garis pembatas setelah User Control */}
      </div>

      {/* User Control */}
      <div className="mt-1 px-4">
        <button
          onClick={() => handleMenuItemClick("/User")}
          className={`flex items-center px-6 py-3 w-full text-left hover:bg-gray-200 ${
            activeMenuItem === "usercontrol" ? "bg-gray-200" : ""
          }`}
        >
          <CogIcon className="h-5 w-5 mr-3" />
          <span className="text-gray-900">User Control</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
