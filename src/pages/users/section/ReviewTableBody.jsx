import moment from "moment/moment";
import DataNotFound from "../../../ui/dataNotFound/DataNotFound";
import { REVIEW_TABLE_HEAD } from "../../../app/constants/TableHeadings";
import TableSkeleton from "../../../ui/tableSkeleton/TableSkeleton";
import { ROUTES } from "../../../app/constants";
import { Link } from "react-router";
import Switch from "react-switch";
import { FILEURL } from "../../../config/endPoints";
import dummyImage from "../../../assets/images/dummy.jpg";
import { encodeId } from "../../../common/utilis/encrypt";
import { useParams } from "react-router-dom";
import RatingStars from "../../../common/Rating/RatingStars";

const ReviewTableBody = ({
  userList,
  loading,
  Driver,
  handleOpenEditModal,
  handleOpenDeleteModal,
  handleOpenSuspendModal,
  userData,
  currentPage = 1,
  rowsPerPage = 10
}) => {
  if (!loading && userList?.length === 0) {
    return (
      <DataNotFound
        colSpan={REVIEW_TABLE_HEAD.length}
        message="No data found"
      />
    );
  }

  const { id } = useParams();

  console.log(id , "idwww");

  const handleSwitchChange = (user) => {
    userData(user);
    handleOpenSuspendModal(user);
  };
  return (
    <tbody>
      {loading ? (
        <TableSkeleton colSpan={REVIEW_TABLE_HEAD.length} rows={5} />
      ) : (
        userList?.map((user, i) => {
          const {
               username,
    rating,
    review_text,
    created_at
          } = user;
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
                {username ? `${username}` : "-"}
              </th>
              <td className="px-6 py-4">
                <RatingStars
                  rating={Number(rating || 0)}
                />
              </td>
              <td className="px-6 py-4">{review_text ? review_text : "-"}</td>
              {/* <td className="px-6 py-4">{city ? city : "N/A"}</td> */}
               <td className="px-6 py-4">{moment(created_at).format("MM/DD/YYYY")}</td>
              
                          
            
            </tr>
          );
        })
      )}
    </tbody>
  );
};

export default ReviewTableBody;
