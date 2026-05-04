import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import DataNotFound from "../../ui/dataNotFound/DataNotFound";
import { CATEGORY_TABLE_HEAD_EN, CATEGORY_TABLE_HEAD_AR } from "../../app/constants/TableHeadings";
import TableSkeleton from "../../ui/tableSkeleton/TableSkeleton";
import EditCategoryModel from "./EditCategoryModel";
import { ROUTES } from "../../app/constants";
import { Link } from "react-router";
import { FILEURL } from "../../config/endPoints";
import i18n from "../../i18n";

const CategoryTableBody = ({
  categoryList,
  loading,
  handleOpenEditModal,
  handleOpenDeleteModal,
  handleOpenSuspendModal,
}) => {
  if (!loading && categoryList?.categories?.length === 0 ) {
    return (  
      <DataNotFound
        colSpan={CATEGORY_TABLE_HEAD_EN.length}
        message="No data found"
      />
    );
  }

  const [showEditModal, setShowEditModal] = useState(false);
  return (
    <tbody>
      {loading ? (
        <TableSkeleton colSpan={CATEGORY_TABLE_HEAD_EN.length} rows={5} />
      ) : (
        categoryList?.categories?.map((data, i) => {
          const { id, name, arabic_name, image_url } = data;

          console.log(id, name, arabic_name, image_url, "datadff");

          return (
            <tr key={i} className="bg-white border-b text-sm border-gray-200">
              <td className="px-6 py-4">
                {
                  <img
                    src={`${FILEURL}${image_url}`} // Using Avatar URL
                    alt={name}
                    className="w-10 h-10 rounded-full" // Styling for the avatar image
                  />
                }
              </td>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {name ? `${name}` : `${name}`}
              </th>
              {/* <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {arabic_name ? `${arabic_name}` : `${arabic_name}`}
              </th> */}
              <td className="px-6 py-4">
                <div className="flex items-center justify-end">
                  <div className="group relative">
                    <i
                      onClick={() => handleOpenEditModal(data)}
                      className="fa-solid fa-pen-to-square fa-lg pe-3"
                      style={{
                        color: "var(--primary-color)",
                        cursor: "pointer",
                      }}
                    />
                    <div className="bg-(--primary-color) p-2 rounded-md group-hover:flex hidden absolute -top-2 -translate-y-full left-1/2 -translate-x-1/2">
                      <span className="text-white text-sm whitespace-nowrap">
                        Edit
                      </span>
                      <div className="bg-inherit rotate-45 p-1 absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2"></div>
                    </div>
                  </div>

                  {/* <div className="group relative">
                    <i
                      onClick={() => handleOpenDeleteModal(id)}
                      className="fa-solid fa-trash fa-sm"
                      style={{ color: "rgb(245, 60, 69)", cursor: "pointer" }}
                    />
                    <div className="bg-red-400 p-2 rounded-md group-hover:flex hidden absolute -top-2 -translate-y-full left-1/2 -translate-x-1/2">
                      <span className="text-black text-sm whitespace-nowrap">
                        Delete
                      </span>
                      <div className="bg-inherit rotate-45 p-1 absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2"></div>
                    </div>
                  </div> */}
                </div>
              </td>
            </tr>
          );
        })
      )}
    </tbody>
  );
};

export default CategoryTableBody;
