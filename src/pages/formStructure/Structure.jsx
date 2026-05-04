import React, { useEffect, useState } from "react";
import PageMeta from "../../common/PageMeta";
import { ROUTES, TITLES } from "../../app/constants";
import Tabs from "../../common/tabs/Tabs";
import { FORM_STRUCTURE_HEAD } from "../../app/constants/TableHeadings";
import TableHead from "../../common/tableHead/TableHead";
import StructureTableBody from "./StructureTableBody";
import Pagination from "../../common/pagination/Pagination";
import { USERS_TABLE_PAGINATION_DATA } from "../../app/constants/PaginationData";
import {
  deleteRequest,
  getRequest,
  putRequest,
} from "../../config/apiFunctions";
import { FORMSTRUCTURE } from "../../config/endPoints";
import useSearchDebounce from "../../common/textDebounce/TextDebounce";
import ConfirmModal from "../../common/modal/ConfirmModal";
import SearchBar from "../../common/searchBar/SearchBar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
const Structure = () => {
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

   const handleChangeSearchText = (e) => {
    const value = e.target.value === undefined ? "" : e.target.value;
    setSearchValue(value);
    setSearchTextDebounce(value);
  };

  async function getFormList(url) {
    setLoading(true);
    try {
      const response = await getRequest(url);
      const { status, data: resData } = response;

      if (resData.success && status === 200) {
        const { data } = resData; // assuming API returns total

        setFormDataList(data);
        setTotalCounts(data.totalForms ?? 0);
      } else {
        // console.warn("API returned error:", resData.message || "Unknown error");
      }
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setLoading(false);
    }
  }

  // async function getUsersDetails(url) {
  //   setLoading(true);
  //   try {
  //     const response = await getRequest(url);
  //     const { status } = response;
  //     const { data, success } = response.data;
  //     if (success && status === 200) {
  //       setUserDetails(data);
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);
  //   }
  // }

  const formListCallBack = () => {
    getFormList(
      `${FORMSTRUCTURE.LIST}?page=${currentPage}&limit=${rowsPerPage}&search=${searchTextDebounce}`
    );
  };

  useEffect(() => {
    formListCallBack();
  }, [currentPage, rowsPerPage, searchTextDebounce, roleId]);

  // useEffect(() => {
  //   if (editUserId) {
  //     getUsersDetails(`${USERS.DETAILS}/${editUserId}`);
  //   }
  // }, [editUserId]);

  return (
    <>
      <PageMeta title={TITLES?.USERS.customers} description="Dashboard" />
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-xl">{TITLES?.FORM_STRUCTURE.root}</h1>
        <div className="flex justify-end items-center">
          <button
            // onClick={() => setShowCreateModal(true)}
            onClick={() => navigate(ROUTES?.FORM_STRUCTURE.create)}
            className="primary-button"
          >
            <i className="fa-solid fa-plus pe-2" />
            New Structure
          </button>
        </div>
      </div>

      <SearchBar
        searchValue={searchValue}
        handleChangeSearchText={handleChangeSearchText}
      />

      <div className="relative w-full overflow-x-auto hide-scrollba">
        <div className="min-w-[900px]">
          <table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <TableHead headLable={FORM_STRUCTURE_HEAD} />
            <StructureTableBody
              formDataList={formDataList}
              loading={loading}
              // handleOpenEditModal={handleOpenEditModal}
              // handleOpenDeleteModal={handleOpenDeleteModal}
              // handleOpenSuspendModal={handleOpenSuspendModal}
            />
          </table>
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

export default Structure;
