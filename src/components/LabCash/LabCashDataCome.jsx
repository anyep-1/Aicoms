// LabCashData.js
import { useEffect } from "react";
import { fetchData } from "@/app/libs/api";

const LabCashData = ({ setIncome, setExpense, setBalance }) => {
  useEffect(() => {
    const fetchLabCash = async () => {
      try {
        const response = await fetchData("lab-cash");
        const transactions = response || [];

        let income = 0;
        let expense = 0;
        let saldo = 0;

        if (Array.isArray(transactions)) {
          // Menghitung income, expense, dan saldo sesuai dengan aturan
          transactions.forEach((transaction) => {
            if (
              transaction.transactionType === "in" ||
              transaction.transactionType === "donation"
            ) {
              income += transaction.amount;
              saldo += transaction.amount; // Menambah saldo untuk transaksi 'in' dan 'donation'
            } else if (transaction.transactionType === "out") {
              expense += transaction.amount;
              saldo -= transaction.amount; // Mengurangi saldo untuk transaksi 'out'
            }
          });
        } else {
          console.error("Data fetched is not an array:", transactions);
        }

        // Set nilai income, expense, dan saldo ke state
        setIncome(income);
        setExpense(expense);
        setBalance(saldo);
      } catch (error) {
        console.error("Error fetching lab-cash data:", error);
      }
    };

    fetchLabCash();
  }, [setIncome, setExpense, setBalance]);

  return null;
};

export default LabCashData;
