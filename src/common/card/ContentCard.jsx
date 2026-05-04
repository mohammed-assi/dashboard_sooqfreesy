import { useEffect, useRef, useState } from "react";

function ContentCard({ name, handleOpenEditModal, handleOpenDeleteModal }) {
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
    <div className="relative rounded-xl overflow-hidden w-full h-30 bg-[var(--primary-color)] group shadow-lg">
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
                  <i className="fa-solid fa-file-pen fa-sm pe-1" /> Edit
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
                  <i className="fa-solid fa-trash fa-sm pe-1" /> Delete
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="w-full max-w-xs bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition duration-300 p-5 flex flex-col gap-y-2 group">
        <div className="text-xl font-semibold text-(--green-color) tracking-wide">
          {name}
        </div>
        <div className="h-1 w-10 bg-[var(--green-color)] rounded-full group-hover:w-16 transition-all duration-300"></div>
      </div>
    </div>
  );
}

export default ContentCard;
