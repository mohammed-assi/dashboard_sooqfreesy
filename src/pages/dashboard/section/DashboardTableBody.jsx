import React from "react";
import { DASHBOARD_TABLE_HEAD } from "../../../app/constants/TableHeadings";
import moment from "moment";
import DataNotFound from "../../../ui/dataNotFound/DataNotFound";
import TableSkeleton from "../../../ui/tableSkeleton/TableSkeleton";

const DashboardTableBody = ({ userList, loading }) => {
  
  if (!loading && userList?.length === 0) {
    return (
      <DataNotFound
        colSpan={DASHBOARD_TABLE_HEAD.length}
        message="No data found"
      />
    );
  }

  return (
    <tbody>
      {loading ? (
        <TableSkeleton colSpan={DASHBOARD_TABLE_HEAD.length} rows={5} />
      ) : (
        userList?.map((user, i) => {
          const { firstName, lastName,phone, email, isVerified, dateofBirth, role } = user;
          return (
            <tr
              key={i}
              className="bg-white border-b text-sm dark:bg-gray-800 dark:border-gray-700 border-gray-200"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {lastName ? `${firstName} ${lastName}` : `${firstName}`}
              </th>
              <td className="px-6 py-4">{email}</td>
              <td className="px-6 py-4">{role}</td>
              <td className="px-6 py-4">{phone}</td>
              <td className="px-6 py-4">
                {moment(dateofBirth).format("MM/DD/YYYY")}
              </td>
              <td className="px-6 py-4 text-center">
                <span
                  className={`${
                    isVerified === 1 ? "bg-green-200 text-green-600" : "bg-red-200 text-red-600"
                  } px-3 py-1 text-black rounded-full uppercase text-xs`}
                >
                  {isVerified === 1 ? "Active" : "Inactive"}
                </span>
              </td>
            </tr>
          );
        })
      )}
    </tbody>
  );
};

export default DashboardTableBody;
