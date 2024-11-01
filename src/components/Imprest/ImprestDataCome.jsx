// ImprestData.js
import { useEffect } from "react";
import { fetchData } from "@/app/libs/api";

const ImprestData = ({ setIncome, setExpense, setBalance }) => {
  useEffect(() => {
    const fetchImprestData = async () => {
      try {
        const response = await fetchData("imprest", {});
        const transactions = response || [];

        let income = 0;
        let expense = 0;
        let saldo = 0;

        if (Array.isArray(transactions)) {
          // Loop untuk menghitung pemasukan dan pengeluaran total
          transactions.forEach((transaction) => {
            if (transaction.transactionType === "in") {
              income += transaction.amount;
            } else if (transaction.transactionType === "out") {
              expense += transaction.amount;
            }
          });

          // Loop kedua untuk menghitung saldo, hanya untuk transaksi dengan status 'undone'
          transactions.forEach((transaction) => {
            if (transaction.status === "undone") {
              if (transaction.transactionType === "in") {
                saldo += transaction.amount;
              } else if (transaction.transactionType === "out") {
                saldo -= transaction.amount;
              }
            }
          });
        } else {
          console.error("Data fetched is not an array:", transactions);
        }

        // Set income dan expense
        setIncome(income);
        setExpense(expense);

        // Set saldo hanya dengan transaksi 'undone'
        setBalance(saldo);
      } catch (error) {
        console.error("Error fetching imprest data:", error);
      }
    };

    fetchImprestData();
  }, [setIncome, setExpense, setBalance]);

  return null;
};

export default ImprestData;
