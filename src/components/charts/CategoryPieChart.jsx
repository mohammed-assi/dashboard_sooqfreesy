import Chart from "react-apexcharts";
import { useState, useEffect } from "react";
import { getRequest } from "../../config/apiFunctions";
import { DASHBOARD } from "../../config/endPoints";

export default function CategoryPieChart() {
  const [chartData, setChartData] = useState({ series: [], labels: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleChartData();
  }, []);

  const handleChartData = async () => {
    setLoading(true);
    try {
      const res = await getRequest(`${DASHBOARD.CATPOSTCOUNT}`);
       console.log('cat', res);
      if (res?.data?.statusCode === 200) {
        const categories = res.data.data.categoryCounts;
       

        // Only pick Real Estate, Vehicle, Other
        const filtered = categories.filter((cat) =>
          ["Real estate", "Vehicle", "Other"].includes(cat.name)
        );

        const labels = filtered.map((cat) => cat.name);
        const series = filtered.map((cat) => cat.count);

        setChartData({ labels, series });
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  const options = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    labels: chartData.labels,
    colors: ["#3B82F6", "#34D399", "#FACC15"], // Customize colors
    legend: {
      position: "bottom",
      fontFamily: "Outfit",
      fontSize: "14px",
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: "16px", fontWeight: "bold", colors: ["#FFFFFF"] },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: "#000",
        opacity: 0.3,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          total: {
            show: true,
            label: "Total",
            fontSize: "30px",
            fontWeight: "bold",
            color: "white",
          },
        },
      },
    },
    tooltip: {
      y: { formatter: (val) => `${val} posts` },
    },
    stroke: { show: false },
    responsive: [
      {
        breakpoint: 768,
        options: { chart: { width: "100%" }, legend: { position: "bottom" } },
      },
    ],
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 py-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Ads
        </h3>
      </div>

      <div className="flex justify-center items-center">
        {chartData.series.length > 0 ? (
          <Chart
            options={options}
            series={chartData.series}
            type="donut"
            width={420}
            height={360}
          />
        ) : (
          <p>Loading chart...</p>
        )}
      </div>
    </div>
  );
}
