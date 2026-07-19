import { useEffect, useState } from "react";
import { getRequest, deleteRequest } from "../../config/apiFunctions";
import PostTableBody from "./PostTableBody";
import { POSTS } from "../../config/endPoints";
import { POST_REASSIGN_TABLE_HEAD } from "../../app/constants/TableHeadings";
import TableHead from "../../common/tableHead/TableHead";
import ReassignSubCategoryModal from "./ReassignSubCategoryModal";
import i18n from "../../i18n";
import { toast } from "react-toastify";
import PageMeta from "../../common/PageMeta";
import { TITLES } from "../../app/constants";
import SearchBar from "../../common/searchBar/SearchBar";
import useSearchDebounce from "../../common/textDebounce/TextDebounce";
import Pagination from "../../common/pagination/Pagination";
import { USERS_TABLE_PAGINATION_DATA } from "../../app/constants/PaginationData";
import ConfirmModal from "../../common/modal/ConfirmModal";
import PostStatusFilter from "./PostStatusFilter";
import { isFilterableStatus } from "../../app/constants/PostStatus";
import { useSearchParams } from "react-router";

// `null` = All (omit `status` from filters). Anything else must survive a
// round-trip through the URL as a number — including 0, which is falsy.
// Non-filterable values (e.g. Sold) fall back to All so the URL can't select
// an option the dropdown doesn't offer.
const parseStatusParam = (raw) => {
  if (raw === null || raw === "" || raw === "all") return null;
  const parsed = Number(raw);
  return isFilterableStatus(parsed) ? parsed : null;
};

const Post = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // No `status` param (or an unrecognised one) means All.
  const statusFilter = parseStatusParam(searchParams.get("status"));
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
  const [selectedIds, setSelectedIds] = useState([]);
  const [showReassignModal, setShowReassignModal] = useState(false);

  const pageIds = (postList?.posts ?? []).map((p) => p.id);
  const allOnPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    setSelectedIds((prev) =>
      allOnPageSelected
        ? prev.filter((id) => !pageIds.includes(id))
        : [...new Set([...prev, ...pageIds])]
    );
  };

  const clearSelection = () => setSelectedIds([]);

  const handleOpenSuspendModal = (post, newStatus) => {
    setShowSuspendModal(true);
    setPendingStatus(newStatus);
    setUserData(post);
  };

  const handleChangeSearchText = (e) => {
    const value = e.target.value === undefined ? "" : e.target.value;
    setCurrentPage(1);
    setSearchValue(value);
    setSearchTextDebounce(value);
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
      const res = await deleteRequest(`${POSTS.DELETE}/${deleteUserId}`);
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
        console.log('bhdb', resData);
        const { data, totalCount } = resData;
        console.log('jfsdvf', totalCount);
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
    const filters = { searchtext: searchTextDebounce };

    // Explicit null check, NOT `if (statusFilter)` — status 0 (Pending) is
    // falsy and would silently be dropped, showing every post instead.
    if (statusFilter !== null) {
      filters.status = statusFilter;
    }

    getAllPosts(
      `${
        POSTS.LIST
      }?page=${currentPage}&limit=${rowsPerPage}&filters=${encodeURIComponent(
        JSON.stringify(filters)
      )}`
    );
  };

  const handleChangeStatusFilter = (nextStatus) => {
    setCurrentPage(1);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (nextStatus === null) {
          next.delete("status");
        } else {
          next.set("status", String(nextStatus));
        }
        return next;
      },
      { replace: true }
    );
  };

  useEffect(() => {
    postListCallBack();
    clearSelection();
  }, [currentPage, rowsPerPage, searchTextDebounce, statusFilter]);

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

  //   Status Modal Component
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
            âœ•
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
      <PageMeta title={TITLES?.POST.root} description="Dashboard" />

      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-xl">{TITLES?.POST.root}</h1>
      </div>

      <SearchBar
        searchValue={searchValue}
        handleChangeSearchText={handleChangeSearchText}
      />

      <PostStatusFilter
        value={statusFilter}
        onChange={handleChangeStatusFilter}
      />

      <div className="flex items-center justify-between gap-3 py-2">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            className="w-4 h-4 cursor-pointer accent-(--green-color)"
            checked={allOnPageSelected}
            onChange={handleToggleSelectAll}
            disabled={pageIds.length === 0}
          />
          Select all on this page
          {selectedIds.length > 0 && (
            <span className="ml-2 font-medium text-gray-800">
              ({selectedIds.length} selected)
            </span>
          )}
        </label>

        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={clearSelection}
              className="px-3 py-1.5 text-sm rounded-md border border-gray-300"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowReassignModal(true)}
            disabled={selectedIds.length === 0}
            className="primary-button disabled:opacity-50"
          >
            <i className="fa-solid fa-arrow-right-arrow-left pe-2" />
            Reassign subcategory
          </button>
        </div>
      </div>

      <div>
        <div className="relative w-full overflow-x-auto hide-scrollba">
          <div className="min-w-[900px]">
            <table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <TableHead headLable={POST_REASSIGN_TABLE_HEAD} />
              <PostTableBody
                postList={postList}
                postListCallBack={postListCallBack}
                handleOpenDeleteModal={handleOpenDeleteModal}
                handleOpenSuspendModal={handleOpenSuspendModal}
                loading={loading}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
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

      {/* Bulk reassign subcategory */}
      <ReassignSubCategoryModal
        isOpen={showReassignModal}
        onClose={() => setShowReassignModal(false)}
        listingIds={selectedIds}
        onSuccess={() => {
          clearSelection();
          postListCallBack();
        }}
      />
    </>
  );
};

export default Post;
