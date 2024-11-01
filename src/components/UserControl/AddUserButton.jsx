import React, { useState } from "react";
import ModalForm from "@/components/UserControl/ModalAdd";

const Modal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add User</h2>
        <ModalForm onClose={onClose} onSubmit={onSubmit} />
      </div>
    </div>
  );
};

const AddButtonUser = ({ onAddUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddUserClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (userData) => {
    onAddUser(userData);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleAddUserClick}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition duration-300 ease-in-out"
      >
        Add User
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AddButtonUser;
