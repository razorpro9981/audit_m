// import React from "react";
// import { Link } from "react-router-dom";
// import LineChart from "../../charts/LineChart01";
// import Icon from "../../images/icon-02.svg";
// import EditMenu from "../../components/DropdownEditMenu";

// // Import utilities
// import { tailwindConfig, hexToRGB } from "../../utils/Utils";

// function DashboardCard02() {
//   const chartData = {
//     labels: [
//       "12-01-2020",
//       "01-01-2021",
//       "02-01-2021",
//       "03-01-2021",
//       "04-01-2021",
//       "05-01-2021",
//       "06-01-2021",
//       "07-01-2021",
//       "08-01-2021",
//       "09-01-2021",
//       "10-01-2021",
//       "11-01-2021",
//       "12-01-2021",
//       "01-01-2022",
//       "02-01-2022",
//       "03-01-2022",
//       "04-01-2022",
//       "05-01-2022",
//       "06-01-2022",
//       "07-01-2022",
//       "08-01-2022",
//       "09-01-2022",
//       "10-01-2022",
//       "11-01-2022",
//       "12-01-2022",
//       "01-01-2023",
//     ],
//     datasets: [
//       // Indigo line
//       {
//         data: [
//           622, 622, 426, 471, 365, 365, 238, 324, 288, 206, 324, 324, 500, 409,
//           409, 273, 232, 273, 500, 570, 767, 808, 685, 767, 685, 685,
//         ],
//         fill: true,
//         backgroundColor: `rgba(${hexToRGB(
//           tailwindConfig().theme.colors.blue[500]
//         )}, 0.08)`,
//         borderColor: tailwindConfig().theme.colors.indigo[500],
//         borderWidth: 2,
//         tension: 0,
//         pointRadius: 0,
//         pointHoverRadius: 3,
//         pointBackgroundColor: tailwindConfig().theme.colors.indigo[500],
//         pointHoverBackgroundColor: tailwindConfig().theme.colors.indigo[500],
//         pointBorderWidth: 0,
//         pointHoverBorderWidth: 0,
//         clip: 20,
//       },
//       // Gray line
//       {
//         data: [
//           732, 610, 610, 504, 504, 504, 349, 349, 504, 342, 504, 610, 391, 192,
//           154, 273, 191, 191, 126, 263, 349, 252, 423, 622, 470, 532,
//         ],
//         borderColor: `rgba(${hexToRGB(
//           tailwindConfig().theme.colors.slate[500]
//         )}, 0.25)`,
//         borderWidth: 2,
//         tension: 0,
//         pointRadius: 0,
//         pointHoverRadius: 3,
//         pointBackgroundColor: `rgba(${hexToRGB(
//           tailwindConfig().theme.colors.slate[500]
//         )}, 0.25)`,
//         pointHoverBackgroundColor: `rgba(${hexToRGB(
//           tailwindConfig().theme.colors.slate[500]
//         )}, 0.25)`,
//         pointBorderWidth: 0,
//         pointHoverBorderWidth: 0,
//         clip: 20,
//       },
//     ],
//   };

//   return (
//     <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
//       <div className="px-5 pt-5">
//         <header className="flex justify-between items-start mb-2">
//           {/* Icon */}
//           <img src={Icon} width="32" height="32" alt="Icon 02" />
//           {/* Menu button */}
//           <EditMenu align="right" className="relative inline-flex">
//             <li>
//               <Link
//                 className="font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3"
//                 to="#0"
//               >
//                 Option 1
//               </Link>
//             </li>
//             <li>
//               <Link
//                 className="font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3"
//                 to="#0"
//               >
//                 Option 2
//               </Link>
//             </li>
//             <li>
//               <Link
//                 className="font-medium text-sm text-rose-500 hover:text-rose-600 flex py-1 px-3"
//                 to="#0"
//               >
//                 Remove
//               </Link>
//             </li>
//           </EditMenu>
//         </header>
//         <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
//           Acme Advanced
//         </h2>
//         <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">
//           Sales
//         </div>
//         <div className="flex items-start">
//           <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mr-2">
//             $17,489
//           </div>
//           <div className="text-sm font-semibold text-white px-1.5 bg-amber-500 rounded-full">
//             -14%
//           </div>
//         </div>
//       </div>
//       {/* Chart built with Chart.js 3 */}
//       <div className="grow max-sm:max-h-[128px] max-h-[128px]">
//         {/* Change the height attribute to adjust the chart height */}
//         <LineChart data={chartData} width={389} height={128} />
//       </div>
//     </div>
//   );
// }

// export default DashboardCard02;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LineChart from "../../charts/LineChart01";
import Icon from "../../images/icon-02.svg";
import EditMenu from "../../components/DropdownEditMenu";

// Import utilities
import { tailwindConfig, hexToRGB } from "../../utils/Utils";

function DashboardCard02() {
  let logonCounts = [];
  let loggedDates = [];
  const [totalLogonCounts, setTotalLogonCounts] = useState(0);

  const chartData = {
    labels: loggedDates,
    datasets: [
      {
        data: logonCounts,
        fill: true,
        backgroundColor: `rgba(${hexToRGB(
          tailwindConfig().theme.colors.blue[500]
        )}, 0.08)`,
        borderColor: tailwindConfig().theme.colors.indigo[500],
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.indigo[500],
        pointHoverBackgroundColor: tailwindConfig().theme.colors.indigo[500],
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
      },
    ],
  };

  useEffect(() => {
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const yyyy = date.getFullYear();
      return `${mm}-${dd}-${yyyy}`;
    };

    const fetchData = async () => {
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
        console.log("Fetched data:", data);

        const logonCountsObj = {};
        const loggedDatesSet = new Set();

        for (const entry of data) {
          const date = formatDate(entry.EVENT_TIMESTAMP.split("T")[0]);
          const action = entry.ACTION_NAME;

          if (action === "LOGOFF BY CLEANUP") {
            if (!loggedDatesSet.has(date)) {
              loggedDatesSet.add(date);
              logonCountsObj[date] = 1;
            } else {
              logonCountsObj[date]++;
            }
          }
        }

        const sortedDates = Array.from(loggedDatesSet)
          .sort((a, b) => new Date(a) - new Date(b))
          .slice(-30);

        const recentLogonCounts = sortedDates.map(
          (date) => logonCountsObj[date] || 0
        );

        loggedDates = sortedDates;
        logonCounts = recentLogonCounts;

        const totalLogonCounts = logonCounts.reduce(
          (acc, count) => acc + count,
          0
        );
        setTotalLogonCounts(totalLogonCounts);

        console.log("Total Logon Counts:", totalLogonCounts);
        console.log("Logon Dates:", loggedDates);
        console.log("Logon Counts:", logonCounts);

        chartData.labels = loggedDates;
        chartData.datasets[0].data = logonCounts;

        setDummy(dummy + 1);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
      console.log("Fetched successfully");
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const [dummy, setDummy] = useState(0);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <img src={Icon} width="32" height="32" alt="Icon 02" />
          <EditMenu align="right" className="relative inline-flex">
            <li>
              <Link
                className="font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3"
                to="#0"
              >
                Option 1
              </Link>
            </li>
            <li>
              <Link
                className="font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3"
                to="#0"
              >
                Option 2
              </Link>
            </li>
            <li>
              <Link
                className="font-medium text-sm text-rose-500 hover:text-rose-600 flex py-1 px-3"
                to="#0"
              >
                Remove
              </Link>
            </li>
          </EditMenu>
        </header>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
          Logoff Counts
        </h2>
        <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">
          Last 30 Days
        </div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mr-2">
            {totalLogonCounts}
          </div>
          {/* <div className="text-sm font-semibold text-white px-1.5 bg-amber-500 rounded-full">
            -14%
          </div> */}
        </div>
      </div>
      <div className="grow max-sm:max-h-[128px] max-h-[128px]">
        <LineChart data={chartData} width={389} height={128} />
      </div>
    </div>
  );
}

export default DashboardCard02;
