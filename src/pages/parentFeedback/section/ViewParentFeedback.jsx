import React from "react";
import Modal from "../../../common/modal/Modal";

function ViewParentFeedback({ showViewModal, setShowViewModal, detailsData }) {
  return (
    <Modal
      isOpen={showViewModal}
      onClose={() => setShowViewModal(false)}
      title="View feedback"
      position="center"
    >
      <div className="">
        <p className="py-1 font-normal">
          Teacher Name:{" "}
          <span className="font-semibold">{detailsData?.name}</span>
        </p>
        <p className="py-1 font-normal">
          Parent Name:{" "}
          <span className="font-semibold">{detailsData?.parent_name}</span>
        </p>
        <p className="py-1 font-normal">
          Title:{" "}
          <span className="font-semibold">{detailsData?.title}</span>
        </p>
        <p className="py-1 font-normal">
          Feedback:{" "}
          <span className="font-semibold">{detailsData?.feedback}</span>
        </p>
      </div>
    </Modal>
  );
}

export default ViewParentFeedback;
