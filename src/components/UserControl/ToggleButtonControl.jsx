import React, { useState } from "react";

const ToggleButtonMinimalis = ({ userId, status = 0, onToggle }) => {
  const [isActive, setIsActive] = useState(status === 1);

  const handleToggle = () => {
    const newStatus = isActive ? 0 : 1;
    setIsActive(!isActive);
    if (onToggle) {
      onToggle(userId, newStatus);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition duration-300 ease-in-out ${
        isActive ? "bg-green-500" : "bg-red-500"
      }`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
          isActive ? "translate-x-6" : ""
        }`}
      />
    </button>
  );
};

export default ToggleButtonMinimalis;
