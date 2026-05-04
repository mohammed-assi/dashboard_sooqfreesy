import React from "react";

function FeedbackTableBody({ setShowViewModal, setDetailsData }) {
  const reportsData = [
    {
      id: 1,
      name: "Luffy",
      subject: "English",
      lesson: "Social and Emotional Development",
      notes:
        "Communication and Language Skills Social and Emotional Development",
    },
    {
      id: 2,
      name: "Zoro",
      subject: "Maths",
      lesson: "Communication and Language Skills",
      notes:
        "Communication and Language Skills Communication and Language Skills",
    },
    {
      id: 3,
      name: "Nami",
      subject: "Science",
      lesson: "Social and Emotional Development",
      notes:
        "Social and Emotional Development Social and Emotional Development",
    },
    {
      id: 4,
      name: "Usopp",
      subject: "Maths",
      lesson: "Motor Skills Development",
      notes: "Motor Skills Development Motor Skills Development",
    },
    {
      name: "Sanji",
      subject: "English",
      lesson: "Cognitive and Sensory Exploration",
      notes:
        "Cognitive and Sensory Exploration Cognitive and Sensory Exploration",
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
          <td className="px-6 py-4">{item.subject}</td>
          <td className="px-6 py-4">{item.lesson}</td>
          <td className="px-6 py-4">
            {item.notes?.length > 50
              ? `${item.notes.slice(0, 50)}...`
              : item.notes}
          </td>

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
                <div className="bg-orange-300 p-2 rounded-md group-hover:flex hidden absolute -top-2 -translate-y-full left-1/2 -translate-x-1/2">
                  <span className="text-orange-700 whitespace-nowrap text-sm ">
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

export default FeedbackTableBody;
