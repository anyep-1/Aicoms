"use client";

import { postData } from "@/app/libs/api";
import { useEffect, useState } from "react";

const FormDataInput = () => {
  const [Type, setType] = useState("donation");
  const [fundType, setFundType] = useState("Cash Money");
  const [formData, setFormData] = useState({
    name: "",
    inputDate: "",
    purpose: "",
    transactionDate: "",
    amount: "",
    source: "",
    pic: "",
    photo: "",
    transactionType: "",
    receipt: null,
  });

  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      receipt: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = fundType === "Cash Money" ? "lab-cash" : "imprest";

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("inputDate", formData.inputDate);
    formDataToSend.append("amount", parseFloat(formData.amount));
    formDataToSend.append("source", formData.source);
    formDataToSend.append("transactionType", Type);
    formDataToSend.append("photo", formData.receipt);

    if (fundType === "Imprest Fund") {
      formDataToSend.append("purpose", formData.purpose);
      formDataToSend.append("transactionDate", formData.transactionDate);
      formDataToSend.append("pic", formData.pic);
      formDataToSend.append("status", "undone");
    }

    try {
      const response = await postData(endpoint, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Data berhasil dikirim:", response.data);
      setSubmitStatus("success");
      setType("in");
      setFundType("Cash Money");
      setFormData({
        name: "",
        inputDate: "",
        purpose: "",
        transactionDate: "",
        amount: "",
        source: "",
        pic: "",
        photo: "",
        transactionType: "",
        receipt: null,
      });
    } catch (error) {
      console.error("Terjadi kesalahan saat mengirim data:", error);
      setSubmitStatus("error");
    }
  };

  useEffect(() => {
    if (fundType === "Cash Money") {
      setType("donation"); // Pemasukan default untuk lab-cash
    } else if (fundType === "Imprest Fund") {
      setType("in"); // Pemasukan default untuk imprest
    }
  }, [fundType]);
  const handleTypeChange = (e) => {
    const value = e.target.value;
    setType(value); // Mengubah type berdasarkan input radio
  };

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // Bulan dimulai dari 0
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      transactionDate: getTodayDate(),
      inputDate: getTodayDate(),
    }));
  }, []);

  return (
    <div className="flex justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-7 rounded-lg max-w-7xl w-full"
      >
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">Tipe Transaksi</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="transactionType"
                  value={fundType === "Cash Money" ? "donation" : "in"}
                  checked={
                    Type === (fundType === "Cash Money" ? "donation" : "in")
                  }
                  onChange={handleTypeChange}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-gray-700">Pemasukan</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="transactionType"
                  value="out"
                  checked={Type === "out"}
                  onChange={handleTypeChange}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-gray-700">Pengeluaran</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Jenis Dana</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="fundType"
                  value="Cash Money"
                  checked={fundType === "Cash Money"}
                  onChange={(e) => {
                    setFundType(e.target.value);
                    setType("donation");
                  }}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-gray-700">Cash Money</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="fundType"
                  value="Imprest Fund"
                  checked={fundType === "Imprest Fund"}
                  onChange={(e) => {
                    setFundType(e.target.value);
                    // Secara otomatis set Type menjadi in atau out sesuai Imprest
                    setType("in");
                  }}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-gray-700">Imprest Fund</span>
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4 w-full">
            <div>
              <label className="block text-gray-700">Nama</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700">Tanggal Input</label>
              <input
                type="date"
                name="inputDate"
                value={formData.inputDate}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            {fundType === "Imprest Fund" && (
              <div>
                <label className="block text-gray-700">Keperluan</label>
                <input
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            )}
            {fundType === "Imprest Fund" && (
              <div>
                <label className="block text-gray-700">Tanggal Transaksi</label>
                <input
                  type="date"
                  name="transactionDate"
                  value={formData.transactionDate}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            )}
            <div>
              <label className="block text-gray-700">Jumlah Uang</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="space-y-4 w-full">
            <div>
              <label className="block text-gray-700">Sumber Dana</label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            {fundType === "Imprest Fund" && (
              <div>
                <label className="block text-gray-700">PIC</label>
                <input
                  type="text"
                  name="pic"
                  value={formData.pic}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            )}
            <div>
              <label className="block text-gray-700">Bukti Transaksi</label>
              <input
                type="file"
                name="receipt"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
        >
          Kirim
        </button>

        {submitStatus === "success" && (
          <div className="mt-4 text-green-600">Data berhasil dikirim!</div>
        )}
        {submitStatus === "error" && (
          <div className="mt-4 text-red-600">
            Terjadi kesalahan saat mengirim data.
          </div>
        )}
      </form>
    </div>
  );
};

export default FormDataInput;
