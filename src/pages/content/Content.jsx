import React from "react";
import PageMeta from "../../common/PageMeta";
import { ROUTES, TITLES } from "../../app/constants";
import Card from "../../common/card/Card";

function Content() {
  const cardItems = [
    {
      slug: ROUTES.CONTENT.subjects,
      title: "Subjects",
      icon: "fa-solid fa-solid fa-book fa-2xl",
      color: " #00C853",
    },
    {
      slug: ROUTES.CONTENT.lessons,
      title: "Lessons",
      icon: "fa-solid fa-solid fa-notebook fa-2xl",
      color: "#ff6d00",
    },
    {
      slug: ROUTES.CONTENT.topics.root,
      title: "Topics",
      icon: " fa-solid fa-solid fa-receipt fa-2xl",
      color: "#00CCFF",
    },
  ];
  return (
    <>
      <PageMeta title={TITLES?.CONTENT.root} description="Dashboard" />

      <h1 className="font-semibold text-xl">{TITLES?.CONTENT.root}</h1>

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

export default Content;
