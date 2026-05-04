import { REPORT_SELLER_TABLE_HEAD } from "../../app/constants/TableHeadings";
import TableSkeleton from "../../ui/tableSkeleton/TableSkeleton";
import Switch from "react-switch";
import { Link } from "react-router";
import { ROUTES } from "../../app/constants";
import { encodeId } from "../../common/utilis/encrypt";
import moment from "moment/moment";
import DataNotFound from "../../ui/dataNotFound/DataNotFound";

const ReportSellerTableBody = ({
  postList,
  loading,
  handleOpenEditModal,
  handleOpenDeleteModal,
  handleOpenSuspendModal,
  handleSwitchChange, // from parent
  currentPage = 1,
  rowsPerPage = 10,
}) => {

    if (!loading && postList?.reportListings?.length === 0) {
    return (
      <DataNotFound
        colSpan={REPORT_SELLER_TABLE_HEAD.length}
        message="No data found"
      />
    );
  }
  // wrapper around parent function
  const onStatusChange = (post, newStatus) => {
    // Open modal for confirmation
    handleOpenSuspendModal(post, newStatus);
  };

  return (
    <tbody>
      {loading ? (
        <TableSkeleton colSpan={REPORT_SELLER_TABLE_HEAD.length} rows={5} />
      ) : (
        (postList?.reportListings ?? []).map((post, i) => {
          const { reporter, seller, reportList, id, createdAt, reason } = post;

          const srNo = (currentPage - 1) * rowsPerPage + (i + 1);

          return (
            <tr
              key={id || i}
              className="bg-white border-b text-sm border-gray-200"
            >
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {srNo}  
              </td>
              <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {reporter?.username || "N/A"}
              </th>   
              <td className="px-6 py-4">{seller.username || "N/A"}</td>
              <td className="px-6 py-4">{reportList.name || "N/A"}</td>
              <td className="px-6 py-4">{reason || "N/A"}</td>

              <td className="px-6 py-4">
                {moment(createdAt).format("MM/DD/YYYY")}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end">
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

export default ReportSellerTableBody;
