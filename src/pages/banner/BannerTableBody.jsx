import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import DataNotFound from "../../ui/dataNotFound/DataNotFound";
import { BANNER_TABLE_HEAD } from "../../app/constants/TableHeadings";
import TableSkeleton from "../../ui/tableSkeleton/TableSkeleton";
import EditBannerModel from "./EditBannerModel";
import { ROUTES } from "../../app/constants";
import { Link } from "react-router";
import { FILEURL } from "../../config/endPoints";
import i18n from "../../i18n";

const BannerTableBody = ({
  bannerList,
  loading,
  handleOpenEditModal,
  handleOpenDeleteModal,
  handleOpenSuspendModal,
}) => {
  return (
    <tbody>
      {loading ? (
        <TableSkeleton colSpan={BANNER_TABLE_HEAD.length} rows={5} />
      ) : bannerList?.bannerList?.length === 0 ? (
        <DataNotFound
          colSpan={BANNER_TABLE_HEAD.length}
          message="No data found"
        />
      ) : (
        bannerList?.bannerList?.map((data, i) => {
          const { id, subTitle, link, banner_image, title } = data;

          return (
            <tr key={i} className="bg-white border-b text-sm border-gray-200">
              <td className="px-6 py-4">
                <img
                  src={`${FILEURL}${banner_image}`}
                  alt={title || "banner"}
                  className="w-10 h-10 rounded-full"
                />
              </td>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {title
                  ? title.length > 20
                    ? title.substring(0, 20) + "..."
                    : title
                  : "-"}
              </th>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {subTitle
                  ? subTitle.length > 20
                    ? subTitle.substring(0, 20) + "..."
                    : subTitle
                  : "-"}
              </th>

              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {link.substring(0, 20)}
                  </a>
                ) : (
                  "-"
                )}
              </th>

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

                  <div className="group relative">
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

export default BannerTableBody;
