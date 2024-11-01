import { postData } from "@/app/libs/api";
import React, { useState } from "react";

const ModalForm = ({ onClose, onSubmit }) => {
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "mahasiswa",
    status: "0",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await postData("auth/signup", userData);
      console.log("User created:", response.data);

      onSubmit(); // Memanggil fungsi onSubmit dari prop untuk memperbarui data di TableUser
      onClose(); // Menutup modal setelah submit
      setUserData({
        name: "",
        username: "",
        email: "",
        password: "",
        role: "mahasiswa",
        status: "0",
      });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Add User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={userData.name}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={userData.username}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={userData.email}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={userData.password}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium">
              Role
            </label>
            <select
              name="role"
              id="role"
              value={userData.role}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            >
              <option value="mahasiswa">Mahasiswa</option>
              <option value="dosen">Dosen</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium">
              Status
            </label>
            <select
              name="status"
              id="status"
              value={userData.status}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            >
              <option value="0">User</option>
              <option value="1">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition duration-300 ease-in-out"
          >
            Add User
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition duration-300 ease-in-out"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;
