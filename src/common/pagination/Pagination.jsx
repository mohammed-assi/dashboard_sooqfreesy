import React from "react";

const Pagination = ({
  totalItems,
  rowsPerPageOptions,
  defaultRowsPerPage,
  currentPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / defaultRowsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handleRowsPerPageChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    onRowsPerPageChange(newLimit);
  };

  const start = (currentPage - 1) * defaultRowsPerPage + 1;
  const end = Math.min(currentPage * defaultRowsPerPage, totalItems);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t text-sm">
      <div className="flex items-center gap-2">
        <span>Rows per page:</span>
        <select
          value={defaultRowsPerPage}
          onChange={handleRowsPerPageChange}
          className="border rounded px-2 py-1 text-sm"
        >
          {rowsPerPageOptions?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span>
          {start}-{end} of {totalItems}
        </span>
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${currentPage === 1 ? "text-gray-400 " : "text-(--green-color)"
            }`}
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${currentPage === totalPages
              ? "text-gray-400"
              : "text-(--green-color)"
            }`}
        >
          <i className="fa-solid fa-arrow-right" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
