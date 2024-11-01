// ImprestDataLaporan.js
import React, { useState, useEffect } from "react";
import ImprestData from "@/components/Imprest/ImprestDataCome";

const ImprestDataLaporan = () => {
  const [income, setIncome] = useState(0); // Pemasukan
  const [expense, setExpense] = useState(0); // Pengeluaran
  const [balance, setBalance] = useState(0); // Saldo

  return (
    <div className="flex justify-center mb-6">
      <div className="p-4 border border-gray-300 bg-white rounded-lg shadow-sm w-1/2">
        <h2 className="text-lg font-medium text-green-600">
          Pemasukan Imprest
        </h2>
        <p className="text-xl text-black font-semibold">
          Rp. {new Intl.NumberFormat("id-ID").format(income)}
        </p>

        <h2 className="text-lg font-medium text-red-600 mt-2">
          Pengeluaran Imprest
        </h2>
        <p className="text-xl text-black font-semibold">
          Rp. {new Intl.NumberFormat("id-ID").format(expense)}
        </p>

        <h2 className="text-lg font-medium text-blue-600 mt-4">
          Saldo Keseluruhan Imprest
        </h2>
        <p className="text-xl text-black font-semibold">
          Rp. {new Intl.NumberFormat("id-ID").format(balance)}
        </p>

        <ImprestData
          setIncome={setIncome}
          setExpense={setExpense}
          setBalance={setBalance}
        />
      </div>
    </div>
  );
};

export default ImprestDataLaporan;
