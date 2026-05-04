import React, { useState } from "react";
import PageMeta from "../../common/PageMeta";
import { TITLES } from "../../app/constants";
import TableHead from "../../common/tableHead/TableHead";
import { PARENT_FEEDBACK_TABLE_HEAD } from "../../app/constants/TableHeadings";
import ParentFeedTableBody from "./section/ParentFeedTableBody";
import ViewParentFeedback from "./section/ViewParentFeedback";
import SearchBar from "../../common/searchBar/SearchBar";

function ParentFeedback() {
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
      <PageMeta
        title={TITLES.FEEDBACK_TO_PARENT.root}
        description="Dashboard"
      />

      <h1 className="font-semibold text-xl">
        {TITLES.FEEDBACK_TO_PARENT.root}
      </h1>
      <div className="pt-6">
        <SearchBar
          searchValue={searchValue}
          handleChangeSearchText={handleChangeSearchText}
        />
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <TableHead headLable={PARENT_FEEDBACK_TABLE_HEAD} />
            <ParentFeedTableBody
              setShowViewModal={setShowViewModal}
              setDetailsData={setDetailsData}
            />
          </table>
        </div>
      </div>
      <ViewParentFeedback
        showViewModal={showViewModal}
        setShowViewModal={setShowViewModal}
        detailsData={detailsData}
      />
    </>
  );
}

export default ParentFeedback;
