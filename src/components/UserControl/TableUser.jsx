import React, { useState, useEffect } from "react";
import ToggleButtonMinimalis from "./ToggleButtonControl";
import ApplyButtonControl from "./ApplyButton";
import { patchData, fetchData } from "@/app/libs/api";
import AddButtonUser from "./AddUserButton";
import ModalForm from "@/components/UserControl/ModalAdd";
import DeleteButton from "@/components/UserControl/DeleteButton";

const TableUser = () => {
  const [users, setUsers] = useState([]);
  const [updatedStatuses, setUpdatedStatuses] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetchData("users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleToggle = (userId, newStatus) => {
    setUpdatedStatuses((prev) => ({
      ...prev,
      [userId]: newStatus,
    }));
  };

  const applyChanges = async () => {
    for (const userId in updatedStatuses) {
      const newStatus = updatedStatuses[userId];
      await patchData("users/update-status", {
        uidganti: userId,
        status: newStatus,
      });
    }
    setUpdatedStatuses({});
    loadData();
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg overflow-hidden">
      <div>
        <AddButtonUser onAddUser={loadData} />
      </div>

      {isModalOpen && (
        <ModalForm
          onClose={() => setIsModalOpen(false)}
          onSubmit={() => loadData()}
          loadData={loadData}
        />
      )}

      <table className="min-w-full bg-white border-collapse">
        <thead className="bg-gray-100">
          <tr className="text-left text-sm font-semibold text-gray-600">
            <th className="py-4 px-5 border-b">Nama</th>
            <th className="py-4 px-5 border-b">Status</th>
            <th className="py-4 px-5 border-b">Aksi</th>
            <th className="py-4 px-5 border-b">Hapus</th>
          </tr>
        </thead>
        <tbody className="whitespace-nowrap">
          {users && users.length > 0 ? (
            users.map((user) => (
              <tr key={user.uid} className="odd:bg-blue-50">
                <td className="p-4 text-sm">
                  <div className="flex items-center cursor-pointer w-max">
                    <div className="ml-4">
                      <p className="text-sm text-black ">{user.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-black">
                  {user.status === 1 ? "Admin" : "User"}
                </td>
                <td className="p-4">
                  <ToggleButtonMinimalis
                    userId={user.uid}
                    status={user.status}
                    onToggle={handleToggle}
                  />
                </td>
                <td className="p-4">
                  <DeleteButton
                    userId={user.uid}
                    loadData={loadData} // Memanggil loadData setelah penghapusan
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-3">
                Tidak ada data yang tersedia.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
        <ApplyButtonControl onApply={applyChanges} />
      </div>
    </div>
  );
};

export default TableUser;
