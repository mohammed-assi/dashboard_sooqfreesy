import moment from "moment";
import React from "react";
import DataNotFound from "../../ui/dataNotFound/DataNotFound";
import { BANNER_TABLE_HEAD, SUPPORT_TABLE_HEAD } from "../../app/constants/TableHeadings";
import TableSkeleton from "../../ui/tableSkeleton/TableSkeleton";

const SupportTableBody = ({
  bannerList,
  loading,
  handleOpenEditModal,
}) => {
  // ✅ Handle early return for no data (when not loading)
  if (!loading && (!bannerList || bannerList.length === 0)) {
    return (
  
        <DataNotFound
          colSpan={SUPPORT_TABLE_HEAD.length}
          message="No data found"
        />
    
    );
  }

  return (
    <tbody>
      {loading ? (
        <TableSkeleton colSpan={BANNER_TABLE_HEAD.length} rows={5} />
      ) : (
        bannerList?.map((data, i) => {
          const {
            id,
            username,
            os_platform,
            email,
            reportName,
            country_code,
            phone,
            created_at,
          } = data;

          return (
            <tr
              key={id || i}
              className="bg-white border-b text-sm border-gray-200"
            >
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {username || "-"}
              </td>

              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {email || "-"}
              </td>

              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {phone ? `${country_code}-${phone}` : "-"}
              </td>

              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {os_platform || "-"}
              </td>

              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {reportName || "-"}
              </td>

              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {created_at ? moment(created_at).format("MM/DD/YYYY") : "-"}
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center justify-end">
                  <div className="relative group">
                    <i
                      onClick={() => handleOpenEditModal(data)}
                      className="fa-solid fa-eye fa-lg pe-3 cursor-pointer"
                      style={{ color: "var(--primary-color)" }}
                    />
                    <div className="hidden group-hover:flex flex-col items-center absolute -top-2 -translate-y-full left-1/2 -translate-x-1/2">
                      <div className="bg-[var(--primary-color)] text-white text-sm px-2 py-1 rounded-md whitespace-nowrap">
                        View
                      </div>
                      <div className="bg-[var(--primary-color)] rotate-45 w-2 h-2 absolute bottom-0 translate-y-1/2"></div>
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

export default SupportTableBody;
