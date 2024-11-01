"use client";

import { useState, useEffect } from "react";
import IncomeExpenses from "@/components/Table/InOutCome";
import LabCashTable from "@/components/LabCash/LabCashDataTable";
import { fetchData } from "../libs/api";
import LabCashDataLaporan from "@/components/Table/LabCashDataLaporan";

const LabCashPage = () => {
  const [searchQueryTransactions, setSearchQueryTransactions] = useState("");
  const [sortOption, setSortOption] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [labCashTransactions, setLabCashTransactions] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false); // State untuk trigger refresh

  useEffect(() => {
    const fetchLabCashTransactions = async () => {
      try {
        const response = await fetchData("lab-cash");
        setLabCashTransactions(response.data);
      } catch (error) {
        console.error("Error fetching lab cash transactions:", error);
      }
    };

    fetchLabCashTransactions();
  }, [refreshTrigger]); // Tambahkan refreshTrigger sebagai dependensi

  // Fungsi untuk refresh data
  const handleRefresh = () => {
    setRefreshTrigger((prev) => !prev); // Ubah refreshTrigger untuk trigger ulang useEffect
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 bg-gray-100">
        <LabCashDataLaporan
          label="Jumlah Uang Lab Cash"
          refreshData={handleRefresh}
        />
        <LabCashTable
          currentPage={currentPage}
          searchQueryTransactions={searchQueryTransactions}
          sortOption={sortOption}
          transactions={labCashTransactions}
          onRefresh={handleRefresh} // Pass handleRefresh ke LabCashTable
        />
      </main>
    </div>
  );
};

export default LabCashPage;
