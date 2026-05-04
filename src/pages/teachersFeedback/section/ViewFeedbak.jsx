import React from "react";
import Modal from "../../../common/modal/Modal";

function ViewFeedbak({ showViewModal, setShowViewModal, detailsData }) {
  return (
    <Modal
      isOpen={showViewModal}
      onClose={() => setShowViewModal(false)}
      title="View feedback"
      position="center"
    >
      <div className="">
        <p className="py-1 font-semibold text-lg">{detailsData?.name}</p>
        <p className="py-1 font-normal">
          Subject:{" "}
          <span className="font-semibold">{detailsData?.subject}</span>
        </p>
        <p className="py-1 font-normal">
          Lesson:{" "}
          <span className="font-semibold">{detailsData?.lesson}</span>
        </p>
        <p className="py-1 font-normal">
          Notes/ Comments:{" "}
          <span className="font-semibold">{detailsData?.notes}</span>
        </p>
      </div>
    </Modal>
  );
}

export default ViewFeedbak;
