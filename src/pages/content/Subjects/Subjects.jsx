import React, { useEffect, useState } from "react";
import PageMeta from "../../../common/PageMeta";
import { ROUTES, TITLES } from "../../../app/constants";
import { Link } from "react-router";
import ContentCard from "../../../common/card/ContentCard";
import CreateSubjectModal from "./section/CreateSubjectModal";
import EditSubjectModal from "./section/EditSubjectModal";
import ConfirmModal from "../../../common/modal/ConfirmModal";
import { SUBJECT } from "../../../config/endPoints";
import { deleteRequest, getRequest } from "../../../config/apiFunctions";
import { toast } from "react-toastify";
import CardSkeleton from "../../../common/cardSkeleton/CardSkeleton";

const Subjects = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subjectId, setSubjectId] = useState(null);
  const [deleteSubjectId, setDeleteSubjectId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subjectList, setSubjectList] = useState([]);
  const [subjectDetails, setSubjectDetails] = useState({});

  const handleOpenEditModal = (id) => {
    setSubjectId(id);
    setShowEditModal(true);
  };
  const handleOpenDeleteModal = (id) => {
    setShowDeleteModal(true);
    setDeleteSubjectId(id);
  };

  const handleDeleteSubject = async () => {
    setLoading(true);
    try {
      const res = await deleteRequest(`${SUBJECT.DELETE}/${deleteSubjectId}`);
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
        getSubjectList();
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

  async function getSubjectList() {
    setLoading(true);
    try {
      const response = await getRequest(SUBJECT.LIST);
      const { status } = response;
      const { success } = response.data;
      if (success && status === 200) {
        setSubjectList(response?.data?.data?.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function getSubjectDetails() {
    setLoading(true);
    try {
      const response = await getRequest(`${SUBJECT.DETAILS}/${subjectId}`);
      const { status } = response;
      const { success } = response.data;
      if (success && status === 200) {
        setSubjectDetails(response?.data?.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getSubjectList();
  }, []);

  useEffect(() => {
    if (subjectId !== null) {
      getSubjectDetails();
    }
  }, [subjectId]);

  return (
    <>
      <PageMeta title={TITLES?.CONTENT.root} description="Dashboard" />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-semibold text-xl">{TITLES?.CONTENT.root}</h1>
          <nav className="flex py-2" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <Link
                  to={ROUTES.CONTENT.root}
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-(--green-color)"
                >
                  Content
                </Link>
              </li>
              <li aria-current="page">
                <div className="flex items-center text-gray-500">
                  <i className="fa-solid fa-chevron-right fa-sm" />
                  <span className="ms-1 text-sm font-medium md:ms-2">
                    Subjects
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="primary-button"
        >
          <i className="fa-solid fa-plus pe-2" />
          New subject
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-5">
        {loading ? (
          <CardSkeleton />
        ) : (
          subjectList.map((subject) => (
            <ContentCard
              key={subject.id}
              name={subject.title}
              handleOpenEditModal={() => handleOpenEditModal(subject.id)}
              handleOpenDeleteModal={() => handleOpenDeleteModal(subject.id)}
            />
          ))
        )}
      </div>

      <CreateSubjectModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        loading={loading}
        setLoading={setLoading}
        getSubjectList={getSubjectList}
      />

      <EditSubjectModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        loading={loading}
        setLoading={setLoading}
        getSubjectList={getSubjectList}
        subjectDetails={subjectDetails}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteSubject}
        message="Are you sure you want to delete this subject?"
      />
    </>
  );
};

export default Subjects;
