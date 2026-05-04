import React from "react";
import notFoundImg from "../../assets/images/no-data-found.jpg";

function DataNotFound({ message, colSpan }) {
  return (
    <tbody>
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
        <td colSpan={colSpan} className="px-6 py-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg text-red-500">{message}</p>
            <img
              src={notFoundImg}
              alt="No data found"
              className="w-100 h-100 object-contain mb-4 opacity-80"
            />
          </div>
        </td>
      </tr>
    </tbody>
  );
}

export default DataNotFound;
