import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import DataNotFound from "../../ui/dataNotFound/DataNotFound";
import { FORM_STRUCTURE_HEAD } from "../../app/constants/TableHeadings";
import TableSkeleton from "../../ui/tableSkeleton/TableSkeleton";
import { ROUTES } from "../../app/constants";
import { Link } from "react-router";
import { encodeId } from "../../common/utilis/encrypt";

const StructureTableBody = ({
  formDataList,
  loading,
  handleOpenEditModal,
  handleOpenDeleteModal,
  handleOpenSuspendModal,
  currentPage = 1,
  rowsPerPage = 10,
}) => {
  console.log("structureData", formDataList);
  if (!loading && (!formDataList?.forms || formDataList.forms.length === 0)) {
    return (
      <DataNotFound
        colSpan={FORM_STRUCTURE_HEAD.length}
        message="No data found"
      />
    );
  }

  const [showEditModal, setShowEditModal] = useState(false);
  return (
    <tbody>
      {loading ? (
        <TableSkeleton colSpan={FORM_STRUCTURE_HEAD.length} rows={5} />
      ) : (
        formDataList?.forms?.map((data, i) => {
          const { id, name, image_url, category, subCategory } = data;

          const srNo = (currentPage - 1) * rowsPerPage + (i + 1);

          return (
            <tr key={i} className="bg-white border-b text-sm border-gray-200">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {srNo}
              </td>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {category.name ? `${category.name}` : `${category.name}`}
              </th>

              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {subCategory.name
                  ? `${subCategory.name}`
                  : `${subCategory.name}`}
              </th>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end">
                  <div className="group relative">
                    <Link to={`${ROUTES.FORM_STRUCTURE.update}/${encodeId(id)}`}>
                        <i
                          className="fa-solid fa-pen-to-square fa-lg pe-3"
                          style={{
                            color: "var(--primary-color)",
                            cursor: "pointer",
                          }}
                        />
                    </Link>

                    <div className="bg-(--primary-color) p-2 rounded-md group-hover:flex hidden absolute -top-2 -translate-y-full left-1/2 -translate-x-1/2">
                      <span className="text-white text-sm whitespace-nowrap">
                        Edit
                      </span>
                      <div className="bg-inherit rotate-45 p-1 absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2"></div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          );
        })
      )}
    </tbody>
  );
};

export default StructureTableBody;
