"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postData } from "../libs/api";
import Image from "next/image";
import Cookies from "js-cookie";

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await postData("auth/signin", {
        identifier: emailOrUsername,
        password: password,
      });

      if (response.status === 200) {
        Cookies.set("user", JSON.stringify(response.data), { expires: 7 });
        router.push("/Dashboard");
      } else {
        setError("Login failed");
      }
    } catch (error) {
      console.log(error);
      console.error("Error during login:", error);
      setError("Failed to login. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <div className="w-full py-5 bg-white flex relative">
        <div className="relative h-[50px] w-[270px]">
          <Image
            src="/images/logo_aicoms.png"
            alt="AICOMS Logo"
            fill
            sizes="(max-width: 270px) 100vw, 270px"
            className="object-contain"
            priority
          />
        </div>
        <div className="absolute w-full h-[2px] top-[90px] bg-gray-400"></div>
      </div>

      <div className="relative w-full max-w-lg mt-10 flex justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md z-10 text-center">
          <div className="mb-6">
            <div className="relative h-[200px] w-[200px]">
              <Image
                src="/images/login1.png"
                alt="Login Illustration"
                fill
                sizes="(max-width: 200px) 100vw, 200px"
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">LOGIN.</h1>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4 text-left">
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Email/Username
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6 text-left">
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
