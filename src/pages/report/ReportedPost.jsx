import { useEffect, useState } from "react";
import { getRequest, deleteRequest } from "../../config/apiFunctions";
import ReportPostTableBody from "./ReportPostTableBody";
import { REPORT } from "../../config/endPoints";
import { REPORT_POST_TABLE_HEAD } from "../../app/constants/TableHeadings";
import TableHead from "../../common/tableHead/TableHead";
import i18n from "../../i18n";
import { toast } from "react-toastify";
import PageMeta from "../../common/PageMeta";
import { TITLES } from "../../app/constants";
import SearchBar from "../../common/searchBar/SearchBar";
import useSearchDebounce from "../../common/textDebounce/TextDebounce";
import Pagination from "../../common/pagination/Pagination";
import { USERS_TABLE_PAGINATION_DATA } from "../../app/constants/PaginationData";
import ConfirmModal from "../../common/modal/ConfirmModal";
import BackButton from "../../components/TextEditor copy";

const ReportedPost = () => {
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(false);
  const [searchValue, setSearchValue] = useState(null);
  const [searchTextDebounce, setSearchTextDebounce] = useSearchDebounce();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [totalCounts, setTotalCounts] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [error, setError] = useState(null);

  const handleOpenSuspendModal = (post, newStatus) => {
    setShowSuspendModal(true);
    setPendingStatus(newStatus);
    setUserData(post);
  };

  const handleChangeSearchText = (e) => {
    const value = e.target.value === undefined ? "" : e.target.value;
    setSearchValue(value);
    setSearchTextDebounce(value);
    setCurrentPage(1);
  };

  //   updated to accept reason
  const handleConfirmStatusChange = (reason = "") => {
    if (typeof handleSwitchChange === "function") {
      handleSwitchChange(userData, pendingStatus, reason);
    }
    setShowSuspendModal(false);
  };

  const handleOpenDeleteModal = (id) => {
    setShowDeleteModal(true);
    setDeleteUserId(id);
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      // alert(deleteUserId);
      const res = await deleteRequest(`${REPORT.DELETE}/${deleteUserId}`);
      if (res.data?.statusCode === 200) {
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 2000,
        });
        setShowDeleteModal(false);
        postListCallBack();
      }
    } catch (error) {
      toast.error(error.response?.data || "Something went wrong", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  //   updated to handle reason
  const handleSwitchChange = async (post, newStatus, reason = "") => {
    setLoading(true);

    try {
      const url = `${POSTS.CHANGE_STATUS}?listingId=${
        post?.id
      }&status=${newStatus}${
        newStatus === 2 ? `&reason=${encodeURIComponent(reason)}` : ""
      }`;

      const res = await getRequest(url);

      if (res.data.statusCode === 200) {
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 2000,
        });
        setShowSuspendModal(false);
        postListCallBack();
        setError("");
      }
    } catch (error) {
      toast.error(error.response?.data || "Something went wrong", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  async function getAllPosts(url) {
    setLoading(true);
    try {
      const response = await getRequest(url);
      const { status, data: resData } = response;

      if (resData.success && status === 200) {
        const { data } = resData;
        setPostList(data);
        setTotalCounts(data.totalCount ?? 0);
      }
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setLoading(false);
    }
  }

  const postListCallBack = () => {
    getAllPosts(
      `${REPORT.LIST}?page=${currentPage}&limit=${rowsPerPage}&search=${searchTextDebounce}&reportType=POST`
    );
  };

  useEffect(() => {
    postListCallBack();
  }, [currentPage, rowsPerPage, searchTextDebounce]);

  useEffect(() => {
    postListCallBack();

    const onLanguageChanged = () => {
      postListCallBack();
    };

    i18n.on("languageChanged", onLanguageChanged);
    return () => {
      i18n.off("languageChanged", onLanguageChanged);
    };
  }, []);

  const StatusModal = ({
    showSuspendModal,
    setShowSuspendModal,
    pendingStatus,
    handleConfirmStatusChange,
  }) => {
    const [reason, setReason] = useState("");

    const onConfirm = () => {
      if (pendingStatus === 2 && !reason.trim()) {
        setError("Please provide a reason for rejection.");
        return;
      }
      handleConfirmStatusChange(reason);
      setReason("");
    };

    if (!showSuspendModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="relative bg-white dark:bg-gray-700 rounded-lg shadow-sm w-full max-w-md p-4">
          {/* Close button */}
          <button
            onClick={() => setShowSuspendModal(false)}
            className="absolute top-3 right-3 text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg text-sm w-8 h-8 flex justify-center items-center"
          >
            ✕
          </button>

          {/* Modal Content */}
          <div className="text-center">
            <i
              className="fa-regular fa-circle-exclamation fa-2xl py-5"
              style={{ color: "rgb(243, 106, 113)" }}
            />

            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {pendingStatus === 0 &&
                "Are you sure you want to mark this as Unapproved?"}
              {pendingStatus === 1 &&
                "Are you sure you want to approve this post?"}
              {pendingStatus === 2 &&
                "Are you sure you want to reject this post?"}
            </h3>

            {/* Show reason input only if reject */}
            {pendingStatus === 2 && (
              <div className="mb-4 text-left">
                <label
                  htmlFor="reason"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Reason for rejection
                </label>
                <textarea
                  id="reason"
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm dark:bg-gray-600 dark:text-white"
                  placeholder="Enter rejection reason..."
                />
                {error && (
                  <p className="reason_error text-red-500 text-sm mt-1">
                    {error}
                  </p>
                )}
              </div>
            )}

            {/* Confirm button */}
            <button
              onClick={onConfirm}
              className={`${
                pendingStatus === 1
                  ? "bg-green-500 hover:bg-green-600"
                  : pendingStatus === 2
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gray-500 hover:bg-gray-600"
              } text-white font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5`}
            >
              Yes, I'm sure
            </button>

            {/* Cancel button */}
            <button
              onClick={() => setShowSuspendModal(false)}
              className="ml-3 primary-button"
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <PageMeta title={TITLES?.REPORT.post_repocrt} description="Dashboard" />

      <div className="flex gap-2 items-center">
        <BackButton />
        <h1 className="font-semibold text-xl">{TITLES?.REPORT.post_repocrt}</h1>
      </div>

      <SearchBar
        searchValue={searchValue}
        handleChangeSearchText={handleChangeSearchText}
      />

      <div>
        <div className="relative w-full overflow-x-auto hide-scrollba">
          <div className="min-w-[900px]">
            <table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <TableHead headLable={REPORT_POST_TABLE_HEAD} />
              <ReportPostTableBody
                postList={postList}
                postListCallBack={postListCallBack}
                handleOpenDeleteModal={handleOpenDeleteModal}
                handleOpenSuspendModal={handleOpenSuspendModal}
                loading={loading}
              />
            </table>
          </div>
        </div>
      </div>

      {!loading && (
        <Pagination
          totalItems={totalCounts}
          rowsPerPageOptions={USERS_TABLE_PAGINATION_DATA}
          defaultRowsPerPage={rowsPerPage}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
          onRowsPerPageChange={(limit) => {
            setRowsPerPage(limit);
            setCurrentPage(1);
          }}
        />
      )}

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteUser}
        message="Are you sure you want to delete this post?"
      />

      {/* Status Modal */}
      <StatusModal
        showSuspendModal={showSuspendModal}
        setShowSuspendModal={setShowSuspendModal}
        pendingStatus={pendingStatus}
        handleConfirmStatusChange={handleConfirmStatusChange}
      />
    </>
  );
};

export default ReportedPost;
