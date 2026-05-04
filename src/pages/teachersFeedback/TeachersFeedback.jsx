import React, { useState } from "react";
import PageMeta from "../../common/PageMeta";
import { TITLES } from "../../app/constants";
import TableHead from "../../common/tableHead/TableHead";
import { TEACHERS_FEEDBACK_TABLE_HEAD } from "../../app/constants/TableHeadings";
import FeedbackTableBody from "./section/FeedbackTableBody";
import ViewFeedbak from "./section/ViewFeedbak";
import SearchBar from "../../common/searchBar/SearchBar";

function TeachersFeedback() {
  const [showViewModal, setShowViewModal] = useState(false);
  const [detailsData, setDetailsData] = useState({});
  const [searchValue, setSearchValue] = useState("");

  const handleChangeSearchText = (e) => {
    const value = e.target.value === undefined ? "" : e.target.value;
    setSearchValue(value);
    // setSearchTextDebounce(value);
  };
  return (
    <>
      <PageMeta title={TITLES.FEEDBACK.root} description="Dashboard" />

      <h1 className="font-semibold text-xl">{TITLES.FEEDBACK.root}</h1>

      <div className="pt-6">
        <SearchBar
          searchValue={searchValue}
          handleChangeSearchText={handleChangeSearchText}
        />
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <TableHead headLable={TEACHERS_FEEDBACK_TABLE_HEAD} />
            <FeedbackTableBody
              setShowViewModal={setShowViewModal}
              setDetailsData={setDetailsData}
            />
          </table>
        </div>
      </div>
      <ViewFeedbak
        showViewModal={showViewModal}
        setShowViewModal={setShowViewModal}
        detailsData={detailsData}
      />
    </>
  );
}

export default TeachersFeedback;
