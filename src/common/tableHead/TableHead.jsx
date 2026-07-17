import React from "react";

const TableHead = ({ headLable }) => {
  return (
    <thead className="text-xs text-black uppercase bg-(--primary-color) dark:bg-gray-700 dark:text-gray-400 whitespace-nowrap">
      <tr>
        {headLable?.map((item, i) => (
          <th key={i} scope="col" className={`px-6 py-3 text-white ${item.alignment} ${item.className ?? ""}`}>
            {item.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHead;
