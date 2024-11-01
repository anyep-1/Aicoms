import React, { useState } from "react";

const DataTable = ({ currentData, columns, title, onDelete, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (employee) => {
    setEditedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  const handleDelete = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      if (onDelete && editedEmployee) {
        onDelete(editedEmployee.id);
      }
      closeModal();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editedEmployee && onUpdate) {
      editedEmployee.amount = parseFloat(editedEmployee.amount);
      onUpdate(editedEmployee); // Kirimkan data termasuk transactionType yang ada
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditedEmployee(null);
  };

  const sortedData = React.useMemo(() => {
    let sortableItems = Array.isArray(currentData) ? [...currentData] : [];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === "transactionType") {
          const priority = { in: 1, donation: 2, out: 3 };
          const aPriority = priority[a.transactionType] || 4;
          const bPriority = priority[b.transactionType] || 4;
          return sortConfig.direction === "ascending"
            ? aPriority - bPriority
            : bPriority - aPriority;
        }

        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [currentData, sortConfig]);

  const filteredData = sortedData.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            <p className="text-slate-500">Review each record before edit</p>
          </div>
          <div className="flex flex-col gap-2 shrink-0 sm:flex-row">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              className="border rounded py-2 px-3 text-slate-600"
            />
          </div>
        </div>
      </div>

      <table className="w-full mt-4 text-left table-auto min-w-max">
        <thead>
          <tr>
            {columns.map((column) => {
              const isColumnVisible =
                Array.isArray(currentData) &&
                (column.key === "actions" ||
                  currentData.some(
                    (data) =>
                      data[column.key] !== undefined &&
                      data[column.key] !== null
                  ));

              return (
                isColumnVisible && (
                  <th
                    key={column.key}
                    className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100"
                    onClick={() => handleSort(column.key)}
                  >
                    <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                      {column.title}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        aria-hidden="true"
                        className={`w-4 h-4 transform ${
                          sortConfig.key === column.key
                            ? sortConfig.direction === "ascending"
                              ? "rotate-180"
                              : ""
                            : ""
                        }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                        ></path>
                      </svg>
                    </p>
                  </th>
                )
              );
            })}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((data, index) => (
            <tr key={index}>
              {columns.map((column) => {
                const isColumnVisible =
                  column.key === "actions" ||
                  (data[column.key] !== undefined && data[column.key] !== null);

                return (
                  isColumnVisible && (
                    <td
                      key={column.key}
                      className="p-4 border-b border-slate-200"
                    >
                      {column.render ? column.render(data) : data[column.key]}
                    </td>
                  )
                );
              })}
              <td className="p-4 border-b border-slate-200">
                <button
                  onClick={() => handleEdit(data)}
                  className="flex items-center justify-center rounded-lg border border-slate-300 bg-white py-2 px-4 text-xs font-semibold text-slate-600 transition duration-200 ease-in-out hover:bg-slate-100 hover:shadow-md focus:ring-2 focus:ring-slate-300 active:opacity-75 disabled:pointer-events-none disabled:opacity-50"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center space-x-2 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white"
          } border rounded px-4 py-2`}
        >
          Previous
        </button>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white"
          } border rounded px-4 py-2`}
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
            <h3 className="text-lg font-semibold mb-6 text-center">
              Edit Employee Data
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {columns.map((column) => {
                  if (
                    column.key === "actions" ||
                    column.key === "transactionType"
                  )
                    return null;

                  return (
                    <div className="text-black" key={column.key}>
                      <label className="block text-sm font-medium text-gray-700">
                        {column.title}
                      </label>
                      <input
                        type="text"
                        name={column.key}
                        value={editedEmployee ? editedEmployee[column.key] : ""}
                        onChange={handleInputChange}
                        className="border rounded w-full p-2"
                        required
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mr-2 bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
