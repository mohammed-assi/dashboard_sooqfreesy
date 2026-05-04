import React from "react";

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative bg-white dark:bg-gray-700 rounded-lg shadow-sm w-full max-w-md p-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg text-sm w-8 h-8 flex justify-center items-center"
        >
          <svg
            className="w-3 h-3"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L13 13M13 1L1 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="text-center">
          <i
            className="fa-regular fa-circle-exclamation fa-2xl py-5"
            style={{ color: "rgb(243, 106, 113)" }}
          />

          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            {message}
          </h3>

          <button
            onClick={onConfirm}
            className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5"
          >
            Yes, I'm sure
          </button>
          <button onClick={onClose} className="ml-3 primary-button">
            No, cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
