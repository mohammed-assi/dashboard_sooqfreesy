import React from "react";

function Tabs({
  tabsData,
  activeTab,
  handleChangeUserTab,
}) {
  return (
    <div className="pt-0 pb-2">
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500">
        {tabsData?.map((item, i) => (
          <li key={i} className="me-2">
            <button
              onClick={() => handleChangeUserTab(item.id, item.roleId)}
              aria-current="page"
              className={`${activeTab === item.id
                  ? "text-(--green-color) bg-gray-100  active"
                  : "hover:text-(--green-color) hover:bg-gray-50"
                } inline-block p-4 rounded-t-lg`}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tabs;
