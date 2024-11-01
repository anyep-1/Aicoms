import React, { useState, useEffect } from "react";
import { fetchData } from "@/app/libs/api";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const LabCashReport = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const headers = [
    "Nama",
    "Tanggal Input",
    "Jumlah Uang",
    "Sumber",
    "Tipe Transaksi",
    "Photo URL",
    "Bukti Transfer",
  ];

  useEffect(() => {
    const fetchLabCash = async () => {
      try {
        const response = await fetchData("lab-cash");
        setTransactions(response);
      } catch (error) {
        console.error("Error fetching lab cash transactions:", error);
      }
    };

    fetchLabCash();
  }, []);

  const applyFilter = () => {
    if (!startDate || !endDate) {
      alert("Silakan masukkan tanggal mulai dan tanggal akhir.");
      return;
    }

    const filtered = transactions
      .filter((item) => {
        const statusMatch = status
          ? (status === "masuk" &&
              (item.transactionType === "in" ||
                item.transactionType === "donation")) ||
            (status === "keluar" && item.transactionType === "out")
          : true;

        const dateMatch =
          new Date(item.inputDate) >= new Date(startDate) &&
          new Date(item.inputDate) <= new Date(endDate);

        return statusMatch && dateMatch;
      })
      .sort((a, b) => new Date(a.inputDate) - new Date(b.inputDate));

    setFilteredData(filtered);
  };

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laporan LabCash");

    worksheet.mergeCells("B2:P3");
    worksheet.getCell("B2").value = "Laporan LabCash";
    worksheet.getCell("B2").font = {
      bold: true,
      size: 24,
      color: { argb: "FFFFFF" },
    };
    worksheet.getCell("B2").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    worksheet.getCell("B2").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "963634" },
    };
    worksheet.getRow(2).height = 40;
    worksheet.getCell("B2").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    worksheet.mergeCells("B4:H4");
    worksheet.getCell("B4").value = "Status: Uang Masuk";
    worksheet.getCell("B4").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    worksheet.getCell("B4").font = { bold: true, color: { argb: "FFFFFF" } };
    worksheet.getCell("B4").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "8DB4E2" },
    };
    worksheet.getRow(4).height = 30;
    worksheet.getCell("B4").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    worksheet.mergeCells("J4:P4");
    worksheet.getCell("J4").value = "Status: Uang Keluar";
    worksheet.getCell("J4").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    worksheet.getCell("J4").font = { bold: true, color: { argb: "FFFFFF" } };
    worksheet.getCell("J4").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "E6B8B7" },
    };
    worksheet.getRow(4).height = 30;
    worksheet.getCell("L4").border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    const headersDone = [
      "Nama",
      "Tanggal Input",
      "Jumlah Uang",
      "Sumber",
      "Status",
      "Photo URL",
      "Photo Status",
    ];
    const headersUndone = [
      "Nama",
      "Tanggal Input",
      "Jumlah Uang",
      "Sumber",
      "Status",
      "Photo URL",
      "Photo Status",
    ];

    for (let col = 0; col < headersDone.length; col++) {
      worksheet.getCell(5, col + 2).value = headersDone[col];
      worksheet.getCell(5, col + 2).font = { bold: true };
      worksheet.getCell(5, col + 2).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "538DD5" },
      };
      worksheet.getCell(5, col + 2).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      worksheet.getCell(5, col + 2).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }

    for (let col = 0; col < headersUndone.length; col++) {
      worksheet.getCell(5, col + 10).value = headersUndone[col];
      worksheet.getCell(5, col + 10).font = { bold: true };
      worksheet.getCell(5, col + 10).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "DA9694" },
      };
      worksheet.getCell(5, col + 10).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      worksheet.getCell(5, col + 10).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }

    worksheet.getRow(5).height = 28;

    const dataMasuk = transactions.filter((row) =>
      ["donation", "in"].includes(row.transactionType)
    );
    const dataKeluar = transactions.filter(
      (row) => row.transactionType === "out"
    );

    const formatRow = (row) => [
      row.name,
      new Date(row.inputDate).toLocaleDateString("id-ID"),
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(row.amount),
      row.source || "",
      row.transactionType || "",
      row.photoURL
        ? { text: "Lihat Bukti", hyperlink: row.photoURL }
        : "Tidak tersedia",
      row.photoSUDAH
        ? { text: "Lihat Bukti", hyperlink: row.photoSUDAH }
        : "Tidak tersedia",
    ];

    const maxLength = Math.max(dataMasuk.length, dataKeluar.length);
    for (let i = 0; i < maxLength; i++) {
      const doneRow = dataMasuk[i]
        ? formatRow(dataMasuk[i])
        : ["", "", "", "", "", "", ""];
      const undoneRow = dataKeluar[i]
        ? formatRow(dataKeluar[i])
        : ["", "", "", "", "", "", ""];

      const rowIndex = i + 6;

      worksheet.getCell(rowIndex, 2).value = doneRow[0];
      worksheet.getCell(rowIndex, 3).value = doneRow[1];
      worksheet.getCell(rowIndex, 4).value = doneRow[2];
      worksheet.getCell(rowIndex, 5).value = doneRow[3];
      worksheet.getCell(rowIndex, 6).value = doneRow[4];
      worksheet.getCell(rowIndex, 7).value = doneRow[5];
      worksheet.getCell(rowIndex, 8).value = doneRow[6];

      worksheet.getCell(rowIndex, 10).value = undoneRow[0];
      worksheet.getCell(rowIndex, 11).value = undoneRow[1];
      worksheet.getCell(rowIndex, 12).value = undoneRow[2];
      worksheet.getCell(rowIndex, 13).value = undoneRow[3];
      worksheet.getCell(rowIndex, 14).value = undoneRow[4];
      worksheet.getCell(rowIndex, 15).value = undoneRow[5];
      worksheet.getCell(rowIndex, 16).value = undoneRow[6];

      for (let col = 2; col <= 8; col++) {
        worksheet.getCell(rowIndex, col).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        worksheet.getCell(rowIndex, col).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
      }
      for (let col = 10; col <= 16; col++) {
        worksheet.getCell(rowIndex, col).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        worksheet.getCell(rowIndex, col).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
      }
      worksheet.getRow(rowIndex).height = 25;
    }

    let totalAmountMasuk = dataMasuk.reduce((acc, row) => acc + row.amount, 0);
    let totalAmountKeluar = dataKeluar.reduce(
      (acc, row) => acc + row.amount,
      0
    );

    const totalRowIndexMasuk = maxLength + 6;
    worksheet.mergeCells(`B${totalRowIndexMasuk}:F${totalRowIndexMasuk}`);
    worksheet.getCell(`B${totalRowIndexMasuk}`).value = "TOTAL";
    worksheet.getCell(`B${totalRowIndexMasuk}`).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(`B${totalRowIndexMasuk}`).font = { bold: true };
    worksheet.getRow(totalRowIndexMasuk).height = 45;

    worksheet.mergeCells(`G${totalRowIndexMasuk}:H${totalRowIndexMasuk}`);
    worksheet.getCell(
      `G${totalRowIndexMasuk}`
    ).value = `Rp. ${totalAmountMasuk.toLocaleString("id-ID")}`;
    worksheet.getCell(`G${totalRowIndexMasuk}`).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(`G${totalRowIndexMasuk}`).font = { bold: true };

    for (let col = 2; col <= 8; col++) {
      worksheet.getCell(totalRowIndexMasuk, col).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }

    const totalRowIndexKeluar = maxLength + 6;
    worksheet.mergeCells(`J${totalRowIndexKeluar}:N${totalRowIndexKeluar}`);
    worksheet.getCell(`J${totalRowIndexKeluar}`).value = "TOTAL";
    worksheet.getCell(`J${totalRowIndexKeluar}`).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(`J${totalRowIndexKeluar}`).font = { bold: true };
    worksheet.getRow(totalRowIndexKeluar).height = 45;

    worksheet.mergeCells(`O${totalRowIndexKeluar}:P${totalRowIndexKeluar}`);
    worksheet.getCell(
      `O${totalRowIndexKeluar}`
    ).value = `Rp. ${totalAmountKeluar.toLocaleString("id-ID")}`;
    worksheet.getCell(`O${totalRowIndexKeluar}`).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(`O${totalRowIndexKeluar}`).font = { bold: true };

    for (let col = 10; col <= 16; col++) {
      worksheet.getCell(totalRowIndexKeluar, col).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }

    worksheet.columns = [
      { width: 5 },
      { width: 25 },
      { width: 20 },
      { width: 18 },
      { width: 25 },
      { width: 18 },
      { width: 18 },
      { width: 25 },
      { width: 5 },
      { width: 25 },
      { width: 20 },
      { width: 18 },
      { width: 25 },
      { width: 18 },
      { width: 18 },
      { width: 25 },
    ];
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);

    const formatDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${day}-${month}-${year}`;
    };

    const fileName = `Laporan_LabCash ${formatDate(
      startDate
    )} sampai ${formatDate(endDate)}.xlsx`;

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Laporan Lab Cash</h1>
      <div className="flex gap-4 mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 rounded border border-gray-300"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 rounded border border-gray-300"
        />
        <button
          onClick={applyFilter}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Tampilkan
        </button>
        {filteredData.length > 0 && (
          <button
            onClick={downloadExcel}
            class="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-md transition-all duration-300 hover:bg-green-700"
          >
            <svg
              class="mr-2"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 2H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20V4h11v16H8zm6.45-10.95l1.1 1.1L13.6 12l1.95 1.95-1.1 1.1L12.5 13.1l-1.95 1.95-1.1-1.1L11.4 12l-1.95-1.95 1.1-1.1L12.5 10.9l1.95-1.95z" />
            </svg>
            Download Excel
          </button>
        )}
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="border border-black p-4 bg-gray-200">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row, index) => (
              <tr key={index}>
                <td className="border border-black p-2">{row.name}</td>
                <td className="border border-black p-2">
                  {new Date(row.inputDate).toLocaleDateString("id-ID")}
                </td>
                <td className="border border-black p-2">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(row.amount)}
                </td>
                <td className="border border-black p-2">
                  {row.sourcee || "Tidak tersedia"}
                </td>
                <td className="border border-black p-2">
                  {row.transactionType === "in" ||
                  row.transactionType === "donation"
                    ? "masuk"
                    : "keluar"}
                </td>
                <td className="border border-black p-2">
                  {row.photoURL ? (
                    <a
                      href={row.photoURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Lihat Bukti
                    </a>
                  ) : (
                    "Tidak tersedia"
                  )}
                </td>
                <td className="border border-black p-2">
                  {row.photoSUDAH ? (
                    <a
                      href={row.photoSUDAH}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Lihat Bukti
                    </a>
                  ) : (
                    "Tidak tersedia"
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4">
                Tidak ada data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LabCashReport;
