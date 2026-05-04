import React, { useEffect, useState } from "react";
import PageMeta from "../../common/PageMeta";
import { TITLES } from "../../app/constants";
import Tabs from "../../common/tabs/Tabs";
import { CATEGORY_TABLE_HEAD_EN, CATEGORY_TABLE_HEAD_AR } from "../../app/constants/TableHeadings";
import TableHead from "../../common/tableHead/TableHead";
import UserTableBody from "../users/section/UserTableBody";
import Pagination from "../../common/pagination/Pagination";
import { USERS_TABLE_PAGINATION_DATA } from "../../app/constants/PaginationData";
import {
  deleteRequest,
  getRequest,
  putRequest,
} from "../../config/apiFunctions";
import { CATEGORY } from "../../config/endPoints";
import useSearchDebounce from "../../common/textDebounce/TextDebounce";
import ConfirmModal from "../../common/modal/ConfirmModal";
import CreateCategoryModel from "./CreateCategoryModel";
import EditCategoryModel from "./EditCategoryModel";
import SearchBar from "../../common/searchBar/SearchBar";
import { toast } from "react-toastify";
import EditCategoryComponent from "./EditCategoryComponent";
import CategoryTableBody from "./CategoryTableBody";
import i18n from "../../i18n";
import BackButton from "../../components/TextEditor copy";

const MainCategory = () => {  
  const userTabs = [
    { id: "Booking_History", name: "Booking History", roleId: "" },
    {
      id: "Wallet_Transactions",
      name: "Wallet Transactions",
      roleId: "STUDENT",
    },
    { id: "Ratings_Given", name: "Ratings_Given", roleId: "PARENT" },
  ];

  const [totalCounts, setTotalCounts] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [roleId, setRoleId] = useState("");
  const [editUserId, setEditUserId] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [suspendUserId, setSuspendUserId] = useState("");
  const [userStatus, setUserStatus] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [mainCatData, setMainCatData] = useState(false);

  const [categoryList, setCategoryList] = useState([]);
  const [searchTextDebounce, setSearchTextDebounce] = useSearchDebounce();

  const handleChangeSearchText = (e) => {
    const value = e.target.value === undefined ? "" : e.target.value;
    setSearchValue(value);
    setSearchTextDebounce(value);
  };

  const handleChangeUserTab = (id, roleId) => {
    setActiveTab(id);
    setRoleId(roleId);
  };

  const handleOpenEditModal = (data) => {
    setShowEditModal(true);
    setMainCatData(data);
  };

  const handleOpenDeleteModal = (id) => {
    setShowDeleteModal(true);
    setDeleteUserId(id);
  };

  const handleOpenSuspendModal = (user) => {
    setShowSuspendModal(true);
    setSuspendUserId(user?.id);
    setUserStatus(user?.isVerified);
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      const res = await getRequest(`${CATEGORY.DELETE}/${deleteUserId}`);
      if (res.data?.statusCode === 200) {
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          closeButton: true,
        });
        setShowDeleteModal(false);
        userListCallBack();
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response.data, {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        closeButton: true,
      });
      setLoading(false);
      setShowDeleteModal(false);
    }
    setShowDeleteModal(false);
  };

  const handleSuspendActiveUser = async () => {
    setLoading(true);
    const payload = {
      id: suspendUserId,
      isVerified: userStatus === 1 ? 0 : 1,
    };
    try {
      const res = await putRequest(USERS.SUSPEND, payload);
      if (res.data.statusCode === 200) {
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          closeButton: true,
        });
        setShowSuspendModal(false);
        userListCallBack();
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response.data, {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        closeButton: true,
      });
      setLoading(false);
    }
    setShowSuspendModal(false);
  };

  // async function getUsers(url) {
  //   setLoading(true);
  //   try {
  //     const response = await getRequest(url);
  //     const { status } = response;
  //     const total = 12;
  //     const {
  //       data: { data },
  //       success,
  //     } = response.data;
  //     if (success && status === 200) {
  //       console.log(data);
  //       setUserList(data);
  //       setTotalCounts(total);
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);
  //   }
  // }

  async function getCategory(url) {
    setLoading(true);
    try {
      const response = await getRequest(url);
      const { status, data: resData } = response;

      if (resData.success && status === 200) {
        const { data } = resData; // assuming API returns total

        setCategoryList(data);
        setTotalCounts(data.totalCount ?? 0); // fallback if total missing
      } else {
        // console.warn("API returned error:", resData.message || "Unknown error");
      }
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setLoading(false);
    }
  }

  async function getUsersDetails(url) {
    setLoading(true);
    try {
      const response = await getRequest(url);
      const { status } = response;
      const { data, success } = response.data;
      if (success && status === 200) {
        setUserDetails(data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const userListCallBack = () => {
    getCategory(
      `${CATEGORY.LIST}?currentPage=${currentPage}&limit=${rowsPerPage}&search=${searchTextDebounce}`
    );
  };

  useEffect(() => {
    userListCallBack();

    const onLanguageChanged = () => {
      userListCallBack();
    };

    i18n.on("languageChanged", onLanguageChanged);
    return () => {
      i18n.off("languageChanged", onLanguageChanged);
    };
  }, [currentPage, rowsPerPage, searchTextDebounce]);

  // useEffect(() => {
  //   userListCallBack();
  // }, );

  console.log(i18n.language, "i18n.language in main category");

  useEffect(() => {
    if (editUserId) {
      getUsersDetails(`${USERS.DETAILS}/${editUserId}`);
    }
  }, [editUserId]);

  return (
    <>
      <PageMeta title={TITLES?.USERS.customers} description="Dashboard" />
      <div className="flex gap-2  items-center">
        <BackButton />
        <h1 className="font-semibold text-xl">{TITLES?.CATEGORY.MAIN.root}</h1>
        {/* <div className="flex justify-end items-center">
          <button
            onClick={() => setShowCreateModal(true)}
            className="primary-button"
          >
            <i className="fa-solid fa-plus pe-2" />
            New category
          </button>
        </div> */}
      </div>

      <SearchBar
        searchValue={searchValue}
        handleChangeSearchText={handleChangeSearchText}
      />

      <div className="relative w-full overflow-x-auto hide-scrollba">
        <div className="min-w-[900px]">
          <table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400">

            <TableHead headLable={CATEGORY_TABLE_HEAD_EN} />
            
            <CategoryTableBody
              categoryList={categoryList}
              loading={loading}
              handleOpenEditModal={handleOpenEditModal}
              handleOpenDeleteModal={handleOpenDeleteModal}
              handleOpenSuspendModal={handleOpenSuspendModal}
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

      <CreateCategoryModel
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        userListCallBack={userListCallBack}
      />

      <EditCategoryModel
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        mainCatData={mainCatData}
        userListCallBack={userListCallBack}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteUser}
        message="Are you sure you want to delete this category?"
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

export default MainCategory;
