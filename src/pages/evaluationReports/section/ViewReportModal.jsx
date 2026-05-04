import React from "react";
import Modal from "../../../common/modal/Modal";
import ProgressBar from "../../../common/progressBar/ProgressBar";

function ViewReportModal({
  showViewModal,
  setShowViewModal,
  detailsData,
  reports,
}) {
  return (
    <Modal
      isOpen={showViewModal}
      onClose={() => setShowViewModal(false)}
      title="View report"
      position="center"
    >
      <div className="">
        <p className="py-1 font-semibold text-lg">{detailsData?.name}</p>
        <p className="py-1 font-normal">
          Overall score:{" "}
          <span className="font-semibold">{detailsData?.score}/5</span>
        </p>
        <p className="py-1 font-normal">
          Notes/ Comments:{" "}
          <span className="font-semibold">{detailsData?.notes}</span>
        </p>
      </div>
      <div className="pt-4">
        <h3 className="font-semibold text-lg py-1">Performance Score</h3>
        {reports.map((item, i) => (
          <div key={i} className="py-2">
            <div className="flex justify-between align-center">
              <p>
                <i className={`pe-2 ${item.icon}`} />
                {item.name}
              </p>
              <p style={{ color: item.color }}>{item.score}</p>
            </div>
            <div className="py-2">
              <ProgressBar score={item.score} color={item.color} />
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default ViewReportModal;
