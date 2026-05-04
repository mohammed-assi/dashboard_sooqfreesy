import React from "react";

function ParentFeedTableBody({ setShowViewModal, setDetailsData }) {
  const reportsData = [
    {
      id: 1,
      name: "Luffy",
      parent_name: "Tom",
      title: "English",
      feedback:
        "Communication and Language Skills Social and Emotional Development",
    },
    {
      id: 2,
      name: "Zoro",
      parent_name: "Jullie",
      title: "Maths",
      feedback:
        "Communication and Language Skills Communication and Language Skills",
    },
    {
      id: 3,
      name: "Nami",
      parent_name: "Trump",
      title: "Science",
      feedback:
        "Social and Emotional Development Social and Emotional Development",
    },
    {
      id: 4,
      name: "Usopp",
      parent_name: "Anglina",
      title: "Maths",
      feedback: "Motor Skills Development Motor Skills Development",
    },
    {
      name: "Sanji",
      parent_name: "Ruby",
      title: "English",
      feedback:
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
          <td className="px-6 py-4">{item.parent_name}</td>
          <td className="px-6 py-4">{item.title}</td>
          <td className="px-6 py-4">
            {item.feedback?.length > 50
              ? `${item.feedback.slice(0, 50)}...`
              : item.feedback}
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

export default ParentFeedTableBody;
