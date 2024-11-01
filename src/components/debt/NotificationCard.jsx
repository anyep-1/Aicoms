import React from "react";
import { FaExclamationTriangle, FaInfoCircle } from "react-icons/fa"; // Import icon tambahan

const NotificationCard = ({ name, amount, purpose }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg w-80 h-auto flex flex-col justify-between">
      {/* Header: Ikon dan Judul */}
      <div className="flex items-center mb-4">
        <FaExclamationTriangle className="text-red-500 w-6 h-6 mr-3" />
        <h3 className="text-xl font-semibold text-gray-800">
          Pengingat Hutang
        </h3>
      </div>

      {/* Konten Utama */}
      <div className="mb-4">
        <p className="text-gray-600 mb-2 text-base">
          Kamu belum membayar hutang ke{" "}
          <span className="font-medium text-gray-900">{name}</span>.
        </p>
        {/* Jumlah Hutang */}
        <p className="text-2xl font-bold text-gray-900">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(amount)}
        </p>
      </div>

      {/* Garis Pemisah */}
      <div className="border-t border-gray-300 my-4" />

      {/* Footer: Keterangan Purpose */}
      <div className="flex items-center text-gray-500">
        <FaInfoCircle className="text-blue-500 w-5 h-5 mr-2" />
        <p className="text-sm">{purpose ? purpose : "Tidak ada keterangan."}</p>
      </div>
    </div>
  );
};

export default NotificationCard;
