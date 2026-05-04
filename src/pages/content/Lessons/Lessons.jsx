import React, { useEffect, useState } from "react";
import PageMeta from "../../../common/PageMeta";
import { ROUTES, TITLES } from "../../../app/constants";
import { Link } from "react-router";
import LessonsCard from "./section/LessonsCard";
import CreateLessonModal from "./section/CreateLessonModal";
import EditLessonModal from "./section/EditLessonModal";
import ConfirmModal from "../../../common/modal/ConfirmModal";
import { deleteRequest, getRequest } from "../../../config/apiFunctions";
import { LESSON, SUBJECT } from "../../../config/endPoints";
import { toast } from "react-toastify";
import CardSkeleton from "../../../common/cardSkeleton/CardSkeleton";

function Lessons() {
  const imagePath = import.meta.env.VITE_APP_MEDIA_FILE_URL;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lessonId, setLessonId] = useState(null);
  const [deleteLessonId, setDeleteLessonId] = useState(null);
  const [lessonList, setLessonList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [lessonDetails, setLessonDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const handleOpenEditModal = (id) => {
    setLessonId(id);
    setShowEditModal(true);
  };

  const handleOpenDeleteModal = (id) => {
    setShowDeleteModal(true);
    setDeleteLessonId(id);
  };

  const handleDeleteLesson = async () => {
    setLoading(true);
    try {
      const res = await deleteRequest(`${LESSON.DELETE}/${deleteLessonId}`);
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
        getLessonList();
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

  async function getLessonList() {
    setLoading(true);
    try {
      const response = await getRequest(LESSON.LIST);
      const { status } = response;
      const { success } = response.data;
      if (success && status === 200) {
        setLessonList(response?.data?.data?.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function getLessonDetails() {
    console.log("enter");
    setLoading(true);
    try {
      const response = await getRequest(`${LESSON.DETAILS}/${lessonId}`);
      const { status } = response;
      const { success } = response.data;
      if (success && status === 200) {
        setLessonDetails(response?.data?.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

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

  useEffect(() => {
    getLessonList();
    getSubjectList();
  }, []);

  useEffect(() => {
    if (lessonId !== null) {
      getLessonDetails();
    }
  }, [lessonId]);

  console.log("lessonId", lessonId);
  console.log("deleteLessonId", deleteLessonId);
  console.log("lessonList", lessonList);
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
                    Lessons
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
          New lesson
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-5">
        {loading ? (
          <CardSkeleton />
        ) : (
          lessonList?.map((item) => (
            <LessonsCard
              key={item.id}
              name={item.title}
              img={`${imagePath}/${item.media}`}
              handleOpenEditModal={() => handleOpenEditModal(item.id)}
              handleOpenDeleteModal={() => handleOpenDeleteModal(item.id)}
            />
          ))
        )}
      </div>

      <CreateLessonModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        loading={loading}
        setLoading={setLoading}
        getLessonList={getLessonList}
        subjectList={subjectList}
      />

      <EditLessonModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        lessonDetails={lessonDetails}
        getLessonList={getLessonList}
        subjectList={subjectList}
        loading={loading}
        setLoading={setLoading}
        imagePath={imagePath}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteLesson}
        message="Are you sure you want to delete this lesson?"
      />
    </>
  );
}

export default Lessons;
