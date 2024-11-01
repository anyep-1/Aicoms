import React, { useEffect, useState } from "react";
import { UserIcon } from "@heroicons/react/solid";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const ButtonProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    router.push("/Login");
    Cookies.remove("user");
    setUserName("");
  };

  const handleProfile = () => {
    console.log("Profile");
  };

  useEffect(() => {
    const user = JSON.parse(Cookies.get("user"));
    if (user) {
      setUserName(user.data.name);
    }
  }, []);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleMenu}
        className="inline-flex items-center justify-center w-full rounded-full border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-black hover:bg-gray-100 focus:outline-none transition-all duration-300 ease-in-out"
      >
        <UserIcon className="h-5 w-5 mr-2" />
        {userName || "Profile"}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <button
              onClick={handleProfile}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-all duration-200 ease-in-out"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-all duration-200 ease-in-out"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ButtonProfile;
