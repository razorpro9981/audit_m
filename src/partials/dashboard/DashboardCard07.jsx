import React, { useEffect, useState } from "react";
import axios from "axios";

function DashboardCard07() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  // Fetch data from the database
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3010/api/viewData", {
        headers: {
          "x-api-key": "a2a119cd-e932-42a6-a28a-8516e629c0dc",
        },
      });

      if (!response.data) {
        throw new Error("No data received");
      }

      // Extract username and action name from the fetched data
      const extractedUsers = response.data.map((entry) => ({
        id: entry.id,
        name: entry.os_username,
        action: entry.action_name,
      }));

      setUsers(extractedUsers);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data immediately after component mounts
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div className="col-span-full xl:col-span-8 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <style>{`
        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px; /* Adjust based on your layout */
        }

        .loader {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          Recent Users
        </h2>
      </header>
      <div className="p-3">
        {loading ? ( // Conditionally render loader or table based on loading state
          <div className="loader-container">
            <div className="loader"></div> {/* Add a loader element */}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full dark:text-slate-300">
              {/* Table header */}
              <thead className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm">
                <tr>
                  <th className="p-2">
                    <div className="font-semibold text-left">Name</div>
                  </th>
                  <th className="p-2">
                    <div className="font-semibold text-center">Action</div>
                  </th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-700">
                {users.slice(0, 10).map((user, index) => (
                  <tr key={index}>
                    <td className="p-2">
                      <div className="flex items-center">
                        <div className="text-slate-800 dark:text-slate-100">
                          {user.name}
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-center">{user.action}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardCard07;
