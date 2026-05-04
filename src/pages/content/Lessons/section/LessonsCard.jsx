import React, { useEffect, useRef, useState } from "react";

function LessonsCard({
  name,
  img,
  handleOpenEditModal,
  handleOpenDeleteModal,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="relative group w-full h-60 rounded-xl overflow-hidden bg-white transform transition duration-500 hover:shadow-xl">
      <div className="absolute top-0 right-0" ref={dropdownRef}>
        <div className="flex justify-end px-2 pt-2">
          <button
            onClick={() => setOpen(!open)}
            className="w-6 h-6 text-[var(--green-color)] bg-white rounded-full flex items-center justify-center shadow transition hover:rotate-90"
            type="button"
          >
            <i className="fa-solid fa-ellipsis" />
          </button>
        </div>

        {open && (
          <div className="absolute right-1 mt-2 z-10 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-auto text-sm animate-fade-in-up">
            <ul className="py-1">
              <li>
                <button
                  onClick={() => {
                    handleOpenEditModal();
                    setOpen(false);
                  }}
                  className="px-2 py-1 rounded-full flex items-center justify-center text-[var(--green-color)] w-full"
                >
                  <i className="fa-solid fa-file-pen fa-sm pe-1" />
                  Edit
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    handleOpenDeleteModal();
                    setOpen(false);
                  }}
                  className="px-2 py-1 rounded-full flex items-center justify-center text-red-500 w-full"
                >
                  <i className="fa-solid fa-trash fa-sm pe-1" />
                  Delete
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="h-40 w-full bg-main-700 flex items-center justify-center p-4">
        <img
          src={img}
          alt={name}
          className="object-contain h-full transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="h-20 w-full bg-main-500 flex items-center justify-center">
        <p className="text-white text-center font-semibold px-2 text-base leading-snug transition-opacity duration-500 group-hover:opacity-90">
          {name}
        </p>
      </div>
    </div>
  );
}

export default LessonsCard;
