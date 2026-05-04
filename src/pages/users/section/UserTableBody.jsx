import moment from "moment/moment";
import DataNotFound from "../../../ui/dataNotFound/DataNotFound";
import { USERS_TABLE_HEAD_EN } from "../../../app/constants/TableHeadings";
import TableSkeleton from "../../../ui/tableSkeleton/TableSkeleton";
import { ROUTES } from "../../../app/constants";
import { Link } from "react-router";
import Switch from "react-switch";
import { FILEURL } from "../../../config/endPoints";
import dummyImage from "../../../assets/images/dummy.jpg";
import { encodeId } from "../../../common/utilis/encrypt"; 
import { useState } from "react";

const UserTableBody = ({
  userList,
  loading,
  Driver,
  handleOpenEditModal,
  handleOpenDeleteModal,
  handleOpenSuspendModal,
  userData,
}) => {

  const [searchTerm, setSearchTerm] = useState("");

  // Filter users based on search term
  const filteredUsers = userList?.customers?.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user?.username?.toLowerCase().includes(searchLower) ||
      user?.email?.toLowerCase().includes(searchLower) ||
      user?.phone?.toString().includes(searchLower)
    );
  });

  const handleSwitchChange = (user) => {
    userData(user);
    handleOpenSuspendModal(user);
  };

  if (!loading && (!filteredUsers || filteredUsers.length === 0)) {
    return (
      <>
        {/* Search Input */}
        <DataNotFound colSpan={USERS_TABLE_HEAD_EN.length} message="No data found" />
      </>
    );
  }

  console.log(userList, "userList");

  return (
    <>
      {/* Search Input */}
      <tbody>
        {loading ? (
          <TableSkeleton colSpan={USERS_TABLE_HEAD_EN.length} rows={5} />
        ) : (
          filteredUsers?.map((user, i) => {
            const {
              user_profile_url,
              city,
              isVerified,
              dateofBirth,
              role,
              email,
              username,
              id,
              isBlocked,
              lastName,
              country_code,
              phone,
              status,
              gender,
              created_at,
              profileImg,
            } = user;
            return (
              <tr key={i} className="bg-white border-b text-sm border-gray-200">
                <td className="px-6 py-4">
                  <img
                    src={
                      user_profile_url
                        ? `${FILEURL}${user_profile_url}`
                        : dummyImage
                    }
                    alt={`${username}`}
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {username ? `${username}` : "-"}
                </th>
                <td className="px-6 py-4">
                  {phone ? `${country_code}-${phone}` : "-"}
                </td>
                <td className="px-6 py-4">{email ? email : "-"}</td>
                <td className="px-6 py-4">{gender ? gender : "-"} </td>
                <td className="px-6 py-4">
                  {moment(created_at).format("MM/DD/YYYY")}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end">
                    <Switch
                      checked={status === 1}
                      onChange={() => handleSwitchChange(user)}
                      onColor="#22c55e"
                      offColor="#ef4444"
                      onHandleColor="#ffffff"
                      offHandleColor="#ffffff"
                      uncheckedIcon={false}
                      checkedIcon={false}
                      height={20}
                      width={40}
                      handleDiameter={18}
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="group relative">
                    <Link to={`${ROUTES.USERS.ads}/${encodeId(id)}`}>
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
                        Activity
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
    </>
  );
};

export default UserTableBody;
