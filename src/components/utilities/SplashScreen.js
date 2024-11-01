// src/components/SplashScreen.js
import React from "react";
import Image from "next/image";

const SplashScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white relative">
      <div className="absolute top-[-50px] left-[-50px] w-[300px] h-[300px] bg-gradient-to-br from-[#d65a4a] to-[#b33d38] rounded-full opacity-90"></div>
      <div className="absolute bottom-[-50px] right-[-50px] w-[150px] h-[150px] bg-gradient-to-br from-[#b33d38] to-[#d65a4a] rounded-full opacity-90"></div>

      <div className="text-center z-10">
        <Image
          src="/images/logo_aicoms.png"
          alt="AICOMS Logo"
          width={300}
          height={100}
          className="mx-auto"
        />
        <h1 className="mt-6 text-lg font-medium text-gray-800">
          Welcome to Our Application
        </h1>
      </div>
    </div>
  );
};

export default SplashScreen;
