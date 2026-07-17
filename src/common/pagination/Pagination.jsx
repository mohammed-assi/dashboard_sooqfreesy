import React from "react";

const Pagination = ({
  totalItems = 0,
  rowsPerPageOptions = [],
  defaultRowsPerPage = 10,
  currentPage = 1,
  onPageChange,
  onRowsPerPageChange,
}) => {
  // Calculate total pages
  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / defaultRowsPerPage)
  );

  // Previous page
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Next page
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Rows per page change
  const handleRowsPerPageChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    onRowsPerPageChange(newLimit);
  };

  // Range text (e.g. 1-10 of 2389)
  const start =
    totalItems === 0
      ? 0
      : (currentPage - 1) * defaultRowsPerPage + 1;

  const end = Math.min(
    currentPage * defaultRowsPerPage,
    totalItems
  );

  return (
    <div className="flex flex-wrap items-start justify-between gap-4 p-4 border-t text-sm">
      {/* Rows per page */}
      <div className="flex items-center gap-2">
        <span>Rows per page:</span>
        <select
          value={defaultRowsPerPage}
          onChange={handleRowsPerPageChange}
          className="border rounded px-2 py-1 text-sm"
        >
          {rowsPerPageOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination section */}
      <div className="flex flex-col items-end gap-2">
        {/* Text */}
        <span className="text-sm text-gray-600">
          {start}-{end} of {totalItems}
        </span>

        {/* Buttons under the text */}
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`w-8 h-8 flex items-center justify-center rounded border text-lg font-bold ${
              currentPage === 1
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-green-600 border-green-600 hover:bg-green-50"
            }`}
          >
            &lt;
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`w-8 h-8 flex items-center justify-center rounded border text-lg font-bold ${
              currentPage === totalPages
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-green-600 border-green-600 hover:bg-green-50"
            }`}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;