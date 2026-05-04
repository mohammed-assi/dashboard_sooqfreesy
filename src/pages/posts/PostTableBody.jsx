import { POST_TABLE_HEAD } from "../../app/constants/TableHeadings";
import TableSkeleton from "../../ui/tableSkeleton/TableSkeleton";
import Switch from "react-switch";
import { Link } from "react-router";
import { ROUTES } from "../../app/constants";
import { encodeId } from "../../common/utilis/encrypt";
import DataNotFound from "../../ui/dataNotFound/DataNotFound";

const PostTableBody = ({
  postList,
  loading,
  handleOpenEditModal,
  handleOpenDeleteModal,
  handleOpenSuspendModal,
  handleSwitchChange, // from parent
  currentPage = 1,
  rowsPerPage = 10,
}) => {

  if (!loading && (!postList?.posts || postList?.posts.length === 0)) {
    return (
      <DataNotFound
        colSpan={POST_TABLE_HEAD.length}
        message="No data found"
      />
    );
  }
  // wrapper around parent function
  const onStatusChange = (post, newStatus) => {
    // Open modal for confirmation
    handleOpenSuspendModal(post, newStatus);
  };

  console.log(postList.posts);

  return (
    <tbody>
      {loading ? (
        <TableSkeleton colSpan={POST_TABLE_HEAD.length} rows={5} />
      ) : (
        (postList?.posts ?? []).map((post, i) => {
          const {
            categoryName,
            sub_categoryName,
            title,
            username,
            id,
            status,
          } = post;

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
                {username || "N/A"}
              </th>
              <td className="px-6 py-4">{categoryName || "N/A"}</td>
              <td className="px-6 py-4">{sub_categoryName || "N/A"}</td>
              <td className="px-6 py-4">{title || "N/A"}</td>

              <td className="px-6 py-4">
                <div className="flex items-center justify-end">
                  {status === 3 ? (
                    <span className="px-2 py-1 text-sm rounded-md border border-gray-300 text-gray-600 bg-gray-100">
                      Sold
                    </span>
                  ) : (
                    <select
                      value={status}
                      onChange={(e) =>
                        onStatusChange(post, Number(e.target.value))
                      }
                      className={`
          px-2 py-1 text-sm rounded-md border cursor-pointer
          focus:outline-none focus:ring-1 transition-colors
          ${status === 1 ? "border-green-400 text-green-600 bg-green-50" : ""}
          ${status === 2 ? "border-red-400 text-red-600 bg-red-50" : ""}
          ${status === 0 ? "border-gray-300 text-gray-600 bg-gray-50" : ""}
        `}
                    >
                      <option value={0}>Unapproved</option>
                      <option value={1}>Approved</option>
                      <option value={2}>Rejected</option>
                    </select>
                  )}
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center justify-end">
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
                    <div className="bg-[var(--green-color)] p-2 rounded-md group-hover:flex hidden absolute -top-2 -translate-y-full left-1/2 -translate-x-1/2">
                      <span className="text-black text-sm whitespace-nowrap">
                        View
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

export default PostTableBody;
