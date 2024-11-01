import React from "react";

const ApplyButtonControl = ({ onApply }) => {
  return (
    <button
      onClick={onApply}
      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition duration-300 ease-in-out"
    >
      Apply Changes
    </button>
  );
};

export default ApplyButtonControl;
