import React from "react";

function SearchBar({ searchValue, handleChangeSearchText }) {
  return (
    <div className="relative py-2">
      <input
        type="text"
        value={searchValue}
        onChange={(e) => handleChangeSearchText(e)}
        placeholder="Search..."
        className="w-full pl-4 pr-10 py-2 border rounded-md focus:outline-none focus:border-(--green-color)"
      />
      {searchValue && (
        <button
          type="button"
          onClick={() => handleChangeSearchText({ target: { value: "" } })}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-600 focus:outline-none"
        >
          <i className="fa-solid fa-xmark" />
        </button>
      )}
    </div>
  );
}

export default SearchBar;

