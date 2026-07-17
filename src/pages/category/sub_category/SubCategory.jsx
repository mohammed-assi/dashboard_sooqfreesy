import React, { useEffect, useState } from "react";
import PageMeta from "../../../common/PageMeta";
import { TITLES } from "../../../app/constants";
import {
  deleteRequest,
  getRequest,
  putRequest,
} from "../../../config/apiFunctions";
import { SUBCATEGORY, CATEGORY, USERS } from "../../../config/endPoints";
import useSearchDebounce from "../../../common/textDebounce/TextDebounce";
import ConfirmModal from "../../../common/modal/ConfirmModal";
import CreateSubCategoryModel from "./CreateSubCategoryModel";
import EditSubCategoryModel from "./EditSubCategoryModel";
import SearchBar from "../../../common/searchBar/SearchBar";
import { toast } from "react-toastify";
import TableHead from "../../../common/tableHead/TableHead";
import CategorySubTableBody from "./CategorySubTableBody";
import Pagination from "../../../common/pagination/Pagination";
import { USERS_TABLE_PAGINATION_DATA } from "../../../app/constants/PaginationData";
import { CATEGORY_SUB_TABLE_HEAD } from "../../../app/constants/TableHeadings";
import BackButton from "../../../components/TextEditor copy";

const SubCategory = () => {
  const [totalCounts, setTotalCounts] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [searchTextDebounce, setSearchTextDebounce] = useSearchDebounce();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [loading, setLoading] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  const [subCategoryList, setSubCategoryList] = useState([]);
  const [mainCategoryList, setMainCategoryList] = useState([]);

  const [deleteUserId, setDeleteUserId] = useState(null);
  const [suspendUserId, setSuspendUserId] = useState(null);
  const [userStatus, setUserStatus] = useState(null);

  const [catDetail, setCatDetail] = useState(null);

  const handleChangeSearchText = (e) => {
    const value = e.target.value || "";
    setSearchValue(value);
    setSearchTextDebounce(value);
    setCurrentPage(1);
  };

  const handleOpenEditModal = (detail) => {
    setShowEditModal(true);
    setCatDetail(detail);
  };

  const handleOpenDeleteModal = (id) => {
    setDeleteUserId(id);
    setShowDeleteModal(true);
  };

  const handleOpenSuspendModal = (user) => {
    setSuspendUserId(user?.id);
    setUserStatus(user?.isVerified);
    setShowSuspendModal(true);
  };

  // ✅ FIXED: DELETE request
  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      const res = await deleteRequest(
        `${SUBCATEGORY.DELETE}/${deleteUserId}`
      );

      if (res.data.statusCode === 200) {
        toast.success(res.data.message);
        setShowDeleteModal(false);
        subCategoryListCallBack();
      }
    } catch (error) {
      toast.error(error?.response?.data || "Error deleting");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
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
        toast.success(res.data.message);
        setShowSuspendModal(false);
        subCategoryListCallBack();
      }
    } catch (error) {
      toast.error(error?.response?.data || "Error updating status");
    } finally {
      setLoading(false);
      setShowSuspendModal(false);
    }
  };

  async function getSubCategoryList(url) {
    setLoading(true);
    try {
      const response = await getRequest(url);
      const { status, data: resData } = response;

      if (resData.success && status === 200) {
        const { data, total } = resData;

        setSubCategoryList(data);
        setTotalCounts(total ?? 0); // ✅ FIXED
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function getMainCategoriesList(url) {
    try {
      const response = await getRequest(url);
      const { status, data: resData } = response;

      if (resData.success && status === 200) {
        setMainCategoryList(resData.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const subCategoryListCallBack = () => {
    getSubCategoryList(
      `${SUBCATEGORY.LIST}?page=${currentPage}&limit=${rowsPerPage}&search=${searchTextDebounce}`
    );
  };

  useEffect(() => {
    subCategoryListCallBack();
  }, [currentPage, rowsPerPage, searchTextDebounce]);

  useEffect(() => {
    getMainCategoriesList(`${CATEGORY.LIST}`);
  }, []);

  return (
    <>
      <PageMeta title={TITLES?.CATEGORY.CHILD.root} description="Dashboard" />

      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <BackButton />
          <h1 className="font-semibold text-xl">
            {TITLES?.CATEGORY.CHILD.root}
          </h1>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="primary-button"
        >
          <i className="fa-solid fa-plus pe-2" />
          New sub category
        </button>
      </div>

      <SearchBar
        searchValue={searchValue}
        handleChangeSearchText={handleChangeSearchText}
      />

      <div className="relative w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <table className="w-full text-left text-gray-500">
            <TableHead headLable={CATEGORY_SUB_TABLE_HEAD} />
            <CategorySubTableBody
              subCategoryList={subCategoryList}
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

      <CreateSubCategoryModel
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        subCategoryListCallBack={subCategoryListCallBack}
        mainCategoryList={mainCategoryList}
      />

      <EditSubCategoryModel
        showEditModal={showEditModal}
        catDetail={catDetail}
        setShowEditModal={setShowEditModal}
        mainCategoryList={mainCategoryList}
        subCategoryListCallBack={subCategoryListCallBack}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteUser}
        message="Are you sure you want to delete this sub category?"
      />

      {showSuspendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-md text-center">
            <h3 className="mb-5 text-lg">
              {userStatus === 1
                ? "Suspend this user?"
                : "Verify this user?"}
            </h3>

            <button
              onClick={handleSuspendActiveUser}
              className="primary-button"
            >
              Yes
            </button>

            <button
              onClick={() => setShowSuspendModal(false)}
              className="ml-3"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SubCategory;