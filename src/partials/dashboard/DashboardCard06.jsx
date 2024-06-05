import React, { useEffect, useState } from "react";
import DoughnutChart from "../../charts/DoughnutChart";
import { tailwindConfig } from "../../utils/Utils";

function DashboardCard06() {
  const [actionCounts, setActionCounts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3010/api/getMySQLData", {
          headers: {
            "x-api-key": "a2a119cd-e932-42a6-a28a-8516e629c0dc",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched data for circle:", data);

        // Extracting action names from the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const filteredData = data.filter(
          (entry) => new Date(entry.EVENT_TIMESTAMP) >= thirtyDaysAgo
        );
        const actionNames = filteredData.map((entry) => entry.ACTION_NAME);
        console.log("Action Names from last 30 days:", actionNames);

        // Counting occurrences of each action name
        const actionCounts = actionNames.reduce((acc, name) => {
          acc[name] = (acc[name] || 0) + 1;
          return acc;
        }, {});
        console.log("Action Counts:", actionCounts);

        // Set the action counts state
        setActionCounts(actionCounts);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    fetchData();
  }, []);

  const chartData = {
    labels: Object.keys(actionCounts),
    datasets: [
      {
        label: "Last 30 days Actions",
        data: Object.values(actionCounts),
        backgroundColor: [
          tailwindConfig().theme.colors.indigo[500],
          tailwindConfig().theme.colors.blue[400],
          tailwindConfig().theme.colors.indigo[800],
          tailwindConfig().theme.colors.green[500],
          tailwindConfig().theme.colors.red[400],
          tailwindConfig().theme.colors.yellow[800],
          tailwindConfig().theme.colors.black[500],
          tailwindConfig().theme.colors.gray[400],
          tailwindConfig().theme.colors.purple[800],
        ],
        hoverBackgroundColor: [
          tailwindConfig().theme.colors.indigo[600],
          tailwindConfig().theme.colors.blue[500],
          tailwindConfig().theme.colors.indigo[900],
          tailwindConfig().theme.colors.green[500],
          tailwindConfig().theme.colors.red[400],
          tailwindConfig().theme.colors.yellow[800],
          tailwindConfig().theme.colors.black[500],
          tailwindConfig().theme.colors.gray[400],
          tailwindConfig().theme.colors.purple[800],
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          Actions in the last 30 days
        </h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <DoughnutChart data={chartData} width={389} height={260} key={JSON.stringify(chartData)} />
    </div>
  );
}

export default DashboardCard06;
