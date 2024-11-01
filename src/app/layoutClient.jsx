"use client";

import Header from "@/components/Atas/Header";
import SideBar from "@/components/Sidebar";
import { usePathname } from "next/navigation";

const titleSubtitleMapping = {
  "/Dashboard": {
    title: "Selamat Datang di Aplikasi Keuangan AICOMS",
    subtitle: "Laporan Keuangan AICOMS",
  },
  "/Imprest": {
    title: "Pengelolaan Dana Imprest",
    subtitle: "Imprest Fund",
  },
  "/LabCash": {
    title: "Kelola Kas Lab",
    subtitle: "Cash Money",
  },
  "/Debt": {
    title: "Pengelolaan Utang",
    subtitle: "Debt",
  },
  "/Laporan": {
    title: "Laporan Keuangan",
    subtitle: "Report",
  },
  "/Input": {
    title: "Input Data Keuangan",
    subtitle: "Input Money",
  },
  "/User": {
    title: "Manajemen Pengguna",
    subtitle: "User Control",
  },
};

export default function LayoutClient({ children }) {
  const pathname = usePathname();

  const { title, subtitle } = titleSubtitleMapping[pathname] || {
    title: "",
    subtitle: "",
  };

  const hideSidebar = pathname === "/" || pathname === "/Login";
  const hideHeader = pathname === "/" || pathname === "/Login";

  return (
    <div className="flex">
      {!hideSidebar && <SideBar />}
      <div className={`flex-1 ${hideSidebar ? "ml-0" : "ml-64"}`}>
        {!hideHeader && <Header title={title} subtitle={subtitle} />}{" "}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
