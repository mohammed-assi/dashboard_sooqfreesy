import React from "react";
import { Link } from "react-router";
import { ROUTES } from "../../../../app/constants";

function TopicsBodyTable({handleOpenDeleteModal}) {
  const topicsDetails = [
    {
      id: 1,
      topicName: "Recognition",
      lessionName: "Communication and Language Skills",
      status: 1,
    },
    {
      id: 2,
      topicName: "Comprehension",
      lessionName: "Communication and Language Skills",
      status: 1,
    },
    {
      id: 3,
      topicName: "Comprehension",
      lessionName: "Social and Emotional Development",
      status: 0,
    },
    {
      id: 4,
      topicName: "Communication",
      lessionName: "Motor Skills Development",
      status: 1,
    },
    {
      topicName: "Listening",
      lessionName: "Cognitive and Sensory Exploration",
      status: 1,
    },
  ];

  return (
    <tbody>
      {topicsDetails?.map((item, i) => (
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
          <td className="px-6 py-4">{item.topicName}</td>
          <td className="px-6 py-4">{item.lessionName}</td>
          <td className="px-6 py-4 text-center">
            <span
              className={`${
                item.status === 1
                  ? "bg-green-200 text-green-600"
                  : "bg-red-200 text-red-600"
              } px-3 py-1 text-black rounded`}
            >
              {item.status === 1 ? "Active" : "Inactive"}
            </span>
          </td>

          <td className="px-6 py-4">
            <div className="flex items-center justify-end">
              <div className="group relative">
                <Link to={`${ROUTES.CONTENT.topics.root}/${item.id}`}>
                  <i
                    className="fa-solid fa-pen-to-square fa-lg pe-3"
                    style={{
                      color: "var(--primary-color)",
                      cursor: "pointer",
                    }}
                  />
                </Link>
                <div className="bg-(--primary-color) p-2 rounded-md group-hover:flex hidden absolute -top-2 -translate-y-full left-1/2 -translate-x-1/2">
                  <span className="text-black whitespace-nowrap">Edit</span>
                  <div className="bg-inherit rotate-45 p-1 absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2"></div>
                </div>
              </div>
              <div className="group relative">
                <i
                    onClick={() => handleOpenDeleteModal(item.id)}
                  className="fa-solid fa-trash fa-lg"
                  style={{ color: "rgb(245, 60, 69)", cursor: "pointer" }}
                />
                <div className="bg-red-400 p-2 rounded-md group-hover:flex hidden absolute -top-2 -translate-y-full left-1/2 -translate-x-1/2">
                  <span className="text-black whitespace-nowrap">Delete</span>
                  <div className="bg-inherit rotate-45 p-1 absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2"></div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default TopicsBodyTable;
