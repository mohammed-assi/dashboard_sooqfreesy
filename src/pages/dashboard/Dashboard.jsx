import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import PageMeta from "../../common/PageMeta";
import TableHead from "../../common/tableHead/TableHead";
import DashboardTableBody from "./section/DashboardTableBody";
import MonthlySalesChart from "../../components/charts/MonthlySales";
import CategoryPieChart from "../../components/charts/CategoryPieChart";
import { getRequest } from "../../config/apiFunctions";
import { USERS, DASHBOARD } from "../../config/endPoints";
import { ROUTES, TITLES } from "../../app/constants";
import { DASHBOARD_TABLE_HEAD } from "../../app/constants/TableHeadings";
import { toast } from "react-toastify";

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [countData, setCountData] = useState({});

  const iconMap = {
    "Total Customer": "fa-solid fa-users fa-2xl",
    "Total Sub Category": "fa-solid fa-layer-group fa-2xl",
    "Total Ads": "fa-solid fa-bullhorn fa-2xl",
    "Total Sold Ads": "fa-solid fa-receipt fa-2xl",
  };

  const CardItems = [
    {
      title: "Total Customer",
      counts: countData?.userCount ?? 0,
      // slug: ROUTES.dashboard,
    },
    {
      title: "Total Sub Category",
      counts: countData?.subCategoryCount ?? 0,
      // slug: ROUTES.dashboard,
    },
    {
      title: "Total Ads",
      counts: countData?.postCount ?? 0,
      // slug: ROUTES.dashboard,
    },
    {
      title: "Total Sold Ads",
      counts: countData?.soldPostCount ?? 0,
      // slug: ROUTES.dashboard,
    },
  ].map((item) => ({
    ...item,
    icon: iconMap[item.title] || "fa-solid fa-chart-bar fa-2xl",
  }));

  const getUsers = async (url) => {
    setLoading(true);
    try {
      const response = await getRequest(url);
      const { status, data } = response;

      if (status === 200 && data?.success) {
        setUserList(data?.data?.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalCount = async () => {
    setLoading(true);
    try {
      const res = await getRequest(DASHBOARD.DASHBOARD_COUNT);
      if (res.data?.statusCode === 200) {
        setCountData(res.data.data || {});
      }
    } catch (error) {
      toast.error(error.response?.data || "Something went wrong", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    getUsers(`${USERS.LIST}?page_no=1&number_of_rows=5`);
    getTotalCount();
  }, []);

  return (
    <>
      <PageMeta title={TITLES.dashboard} description="Dashboard" />
      <h1 className="font-semibold text-xl">{TITLES.dashboard}</h1>

      {/* ===== Cards Section ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-10">
        {CardItems.map((item, i) => (
          <div
            key={i}
            className="card-hover-animate text-center py-10 bg-white shadow-md flex flex-col justify-center items-center rounded-md border-t-5 border-(--primary-color) text-main transition duration-300 hover:text-white"
          >
            <div className="pb-4">
              <i
                className={item.icon}
                style={{ color: "var(--green-color)" }}
              />
            </div>
            <p className="font-semibold text-lg">{item.counts}</p>
            <p>{item.title}</p>
          </div>
        ))}
      </div>

      {/* ===== Charts Section ===== */}
      <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
        <MonthlySalesChart />
        <CategoryPieChart />
      </div>

      {/* ===== Recent Drivers Table ===== */}
      {/* <div>
        <h1 className="font-semibold text-md py-4">Recent Drivers</h1>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-left rtl:text-right text-gray-500">
            <TableHead headLable={DASHBOARD_TABLE_HEAD} />
            <DashboardTableBody userList={userList} loading={loading} />
          </table>
        </div>
      </div> */}
    </>
  );
}

export default Dashboard;
