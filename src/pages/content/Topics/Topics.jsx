import React, { useState } from "react";
import PageMeta from "../../../common/PageMeta";
import { ROUTES, TITLES } from "../../../app/constants";
import { Link } from "react-router";
import { TOPICS_TABLE_HEAD } from "../../../app/constants/TableHeadings";
import TableHead from "../../../common/tableHead/TableHead";
import TopicsBodyTable from "./section/TopicsBodyTable";
import ConfirmModal from "../../../common/modal/ConfirmModal";

function Topics() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTopicId, setDeleteTopicId] = useState(null);

  const handleOpenDeleteModal = (id) => {
    setShowDeleteModal(true);
    setDeleteTopicId(id);
  };

  const handleDelete = () => {
    console.log("delete subject");
  };

  console.log("deleteTopicId", deleteTopicId);
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
                    Topics
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <Link to={ROUTES.CONTENT.topics.create} className="primary-button">
          <i className="fa-solid fa-plus pe-2" />
          New topic
        </Link>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
        <table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <TableHead headLable={TOPICS_TABLE_HEAD} />
          <TopicsBodyTable handleOpenDeleteModal={handleOpenDeleteModal} />
        </table>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this topic?"
      />
    </>
  );
}

export default Topics;
