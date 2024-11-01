import React, { useEffect, useState } from "react";
import DataTable from "@/components/Table/TableStruct";
import { deleteData, fetchData, updateData } from "@/app/libs/api";

const ImprestTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetchData("imprest");
        setTransactions(response);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const handleUpdate = async (updatedTransaction) => {
    const transactionId = updatedTransaction.id;
    try {
      updatedTransaction.amount = parseFloat(updatedTransaction.amount);

      // Buat FormData untuk mengirim data dalam format multipart/form-data
      const formData = new FormData();

      // Tambahkan semua properti dari updatedTransaction ke dalam FormData
      for (const key in updatedTransaction) {
        if (updatedTransaction.hasOwnProperty(key)) {
          formData.append(key, updatedTransaction[key]);
        }
      }

      // Tambahkan `photoSudah` jika `file` sudah ada
      if (file) {
        formData.append("photoSudah", file);
      }

      // Kirim data dengan Content-Type: multipart/form-data
      const response = await updateData(`imprest/${transactionId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setTransactions((prevTransactions) =>
          prevTransactions.map((transaction) =>
            transaction.id === transactionId ? updatedTransaction : transaction
          )
        );
        console.log("Data berhasil diperbarui:", updatedTransaction);
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await deleteData(`imprest/${id}`);
        setTransactions((prevTransactions) =>
          prevTransactions.filter((transaction) => transaction.id !== id)
        );
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileSubmit = async (event) => {
    event.preventDefault();

    if (file && selectedTransaction) {
      const formData = new FormData();

      // Tambahkan semua field transaction ke formData
      for (const key in selectedTransaction) {
        if (selectedTransaction.hasOwnProperty(key)) {
          formData.append(key, selectedTransaction[key]);
        }
      }

      // Upload bukti transfer
      formData.append("photoSudah", file);

      // Toggle antara "in" dan "out" serta ubah status jadi "done"
      const newTransactionType =
        selectedTransaction.transactionType === "in" ? "out" : "in";
      formData.set("transactionType", newTransactionType);
      formData.set("status", "done");
      formData.append("photoSudah", File);

      selectedTransaction.amount = parseFloat(selectedTransaction.amount);

      try {
        const response = await updateData(
          `imprest/${selectedTransaction.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200) {
          setTransactions((prevData) =>
            prevData.map((transaction) =>
              transaction.id === selectedTransaction.id
                ? {
                    ...selectedTransaction,
                    transactionType: newTransactionType,
                    status: "done",
                  }
                : transaction
            )
          );
          console.log("File berhasil di-upload:", file);
          setModalOpen(false); // Tutup modal setelah upload berhasil
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handlePay = (transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const columns = [
    {
      title: "Nama",
      key: "name",
      render: (data) => (
        <td className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-slate-500">
                {data.name}
              </p>
            </div>
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
      key: "status",
      render: (data) => (
        <td className="p-2 text-sm font-semibold">
          <div
            className={`py-1 px-2 rounded-lg text-center ${
              data.status === "done"
                ? "bg-green-200 text-green-800"
                : data.status === "undone"
                ? "bg-red-200 text-red-800"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {data.status === "done" ? "Selesai" : "Tertunda"}
          </div>
        </td>
      ),
    },
    {
      title: "Aksi",
      key: "actions",
      render: (data) => (
        <td className="p-2 text-sm font-semibold">
          <div className="flex items-center">
            {data.status === "undone" && (
              <button
                onClick={() => handlePay(data)}
                className="ml-4 flex items-center justify-center rounded-lg border border-blue-300 bg-white py-2 px-4 text-xs font-semibold text-blue-600 transition duration-200 ease-in-out hover:bg-blue-100 hover:shadow-md focus:ring-2 focus:ring-blue-300 active:opacity-75 disabled:pointer-events-none disabled:opacity-50"
              >
                Bayar
              </button>
            )}
          </div>
        </td>
      ),
    },
  ];

  return (
    <div className="min-h-[500px] bg-gray-100 p-6 rounded-lg shadow-md">
      <DataTable
        currentData={transactions}
        columns={columns}
        title="Data Transaksi Imprest"
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onPay={handlePay}
      />

      {/* Modal Form untuk Upload Bukti Transfer */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Upload Bukti Transfer</h2>
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

export default ImprestTable;
