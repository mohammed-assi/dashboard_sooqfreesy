import React from "react";
import PageMeta from "../../../../common/PageMeta";
import Card from "../../../../common/card/Card";
import { ROUTES, TITLES } from "../../../../app/constants";
import { useParams } from "react-router-dom";

function Activity() {
  const { id } = useParams(); // "MTEz"

  const cardItems = [
    {
      slug: `${ROUTES.USERS.ads}/${id}`,
      title: "Ads",
      icon: "fa-solid fa-notebook fa-2xl",
      color: "#ff6d00",
    },
  ];
  // {
  //   slug: ROUTES.USERS.buylist,
  //   title: "Buy",
  //   icon: "fa-solid fa-solid fa-book fa-2xl",
  //   color: "#00CCFF",
  // },

  return (
    <>
      <PageMeta title="" description="Dashboard" />

<h1 className="font-semibold text-xl"></h1>
      <div className="grid grid-cols-4 gap-4 py-10">
        {cardItems.map((item, i) => (
          <Card
            key={i}
            title={item.title}
            slug={item.slug}
            icon={item.icon}
            color={item.color}
          />
        ))}
      </div>
    </>
  );
}

export default Activity;
