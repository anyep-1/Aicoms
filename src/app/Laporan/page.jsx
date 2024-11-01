"use client";
import React, { useState } from "react";
import ImprestReport from "@/components/laporan/ImprestReport";
import LabCashReport from "@/components/laporan/LabCashReport";

const LaporanPage = () => {
  // Set default state langsung ke "imprest"
  const [selectedReport, setSelectedReport] = useState("imprest");

  const handleSelectReport = (reportType) => {
    setSelectedReport(reportType);
  };

  return (
    <div className="p-1">
      <h1 className="text-3xl font-bold mb-3">Pilih Laporan</h1>

      {/* Pilihan Menu */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => handleSelectReport("imprest")}
          className={`px-4 py-2 rounded-lg ${
            selectedReport === "imprest"
              ? "bg-blue-500 text-white"
              : "bg-gray-300"
          }`}
        >
          Imprest
        </button>
        <button
          onClick={() => handleSelectReport("labcash")}
          className={`px-4 py-2 rounded-lg ${
            selectedReport === "labcash"
              ? "bg-blue-500 text-white"
              : "bg-gray-300"
          }`}
        >
          LabCash
        </button>
      </div>

      {/* Render komponen berdasarkan pilihan */}
      <div>
        {selectedReport === "imprest" && <ImprestReport />}
        {selectedReport === "labcash" && <LabCashReport />}
      </div>
    </div>
  );
};

export default LaporanPage;
