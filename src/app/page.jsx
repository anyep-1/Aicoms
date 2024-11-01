"use client";

import React, { useState, useEffect } from "react";
import SplashScreen from "../components/utilities/SplashScreen";
import Login from "@/app/Login/page";

const Page = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return <Login />;
};

export default Page;
