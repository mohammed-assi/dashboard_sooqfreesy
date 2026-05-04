import React, { useState } from "react";
import { TITLES } from "../../app/constants";
import PageMeta from "../../common/PageMeta";
import { EVALUATION_REPORTS_TABLE_HEAD } from "../../app/constants/TableHeadings";
import TableHead from "../../common/tableHead/TableHead";
import EvaluationTableBody from "./section/EvaluationTableBody";
import ViewReportModal from "./section/ViewReportModal";
import SearchBar from "../../common/searchBar/SearchBar";
import DateRangePicker from "../../common/dateRangePicker/DateRangePicker";

const reports = [
  {
    id: 1,
    icon: "fa-solid fa-clock",
    name: "Time Management",
    score: "20",
    color: "#FFC700",
  },
  {
    id: 2,
    icon: "fa-solid fa-bullseye-arrow",
    name: "Focus & Attention",
    score: "85",
    color: "#00CCFF",
  },
  {
    id: 3,
    icon: "fa-solid fa-book-open",
    name: "Work Discipline",
    score: "90",
    color: "#FF6D00",
  },
  {
    id: 4,
    icon: "fa-solid fa-bell",
    name: "Avoidance of Distractions",
    score: "15",
    color: "#9C27B0",
  },
  {
    id: 5,
    icon: "fa-solid fa-timer",
    name: "Seriousness & Regularity",
    score: "96",
    color: "#00C853",
  },
  {
    id: 6,
    icon: "fa-solid fa-hourglass-half",
    name: "Submission Deadlines",
    score: "98",
    color: "#AEEA00",
  },
  {
    id: 7,
    icon: "fa-solid fa-graduation-cap",
    name: "Academic Results",
    score: "88",
    color: "#FF4081",
  },
];

function EvaluationReports() {
  const [showViewModal, setShowViewModal] = useState(false);
  const [detailsData, setDetailsData] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const handleChangeSearchText = (e) => {
    const value = e.target.value === undefined ? "" : e.target.value;
    setSearchValue(value);
    // setSearchTextDebounce(value);
  };
  console.log("dateRange--->", dateRange);

  return (
    <>
      <PageMeta
        title={TITLES?.EVALUATION_REPORTS.root}
        description="Dashboard"
      />

      <h1 className="font-semibold text-xl">
        {TITLES?.EVALUATION_REPORTS.root}
      </h1>

      <div className="pt-6">
        <DateRangePicker
          fromDate={dateRange.from}
          toDate={dateRange.to}
          onChange={(newRange) => setDateRange(newRange)}
        />
        <SearchBar
          searchValue={searchValue}
          handleChangeSearchText={handleChangeSearchText}
        />
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <TableHead headLable={EVALUATION_REPORTS_TABLE_HEAD} />
            <EvaluationTableBody
              setShowViewModal={setShowViewModal}
              setDetailsData={setDetailsData}
            />
          </table>
        </div>
      </div>

      <ViewReportModal
        showViewModal={showViewModal}
        setShowViewModal={setShowViewModal}
        detailsData={detailsData}
        reports={reports}
      />
    </>
  );
}

export default EvaluationReports;
