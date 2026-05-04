import React, { useEffect, useState } from "react";
import PageMeta from "../../common/PageMeta";
import { ROUTES, TITLES } from "../../app/constants";
import Tabs from "../../common/tabs/Tabs";
import { CONTENT_MANAGEMENT_HEAD, FORM_STRUCTURE_HEAD } from "../../app/constants/TableHeadings";
import TableHead from "../../common/tableHead/TableHead";
import ContentManagementTableBody from "./ContentManagementTableBody";
import Pagination from "../../common/pagination/Pagination";
import { USERS_TABLE_PAGINATION_DATA } from "../../app/constants/PaginationData";
import {
  deleteRequest,
  getRequest,
  putRequest,
} from "../../config/apiFunctions";
import { CONTENTMANAGEMENT, FORMSTRUCTURE } from "../../config/endPoints";
import useSearchDebounce from "../../common/textDebounce/TextDebounce";
import ConfirmModal from "../../common/modal/ConfirmModal";
import SearchBar from "../../common/searchBar/SearchBar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
const ContentManagement = () => {
    const navigate = useNavigate();

  const [totalCounts, setTotalCounts] = useState(null);
  const [roleId, setRoleId] = useState("");
  const [userStatus, setUserStatus] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  const [formDataList, setFormDataList] = useState([]);
  const [searchTextDebounce, setSearchTextDebounce] = useSearchDebounce();


    async function getContentList(url) {
      setLoading(true);
      try {
        const response = await getRequest(url);
        const { status, data: resData } = response;
  
        if (resData.success && status === 200) {
          const { data, total } = resData; // assuming API returns total
  
          setFormDataList(data);
          setTotalCounts(total ?? 0); // fallback if total missing
        } else {
          // console.warn("API returned error:", resData.message || "Unknown error");
        }
      } catch (error) {
        console.error("Request failed:", error);
      } finally {
        setLoading(false);
      }
    }


  const formListCallBack = () => {
    getContentList(
      `${CONTENTMANAGEMENT.LIST}`
    );
  };

  useEffect(() => {
    formListCallBack();
  }, [currentPage, rowsPerPage, searchTextDebounce, roleId]);



  return (
    <>
      <PageMeta title={TITLES?.USERS.customers} description="Dashboard" />
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-xl">{TITLES?.CONTEMT_MANAGEMENT.root}</h1>
        {/* <div className="flex justify-end items-center">
          <button
            // onClick={() => setShowCreateModal(true)}
            onClick={() => navigate(ROUTES?.CONTEMT_MANAGEMENT.create)}

            className="primary-button"
          >
            <i className="fa-solid fa-plus pe-2" />
            Add New Content
          </button>
        </div> */}
      </div>

      {/* <SearchBar
        searchValue={searchValue}
        // handleChangeSearchText={handleChangeSearchText}
      /> */}

      <div className="relative w-full overflow-x-auto hide-scrollba">
        <div className="min-w-[900px]">
          {/* <table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400"> */}
            {/* <TableHead headLable={CONTENT_MANAGEMENT_HEAD} /> */}
            <ContentManagementTableBody
              formDataList={formDataList}
              loading={loading}
              // handleOpenEditModal={handleOpenEditModal}
              // handleOpenDeleteModal={handleOpenDeleteModal}
              // handleOpenSuspendModal={handleOpenSuspendModal}
            />
          {/* </table> */}
        </div>
      </div>
      {/* {!loading && (
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
      )} */}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        // onConfirm={handleDeleteUser}
        message="Are you sure you want to delete this user?"
      />

      {showSuspendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative bg-white dark:bg-gray-700 rounded-lg shadow-sm w-full max-w-md p-4">
            <button
              onClick={() => setShowSuspendModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg text-sm w-8 h-8 flex justify-center items-center"
            >
              <svg
                className="w-3 h-3"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L13 13M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="text-center">
              <i
                className="fa-regular fa-circle-exclamation fa-2xl py-5"
                style={{ color: "rgb(243, 106, 113)" }}
              />

              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                {userStatus === 1
                  ? "Are you sure you want to suspend this user?"
                  : "Are you sure you want to verify this user?"}
              </h3>

              <button
                onClick={handleSuspendActiveUser}
                className={`${
                  userStatus === 1
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5`}
              >
                Yes, I'm sure
              </button>
              <button
                onClick={() => setShowSuspendModal(false)}
                className="ml-3 primary-button"
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContentManagement;
