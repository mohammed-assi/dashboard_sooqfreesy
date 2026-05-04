import React, { useEffect, useState } from "react";
import PageMeta from "../../../../../common/PageMeta";
import { TITLES } from "../../../../../app/constants";
// import Tabs from "../../../../common/tabs/Tabs";
import { USERS_ADS_TABLE_HEAD } from "../../../../../app/constants/TableHeadings";
import TableHead from "../../../../../common/tableHead/TableHead";
import UserTableBody from "../../../section/UserTableBody";
import Pagination from "../../../../../common/pagination/Pagination";
import { USERS_TABLE_PAGINATION_DATA } from "../../../../../app/constants/PaginationData";
import {
  deleteRequest,
  getRequest,
  putRequest,
} from "../../../../../config/apiFunctions";
import { USERS } from "../../../../../config/endPoints";
import useSearchDebounce from "../../../../../common/textDebounce/TextDebounce";
import ConfirmModal from "../../../../../common/modal/ConfirmModal";
import CreateUserModal from "../CreateUserModal";
import EditUserModal from "../EditUserModal";
import SearchBar from "../../../../../common/searchBar/SearchBar";
import { toast } from "react-toastify";
import EditUserComponent from "../EditUserComponent";
import { get } from "react-hook-form";
import UserAdsTableBody from "./UserAdsTableBody";
import { useParams } from "react-router-dom";
import BackButton from "../../../../../components/TextEditor copy";

const UserAdsPage = () => {
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
  const [userData, setUserData] = useState({});

  const [adsList, setAdsList] = useState([]);
  const [searchTextDebounce, setSearchTextDebounce] = useSearchDebounce();

  const { id } = useParams(); //

  const handleChangeSearchText = (e) => {
    const value = e.target.value === undefined ? "" : e.target.value;
    setSearchValue(value);
    setSearchTextDebounce(value);
  };

  const handleChangeUserTab = (id, roleId) => {
    setActiveTab(id);
    setRoleId(roleId);
  };

  const handleOpenEditModal = (user) => {
    setShowEditModal(true);
    setEditUserId(user?.id);
  };

  const handleOpenDeleteModal = (id) => {
    setShowDeleteModal(true);
    setDeleteUserId(id);
  };

  const handleOpenSuspendModal = (user) => {
    setShowSuspendModal(true);
    setSuspendUserId(user?.id);
    // setUserStatus(user?.isVerified);
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      const res = await deleteRequest(`${USERS.DELETE}/${deleteUserId}`);
      if (res.data.statusCode === 200) {
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          closeButton: true,
        });
        setShowDeleteModal(false);
        adsListCallBack();
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
    try {
      const res = await getRequest(`${USERS.ACTIVE_INACTIVE}/${userData?.id}`);
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
        adsListCallBack();
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

  // useEffect(() => {
  //   handleSuspendActiveUser();
  // }, [userData]);

  // async function getUsers(url) {
  //   setLoading(true);
  //   try {
  //     const response = await getRequest(url);
  //     const { status } = response;
  //     const {
  //       data: { users, total },
  //       success,
  //     } = response.data;
  //     if (success && status === 200) {
  //       setUserList(users);
  //       setTotalCounts(total);
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);
  //   }
  // }

  async function getAds(url) {
    setLoading(true);
    
    try {
      const response = await getRequest(url);
      const { status, data: resData } = response;

      if (resData.success && status === 200) {
        console.log('adssss', resData);
        const { data, totalCount } = resData; // assuming API returns total

         console
         
        setAdsList(data);
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

  const adsListCallBack = () => {
    getAds(
      `${USERS.ADS}/${atob(id)}?page=${currentPage}&limit=${rowsPerPage}&filters=${encodeURIComponent(
        JSON.stringify({ searchtext: searchTextDebounce })
      )}`

    );
  };

  useEffect(() => {
    adsListCallBack();
  }, [currentPage, rowsPerPage, searchTextDebounce, roleId]);

  useEffect(() => {
    if (editUserId) {
      getUsersDetails(`${USERS.DETAILS}/${editUserId}`);
    }
  }, [editUserId]);

  return (
    <>
      <PageMeta title={TITLES?.USERS.customers} description="Dashboard" />

      <div className="flex gap-3 items-center">
        <BackButton/>
        <h1 className="font-semibold text-xl">Ads</h1>

        {/* <div className="flex justify-end items-center">
          <button
            onClick={() => setShowCreateModal(true)}
            className="primary-button"
          >
            <i className="fa-solid fa-plus pe-2" />
            New customers
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
            <TableHead headLable={USERS_ADS_TABLE_HEAD} />
            <UserAdsTableBody
              adsList={adsList}
              loading={loading}
              handleOpenEditModal={handleOpenEditModal}
              handleOpenDeleteModal={handleOpenDeleteModal}
              handleOpenSuspendModal={handleOpenSuspendModal}
              userData={setUserData}
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

      <CreateUserModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        userListCallBack={adsListCallBack}
      />
      {/* <EditUserComponent tabsData={userTabs}
        activeTab={activeTab}
        handleChangeUserTab={handleChangeUserTab}
        showEditModal={showEditModal}I
        setShowEditModal={setShowEditModal}
        userDetails={userDetails}
        userListCallBack={adsListCallBack} /> */}
      {/* <EditUserModal
        tabsData={userTabs}
        activeTab={activeTab}
        handleChangeUserTab={handleChangeUserTab}
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        userDetails={userDetails}
        userListCallBack={adsListCallBack}
      /> */}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteUser}
        message="Are you sure you want to delete this user?"
      />

      {showSuspendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative bg-white dark:bg-gray-700 rounded-lg shadow-sm w-full max-w-md p-4">
            <button
              onClick={() => setShowSuspendModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg text-sm w-8 h-8 flex justify-center items-center"
            >
              ✕
            </button>

            <div className="text-center">
              <i
                className="fa-regular fa-circle-exclamation fa-2xl py-5"
                style={{ color: "rgb(243, 106, 113)" }}
              />

              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                {userData?.status === 1
                  ? "Are you sure you want to suspend this user?"
                  : "Are you sure you want to activate this user?"}
              </h3>

              <button
                onClick={() => handleSuspendActiveUser(userData?.id)} //   call only on confirm
                className={`${
                  userData?.status === 1
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

export default UserAdsPage;
