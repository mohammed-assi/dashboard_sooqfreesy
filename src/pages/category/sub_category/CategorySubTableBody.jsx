import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import DataNotFound from "../../../ui/dataNotFound/DataNotFound";
import { CATEGORY_SUB_TABLE_HEAD } from "../../../app/constants/TableHeadings";
import TableSkeleton from "../../../ui/tableSkeleton/TableSkeleton";
import EditSubCategoryModel from "./EditSubCategoryModel";
import { ROUTES } from "../../../app/constants";
import { Link } from "react-router";
import { FILEURL } from "../../../config/endPoints";

const CategorySubTableBody = ({
  subCategoryList,
  loading,
  handleOpenEditModal,
  handleOpenDeleteModal,
  handleOpenSuspendModal,
}) => {

  if (!loading && subCategoryList?.subCategories?.length === 0) {
    return (
      <DataNotFound
        colSpan={CATEGORY_SUB_TABLE_HEAD.length}
        message="No data found"
      />
    );
  }

  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <tbody>
      {loading ? (
        <TableSkeleton colSpan={CATEGORY_SUB_TABLE_HEAD.length} rows={5} />
      ) : (
        subCategoryList?.subCategories?.map((subCategoryDetail, i) => {
          const { id, name, arabic_name,image_url, category } = subCategoryDetail;

          return (
            <tr key={i} className="bg-white border-b text-sm border-gray-200">
              <td className="px-6 py-4">
                {
                  <img 
                    src={`${FILEURL}${image_url}`} // Using Avatar URL
                    alt={`${name}`}
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
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {arabic_name ? `${arabic_name}` : `${arabic_name}`}
              </th>
              <td className="px-6 py-4">{category}</td>
              <td className="px-6 py-4">
  <div className="flex items-center justify-end gap-2">

    {/* EDIT BUTTON */}
    <button
      onClick={() => handleOpenEditModal(subCategoryDetail)}
      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Edit
    </button>

    {/* DELETE BUTTON */}
    <button
      onClick={() => handleOpenDeleteModal(id)}
      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
    >
      Delete
    </button>

  </div>
</td>
            </tr>
          );
        })
      )}
    </tbody>
  );
};

export default CategorySubTableBody;
