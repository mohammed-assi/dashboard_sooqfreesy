import moment from "moment/moment";
import DataNotFound from "../../../../../ui/dataNotFound/DataNotFound";
import { USERS_ADS_TABLE_HEAD } from "../../../../../app/constants/TableHeadings";
import TableSkeleton from "../../../../../ui/tableSkeleton/TableSkeleton";
import { ROUTES } from "../../../../../app/constants";
import { Link } from "react-router";
import Switch from "react-switch";
import { FILEURL } from "../../../../../config/endPoints";
import dummyImage from "../../../../../assets/images/dummy.jpg";
import { encodeId } from "../../../../../common/utilis/encrypt";
const UserAdsTableBody = ({
  adsList,
  loading,
  Driver,
  handleOpenEditModal,
  handleOpenDeleteModal,
  handleOpenSuspendModal,
  userData,
  currentPage = 1,
  rowsPerPage = 10,
}) => {
  if (!loading && (!adsList?.posts || adsList?.posts.length === 0)) {
  return (
    <DataNotFound
      colSpan={USERS_ADS_TABLE_HEAD.length}
      message="No data found"
    />
  );
}


  function StatusBadge({ status }) {
    const statusInfo = STATUS[status] || {
      label: "Unknown",
      color: "bg-gray-200 text-gray-600",
    };

    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}
      >
        {statusInfo.label}
      </span>
    );
  }

  const STATUS = {
    0: { label: "Unapproved", color: "bg-gray-100 text-gray-700" },
    1: { label: "Approved", color: "bg-green-100 text-green-700" },
    2: { label: "Rejected", color: "bg-red-100 text-red-700" },
    3: { label: "Sold", color: "bg-blue-100 text-blue-700" },
  };

  const handleSwitchChange = (user) => {
    handleOpenSuspendModal();
  };
  return (
    <tbody>
      {loading ? (
        <TableSkeleton colSpan={USERS_ADS_TABLE_HEAD.length} rows={5} />
      ) : (
        adsList?.posts.map((post, i) => {
          const {
            id,
            title,
            description,
            price,
            phone,
            country_code,
            city,
            country,
            status,
            longitude,
            latitude,
            created_at,
            sub_categoryName,
            images,
          } = post;

          const srNo = (currentPage - 1) * rowsPerPage + (i + 1);
          return (
            <tr key={i} className="bg-white border-b text-sm border-gray-200">
              <td className="px-6 py-4">{srNo}</td>
              <td
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {
                  <img
                    src={images[0].image_url ? `${FILEURL}${images[0].image_url}` : dummyImage}
                    alt={`${title}`}
                    className="w-10 h-10 rounded-full" // Styling for the avatar image
                  />
                }
              </td>
              <td className="px-6 py-4">{title}</td>
              <td className="px-6 py-4">{sub_categoryName}</td>
              <td className="px-6 py-4">
                {moment(created_at).format("MM/DD/YYYY")}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end">
                  <StatusBadge status={status} />
                  
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="group relative">
                  <Link to={`${ROUTES.USERS.detail}/${encodeId(id)}`}>
                    <i
                      className="fa-solid fa-eye fa-sm pe-3"
                      style={{
                        color: "var(--green-color)",
                        cursor: "pointer",
                      }}
                    />
                  </Link>

                  <div className="bg-(--green-color) p-2 rounded-md group-hover:flex hidden absolute -top-2 -translate-y-full left-1/2 -translate-x-1/2">
                    <span className="text-black text-sm whitespace-nowrap">
                      View
                    </span>
                    <div className="bg-inherit rotate-45 p-1 absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2"></div>
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

export default UserAdsTableBody;
