"use client";

import { useState } from "react";
import IncomeExpenses from "@/components/Table/InOutCome";
import ImprestTable from "@/components/Imprest/ImprestDataTable";
import ImprestDataLaporan from "@/components/Table/ImprestDataLaporan";
const ImprestPage = () => {
  const [searchQueryTransactions, setSearchQueryTransactions] = useState("");
  const [sortOption, setSortOption] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 bg-gray-100 ">
        <ImprestDataLaporan label="Jumlah Uang Imprest Fund" />
        <ImprestTable
          currentPage={currentPage}
          searchQueryTransactions={searchQueryTransactions}
          sortOption={sortOption}
        />
      </main>
    </div>
  );
};

export default ImprestPage;
