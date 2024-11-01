import React, { useEffect, useState } from "react";
import DataTable from "@/components/Table/TableStruct";
import { deleteData, fetchData, updateData } from "@/app/libs/api";
import LabCashData from "./LabCashDataCome";

const LabCashTable = () => {
  const [labCashTransactions, setLabCashTransactions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchLabCash = async () => {
      try {
        const response = await fetchData("lab-cash");
        setLabCashTransactions(response);
      } catch (error) {
        console.error("Error fetching lab cash transactions:", error);
      }
    };

    fetchLabCash();
  }, []);

  const handlePay = (transaction) => {
    setCurrentTransaction(transaction);
    setModalOpen(true);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileSubmit = async (event) => {
    event.preventDefault();

    if (file && currentTransaction) {
      const formData = new FormData();
      Object.entries(currentTransaction).forEach(([key, value]) => {
        formData.append(key, value);
      });

      formData.append("photoSudah", file);
      formData.set("transactionType", "in");

      try {
        const response = await updateData(
          `lab-cash/${currentTransaction.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          setLabCashTransactions((prevData) =>
            prevData.map((transaction) =>
              transaction.id === currentTransaction.id
                ? { ...currentTransaction, transactionType: "in" }
                : transaction
            )
          );

          setModalOpen(false);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await deleteData(`lab-cash/${id}`);
        setLabCashTransactions((prevData) =>
          prevData.filter((data) => data.id !== id)
        );
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const columns = [
    {
      title: "Nama",
      key: "name",
      render: (data) => (
        <td className="p-4">
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold text-slate-500">{data.name}</p>
          </div>
        </td>
      ),
    },
    {
      title: "Tanggal Input",
      key: "inputDate",
      render: (data) => (
        <td className="p-4">
          <p className="text-sm font-semibold text-slate-500">
            {new Date(data.inputDate).toLocaleDateString("id-ID")}
          </p>
        </td>
      ),
    },
    {
      title: "Jumlah Uang",
      key: "amount",
      render: (data) => (
        <td className="p-4">
          <p className="text-sm font-semibold text-slate-500">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(data.amount)}
          </p>
        </td>
      ),
    },
    {
      title: "Source",
      key: "source",
      render: (data) => (
        <td className="p-4">
          <p className="text-sm font-semibold text-slate-500">
            {data.source || "Tidak diketahui"}
          </p>
        </td>
      ),
    },
    {
      title: "Status",
      key: "transactionType",
      render: (data) => (
        <td className="p-2 border-b border-slate-100 text-sm font-semibold rounded-lg">
          <div
            className={`py-1 px-2 rounded-lg text-center ${
              data.transactionType === "in"
                ? "bg-green-200 text-green-800"
                : data.transactionType === "out"
                ? "bg-red-200 text-red-800"
                : data.transactionType === "donation"
                ? "bg-blue-200 text-blue-800"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {data.transactionType === "in"
              ? "Masuk"
              : data.transactionType === "out"
              ? "Keluar"
              : data.transactionType === "donation"
              ? "Sumbangan"
              : "Tidak Diketahui"}
          </div>
        </td>
      ),
    },
    {
      title: "Aksi",
      key: "actions",
      render: (data) => (
        <td className="p-2 border-b border-slate-100 text-sm font-semibold rounded-lg">
          {data.transactionType === "out" && (
            <button
              onClick={() => handlePay(data)}
              className="ml-4 flex items-center justify-center rounded-lg border border-blue-300 bg-white py-2 px-4 text-xs font-semibold text-blue-600 transition duration-200 ease-in-out hover:bg-blue-100 hover:shadow-md focus:ring-2 focus:ring-blue-300 active:opacity-75 disabled:pointer-events-none disabled:opacity-50"
            >
              Bayar
            </button>
          )}
        </td>
      ),
    },
  ];

  return (
    <div className="min-h-[500px] bg-gray-100 p-6 rounded-lg shadow-md">
      <DataTable
        currentData={labCashTransactions}
        columns={columns}
        title="Data Transaksi Lab Cash"
        onDelete={handleDelete}
      />

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Upload File</h2>
            <form onSubmit={handleFileSubmit}>
              <input type="file" onChange={handleFileChange} className="mb-4" />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Kirim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabCashTable;
