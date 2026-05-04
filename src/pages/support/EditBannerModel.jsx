import React from "react";
import Modal from "../../common/modal/Modal";

function ViewBannerModel({ showEditModal, setShowEditModal, bannerData }) {
  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  return (
    <Modal
      isOpen={showEditModal}
      onClose={handleCloseModal}
      title="Support Details"
      position="right"
    >
      {bannerData ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
           

            <div>
              <p className="text-sm font-medium text-gray-600">Report Name</p>
              <p className="text-base font-semibold">{bannerData.reportName}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600">Platform</p>
              <p className="text-base font-semibold">{bannerData.os_platform}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600">Username</p>
              <p className="text-base font-semibold">{bannerData.username}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600">Email</p>
              <p className="text-base font-semibold">{bannerData.email}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600">Phone</p>
              <p className="text-base font-semibold">
                {bannerData.country_code} {bannerData.phone}
              </p>
            </div>

         
            

            <div>
              <p className="text-sm font-medium text-gray-600">Created At</p>
              <p className="text-base font-semibold">
                {new Date(bannerData.created_at).toLocaleString()}
              </p>
            </div>

           
          </div>

          {/* Description */}
          <div>
            <p className="text-sm font-medium text-gray-600">Description</p>
            <p className="text-base">{bannerData.description}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No data available</p>
      )}
    </Modal>
  );
}

export default ViewBannerModel;
