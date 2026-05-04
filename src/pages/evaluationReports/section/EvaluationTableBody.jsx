import React from "react";

function EvaluationTableBody({ setShowViewModal, setDetailsData }) {
  const reportsData = [
    {
      id: 1,
      name: "Luffy",
      notes: "Communication and Language Skills",
      score: 5,
    },
    {
      id: 2,
      name: "Zoro",
      notes: "Communication and Language Skills",
      score: 4,
    },
    {
      id: 3,
      name: "Nami",
      notes: "Social and Emotional Development",
      score: 3,
    },
    {
      id: 4,
      name: "Usopp",
      notes: "Motor Skills Development",
      score: 2,
    },
    {
      name: "Sanji",
      notes: "Cognitive and Sensory Exploration",
      score: 4,
    },
  ];

  return (
    <tbody>
      {reportsData?.map((item, i) => (
        <tr
          key={i}
          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
        >
          <th
            scope="row"
            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {`${i + 1}.`}
          </th>
          <td className="px-6 py-4">{item.name}</td>
          <td className="px-6 py-4">{item.score}</td>
          <td className="px-6 py-4">{item.notes}</td>

          <td className="px-6 py-4">
            <div className="flex items-center justify-end">
              <div className="group relative">
                <i
                  onClick={() => {
                    setShowViewModal(true);
                    setDetailsData(item);
                  }}
                  className="fa-duotone fa-solid fa-eye fa-lg"
                  style={{
                    color: "var(--green-color)",
                    cursor: "pointer",
                  }}
                />
                <div className="bg-[var(--green-color)] p-2 rounded-md group-hover:flex hidden absolute -top-2 -translate-y-full left-1/2 -translate-x-1/2">
                  <span className="text-main whitespace-nowrap text-sm">
                    View
                  </span>
                  <div className="bg-inherit rotate-45 p-1 absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2"></div>
                </div>
              </div>
              {/* <div className="group relative">
                <i
                  onClick={() => handleOpenDeleteModal(item.id)}
                  className="fa-solid fa-trash fa-lg"
                  style={{ color: "rgb(245, 60, 69)", cursor: "pointer" }}
                />
                <div className="bg-red-400 p-2 rounded-md group-hover:flex hidden absolute -top-2 -translate-y-full left-1/2 -translate-x-1/2">
                  <span className="text-black whitespace-nowrap">Delete</span>
                  <div className="bg-inherit rotate-45 p-1 absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2"></div>
                </div>
              </div> */}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default EvaluationTableBody;
