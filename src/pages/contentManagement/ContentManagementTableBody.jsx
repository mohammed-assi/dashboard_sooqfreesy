
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import DataNotFound from "../../ui/dataNotFound/DataNotFound";
import { CONTENT_MANAGEMENT_HEAD } from "../../app/constants/TableHeadings";
import Card from "../../common/card/Card";
import { Link } from "react-router";
import { ROUTES } from "../../app/constants";
import { encodeId } from "../../common/utilis/encrypt";


const ContentManagementTableBody = ({
  formDataList,
  loading,
  handleOpenEditModal,
  handleOpenDeleteModal,
  handleOpenSuspendModal,
  currentPage = 1,
  rowsPerPage = 10,
}) => {
  if (!loading && formDataList?.length === 0) {
    return (
      <DataNotFound
        colSpan={CONTENT_MANAGEMENT_HEAD.length}
        message="No data found"
      />
    );
  }

  // Map API data into card items
  const newFormList = formDataList.map((data) => {
    let icon = "fa-solid fa-book fa-2xl";
    let color = "#764bebff";

    switch (data.type) {
      case "ABOUT_US":
        icon = "fa-solid fa-notebook fa-2xl";
        color = "#ff6d00";
        break;
      case "TERMS_CONDITIONS":
        icon = "fa-solid fa-book fa-2xl";
        color = "#00CCFF";
        break;
      case "PRIVACY_POLICY":
        icon = "fa-solid fa-lock fa-2xl";
        color = "#ee3f21f5";
        break;
      case "FAQ":
        icon = "fa-solid fa-circle-question fa-2xl";
        color = "#764bebff";
        break;
      case "HOME_SLIDER":
        icon = "fa-solid fa-images fa-2xl";
        color = "#f03958ff";
        break;
      case "WELCOME":
        icon = "fa-solid fa-handshake-angle fa-2xl"; // 🤝 better icon for welcome
        color = "#4CAF50"; // 🌿 green (friendly, welcoming)
        break;
      default:
        break;
    }
    

    return {
      id: data.id,
      title: data.type.replace(/_/g, " "), // make type readable
      icon,
      color,
    };
  });


  return (
    <div>
      <div className="grid grid-cols-4 gap-4 py-10">
        {newFormList.map((item) => (

          <Card
            key={item.id}
            title={item.title}
            slug={`${ROUTES.CONTEMT_MANAGEMENT.update}/${encodeId(item.id)}`}
            icon={item.icon}
            color={item.color}
          />

        ))}
      </div>
    </div>
  );
};

export default ContentManagementTableBody;
