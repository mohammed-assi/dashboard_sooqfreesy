import React from "react";

const Modal = ({ isOpen, onClose, title, children, position }) => {
  if (!isOpen) return null;
  const isRight = position === "right";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ps-4">
      <div
        className={`${
          isRight
            ? "ml-auto w-full max-w-lg h-[calc(100%-50px)] mt-auto animate-slideInRight"
            : "m-auto w-full max-w-xl max-h-[calc(100%-50px)]"
        } bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 md:p-5 space-y-4 text-gray-700 dark:text-gray-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
