import React, { useEffect, useState } from "react";
import PageMeta from "../../../../common/PageMeta";
import { ROUTES, TITLES } from "../../../../app/constants";
import Tabs from "../../../../common/tabs/Tabs";
import { USERS_TABLE_HEAD_EN } from "../../../../app/constants/TableHeadings";
import TableHead from "../../../../common/tableHead/TableHead";
import UserTableBody from "../UserTableBody";
import Pagination from "../../../../common/pagination/Pagination";
import { USERS_TABLE_PAGINATION_DATA } from "../../../../app/constants/PaginationData";
import {
  deleteRequest,
  getRequest,
  putRequest,
} from "../../../../config/apiFunctions";
import { DRIVERS, USERS } from "../../../../config/endPoints";
import useSearchDebounce from "../../../../common/textDebounce/TextDebounce";
import ConfirmModal from "../../../../common/modal/ConfirmModal";
import CreateUserModal from "./CreateDriverModal";
import EditDriverModal from "./EditDriverModal";
import SearchBar from "../../../../common/searchBar/SearchBar";
import { toast } from "react-toastify";
import { Link } from "react-router";

const Drivers = () => {
  const userTabs = [
    { id: "all", name: "All", roleId: "" },
    { id: "students", name: "Students", roleId: "STUDENT" },
    { id: "parents", name: "Parents", roleId: "PARENT" },
    { id: "teachers", name: "Teachers", roleId: "TEACHER" },
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
  const [userList, setUserList] = useState([]);
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
    setUserStatus(user?.isVerified);
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

  async function getDriver(url) {
    setLoading(true);
    try {
      const response = await getRequest(url);
      const { status } = response;
      const {
        data: { users, total },
        success,
      } = response.data;
      if (success && status === 200) {
        setUserList(users);
        setTotalCounts(total);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function getDriverDetails(url) {
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
    getDriver(
      `${DRIVERS.LIST}?page=${currentPage}&limit=${rowsPerPage}&search=${searchTextDebounce}&role=driver`
    );
  };

  useEffect(() => {
    userListCallBack();
  }, [currentPage, rowsPerPage, searchTextDebounce, roleId]);

  useEffect(() => {
    if (editUserId) {
      getDriverDetails(`${USERS.DETAILS}/${editUserId}`);
    }
  }, [editUserId]);

  return (
    <>
      <PageMeta title={TITLES?.USERS.drivers} description="Dashboard" />

      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-xl">{TITLES?.USERS.drivers}</h1>

        <div className="flex justify-end items-center">
          <Link
            to={ROUTES.USERS.Create_New_Driver}
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-(--green-color)"
          >
            <button type="submit" className="primary-button">
              <i className="fa-solid fa-plus pe-2" />
              {"New Driver"}
            </button>
          </Link>
        </div>
      </div>

      {/* <Tabs
        tabsData={userTabs}
        activeTab={activeTab}
        handleChangeUserTab={handleChangeUserTab}
      /> */}

      <SearchBar
        searchValue={searchValue}
        handleChangeSearchText={handleChangeSearchText}
      />

      <div className="relative w-full overflow-x-auto hide-scrollba">
        <div className="min-w-[900px]">
          <table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <TableHead headLable={USERS_TABLE_HEAD_EN} />
            <UserTableBody
              Driver={true}
              userList={userList}
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
      {/* 
      <CreateUserModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        userListCallBack={userListCallBack}
      /> */}

      <EditDriverModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        userDetails={userDetails}
        userListCallBack={userListCallBack}
      />

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
                className={`${userStatus === 1
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

export default Drivers;