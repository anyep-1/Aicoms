"use client";

import TableUserControl from "@/components/UserControl/TableUser";
import { useEffect, useState } from "react";
import { fetchData } from "../libs/api";

const User = () => {
  const [users, setUsers] = useState([]);

  const fetchDataApi = async () => {
    try {
      const response = await fetchData("users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchDataApi();
  }, []);

  return (
    <div className="relative min-h-screen">
      <div>
        <TableUserControl users={users} />
      </div>
    </div>
  );
};

export default User;
