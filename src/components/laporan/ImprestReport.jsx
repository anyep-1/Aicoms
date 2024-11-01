import React, { useState, useEffect } from "react";
import { fetchData } from "@/app/libs/api";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const ImprestReport = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  const applyFilter = () => {
    if (!startDate || !endDate) {
      alert("Silakan masukkan tanggal mulai dan tanggal akhir.");
      return;
    }

    const filtered = transactions
      .filter((item) => {
        const statusMatch = status ? item.status === status : true;
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
    const worksheet = workbook.addWorksheet("Laporan Imprest");

    // Judul laporan
    worksheet.mergeCells("B2:T3");
    worksheet.getCell("B2").value = "Data Keuangan Imprest";
    worksheet.getCell("B2").font = {
      bold: true,
      size: 30,
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

    worksheet.mergeCells("B4:J4");
    worksheet.getCell("B4").value = "Status: Done";
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

    worksheet.mergeCells("L4:T4");
    worksheet.getCell("L4").value = "Status: Undone";
    worksheet.getCell("L4").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    worksheet.getCell("L4").font = { bold: true, color: { argb: "FFFFFF" } };
    worksheet.getCell("L4").fill = {
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
      "Tanggal Transaksi",
      "Jumlah Uang",
      "PIC",
      "Keterangan",
      "Status",
      "Photo URL",
      "Photo Status",
    ];
    const headersUndone = [
      "Nama",
      "Tanggal Input",
      "Tanggal Transaksi",
      "Jumlah Uang",
      "PIC",
      "Keterangan",
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
      worksheet.getCell(5, col + 12).value = headersUndone[col];
      worksheet.getCell(5, col + 12).font = { bold: true };
      worksheet.getCell(5, col + 12).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "DA9694" },
      };
      worksheet.getCell(5, col + 12).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      worksheet.getCell(5, col + 12).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }

    worksheet.getRow(5).height = 28;

    worksheet.columns = [
      { width: 1 },
      { width: 25 },
      { width: 18 },
      { width: 18 },
      { width: 20 },
      { width: 25 },
      { width: 30 },
      { width: 17 },
      { width: 18 },
      { width: 18 },
      { width: 2 },
      { width: 25 },
      { width: 18 },
      { width: 18 },
      { width: 20 },
      { width: 25 },
      { width: 30 },
      { width: 17 },
      { width: 18 },
      { width: 18 },
    ];

    const doneData = filteredData.filter((row) => row.status === "done");
    const undoneData = filteredData.filter((row) => row.status === "undone");

    const formatRow = (row) => [
      row.name,
      new Date(row.inputDate).toLocaleDateString("id-ID"),
      new Date(row.transactionDate).toLocaleDateString("id-ID"),
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(row.amount),
      row.pic || "Tidak tersedia",
      row.purpose || "Tidak tersedia",
      row.status === "done" ? "Selesai" : "Tertunda",
      row.photoURL
        ? { text: "Lihat Bukti", hyperlink: row.photoURL }
        : "Tidak tersedia",
      row.photoSUDAH
        ? { text: "Lihat Bukti", hyperlink: row.photoSUDAH }
        : "Tidak tersedia",
    ];
    const maxLength = Math.max(doneData.length, undoneData.length);
    for (let i = 0; i < maxLength; i++) {
      const doneRow = doneData[i]
        ? formatRow(doneData[i])
        : ["", "", "", "", "", "", "", "", ""];
      const undoneRow = undoneData[i]
        ? formatRow(undoneData[i])
        : ["", "", "", "", "", "", "", "", ""];

      const rowIndex = i + 6;

      worksheet.getCell(rowIndex, 2).value = doneRow[0];
      worksheet.getCell(rowIndex, 3).value = doneRow[1];
      worksheet.getCell(rowIndex, 4).value = doneRow[2];
      worksheet.getCell(rowIndex, 5).value = doneRow[3];
      worksheet.getCell(rowIndex, 6).value = doneRow[4];
      worksheet.getCell(rowIndex, 7).value = doneRow[5];
      worksheet.getCell(rowIndex, 8).value = doneRow[6];
      worksheet.getCell(rowIndex, 9).value = doneRow[7];
      worksheet.getCell(rowIndex, 10).value = doneRow[8];

      worksheet.getCell(rowIndex, 12).value = undoneRow[0];
      worksheet.getCell(rowIndex, 13).value = undoneRow[1];
      worksheet.getCell(rowIndex, 14).value = undoneRow[2];
      worksheet.getCell(rowIndex, 15).value = undoneRow[3];
      worksheet.getCell(rowIndex, 16).value = undoneRow[4];
      worksheet.getCell(rowIndex, 17).value = undoneRow[5];
      worksheet.getCell(rowIndex, 18).value = undoneRow[6];
      worksheet.getCell(rowIndex, 19).value = undoneRow[7];
      worksheet.getCell(rowIndex, 20).value = undoneRow[8];

      for (let col = 2; col <= 10; col++) {
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
      for (let col = 11; col <= 20; col++) {
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

    let totalAmountDone = doneData.reduce((acc, row) => acc + row.amount, 0);
    let totalAmountUndone = undoneData.reduce(
      (acc, row) => acc + row.amount,
      0
    );

    const totalRowIndexDone = maxLength + 6;
    worksheet.mergeCells(`B${totalRowIndexDone}:H${totalRowIndexDone}`);
    worksheet.getCell(`B${totalRowIndexDone}`).value = "TOTAL";
    worksheet.getCell(`B${totalRowIndexDone}`).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(`B${totalRowIndexDone}`).font = { bold: true };
    worksheet.getRow(totalRowIndexDone).height = 45;

    worksheet.mergeCells(`I${totalRowIndexDone}:J${totalRowIndexDone}`);
    worksheet.getCell(
      `I${totalRowIndexDone}`
    ).value = `Rp. ${totalAmountDone.toLocaleString("id-ID")}`;
    worksheet.getCell(`I${totalRowIndexDone}`).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(`I${totalRowIndexDone}`).font = { bold: true };

    for (let col = 2; col <= 10; col++) {
      worksheet.getCell(totalRowIndexDone, col).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }

    const totalRowIndexUndone = maxLength + 6;
    worksheet.mergeCells(`L${totalRowIndexUndone}:R${totalRowIndexUndone}`);
    worksheet.getCell(`L${totalRowIndexUndone}`).value = "TOTAL";
    worksheet.getCell(`L${totalRowIndexUndone}`).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(`L${totalRowIndexUndone}`).font = { bold: true };
    worksheet.getRow(totalRowIndexUndone).height = 45;

    worksheet.mergeCells(`S${totalRowIndexUndone}:T${totalRowIndexUndone}`);
    worksheet.getCell(
      `S${totalRowIndexUndone}`
    ).value = `Rp. ${totalAmountUndone.toLocaleString("id-ID")}`;
    worksheet.getCell(`S${totalRowIndexUndone}`).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(`S${totalRowIndexUndone}`).font = { bold: true };

    for (let col = 12; col <= 20; col++) {
      worksheet.getCell(totalRowIndexUndone, col).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }

    worksheet.mergeCells("K4:K" + (maxLength + 5));
    worksheet.getCell("K4").value = "";

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

    const fileName = `Laporan_Imprest_${formatDate(
      startDate
    )}_sampai_${formatDate(endDate)}.xlsx`;

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
      <h1 className="text-2xl font-bold mb-4">Laporan Imprest</h1>

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
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Download Excel
          </button>
        )}
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-black p-4 bg-gray-200">Nama</th>
            <th className="border border-black p-4 bg-gray-200">
              Tanggal Input
            </th>
            <th className="border border-black p-4 bg-gray-200">
              Tanggal Transaksi
            </th>
            <th className="border border-black p-4 bg-gray-200">Jumlah Uang</th>
            <th className="border border-black p-4 bg-gray-200">PIC</th>
            <th className="border border-black p-4 bg-gray-200">Keterangan</th>
            <th className="border border-black p-4 bg-gray-200">Status</th>
            <th className="border border-black p-4 bg-gray-200">Photo URL</th>
            <th className="border border-black p-4 bg-gray-200">
              Bukti Transfer
            </th>
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
                  {new Date(row.transactionDate).toLocaleDateString("id-ID")}
                </td>
                <td className="border border-black p-2">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(row.amount)}
                </td>
                <td className="border border-black p-2">
                  {row.pic || "Tidak tersedia"}
                </td>
                <td className="border border-black p-2">
                  {row.purpose || "Tidak tersedia"}
                </td>
                <td className="border border-black p-2">
                  {row.status === "done" ? "Selesai" : "Tertunda"}
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
              <td colSpan="9" className="text-center py-4">
                Tidak ada data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ImprestReport;
