import Chart from "react-apexcharts";
import { useRef, useEffect, useState } from "react";
import { getRequest } from "../../config/apiFunctions";
import { DASHBOARD } from "../../config/endPoints";

export default function MonthlySalesChart() {
  const chartContainerRef = useRef(null);
  const [chartHeight, setChartHeight] = useState(0);
  const [chartData, setChartData] = useState({ monthlyCounts: {}, year: "" });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [yearOptions, setYearOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const updateChartHeight = () => {
    if (chartContainerRef.current) {
      setChartHeight(chartContainerRef.current.offsetHeight);
    }
  };

  const handleChartData = async (year = selectedYear) => {
    setLoading(true);
    try {
      // Pass year in query param to filter
      const res = await getRequest(`${DASHBOARD.YEARLY_CUSTOMER}?year=${year}`);
      if (res.data?.statusCode === 200) {
        setChartData(res.data.data || { monthlyCounts: {}, year });
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate year options dynamically (current year - 5)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= currentYear - 5; y--) {
      years.push(y);
    }
    setYearOptions(years);
  };

  useEffect(() => {
    generateYearOptions();
    handleChartData();
  }, []);

  useEffect(() => {
    updateChartHeight();
    window.addEventListener("resize", updateChartHeight);
    return () => window.removeEventListener("resize", updateChartHeight);
  }, []);

  const getChartSeries = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months.map((month) => chartData.monthlyCounts[month] || 0);
  };

  const chartSeries = getChartSeries();
  const maxValue = Math.max(...chartSeries, 0);

  const options = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: chartHeight,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: { text: "" },
      min: 0,
      max: maxValue > 0 ? Math.ceil(maxValue * 1.1) : 100,
      forceNiceScale: true,
      labels: {
        formatter: (val) => Math.round(val),
      },
    },
    grid: {
      yaxis: { lines: { show: true } },
    },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: false },
      y: { formatter: (val) => `${val} customers` },
    },
  };

  const series = [
    {
      name: "New Customers",
      data: chartSeries,
    },
  ];

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    handleChartData(year);
  };

  return (
    <div
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6"
      ref={chartContainerRef}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Yearly Customers {chartData?.year ? `(${chartData.year})` : ""}
        </h3>

        <div>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:text-white"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center text-gray-500">Loading chart...</div>
      ) : (
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
            <Chart
              options={options}
              series={series}
              type="bar"
              height={chartHeight}
            />
          </div>
        </div>
      )}
    </div>
  );
}
