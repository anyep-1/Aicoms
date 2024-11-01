"use client";
import React, { useEffect, useState } from "react";
import NotificationCard from "./NotificationCard";
import { fetchData } from "@/app/libs/api";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetchData("imprest");
        const filteredData = response.filter(
          (transaction) =>
            transaction.transactionType === "in" &&
            transaction.status === "undone"
        );

        setNotifications(filteredData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Pemberitahuan Pembayaran</h2>
      <div className="flex flex-wrap gap-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              name={notification.name}
              amount={notification.amount}
              purpose={notification.purpose}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">
            Tidak ada pembayaran yang tertunda.
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
