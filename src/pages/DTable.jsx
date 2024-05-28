// import React from "react";
import React, { useRef, useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import moment from "moment";
import { EyeOutlined } from "@ant-design/icons";
import { Modal, Col, Row } from "antd";
import { format } from "sql-formatter";
import FilterGroup from "../components/filterGroup";
import Swal from "sweetalert2";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";

function DTable() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const searchInput = useRef(null);

  const showModal = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const tryFormatSql = (sqlText) => {
    try {
      return format(sqlText, { language: "mysql" });
    } catch (error) {
      console.error("Error formatting SQL text:", error);
      console.log("Problematic SQL text:", sqlText);
      return sqlText; // Display the original SQL text as is
    }
  };

  const applyFilter = (filters) => {
    // Apply the filters to your table data
    const filtered = tableData.filter((record) => {
      const usernameMatch =
        !filters.username ||
        (record.OS_USERNAME && record.OS_USERNAME.includes(filters.username));
      const sessionMatch =
        !filters.session ||
        (record.SESSIONID && record.SESSIONID.includes(filters.session));
      const selectMatch =
        !filters.select ||
        (record.ACTION_NAME && record.ACTION_NAME === filters.select);
      const rangePickerMatch =
        !filters.rangePicker ||
        (record.EVENT_TIMESTAMP &&
          moment(record.EVENT_TIMESTAMP).isBetween(
            moment(filters.rangePicker[0]).startOf("day"),
            moment(filters.rangePicker[1]).endOf("day")
          ));

      // Return true only if all conditions match
      return usernameMatch && sessionMatch && selectMatch && rangePickerMatch;
    });

    // Update the filteredData state
    setFilteredData(filtered);
    console.log("Date range filters:", filters.rangePicker);
    console.log("Filtered data:", filtered);

    if (filtered.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No data found for the selected filters!",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3010/api/getMySQLData", {
          headers: {
            "x-api-key": "a2a119cd-e932-42a6-a28a-8516e629c0dc", // api key
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTableData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data initially
    fetchData();

    // Set up interval to fetch data every 10 seconds
    const intervalId = setInterval(() => {
      fetchData();
      console.log("fetched successfully");
    }, 10000);

    // Clear interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      const dataIndexValue = record[dataIndex];
      return dataIndexValue !== null && dataIndexValue !== undefined
        ? dataIndexValue.toString().toLowerCase().includes(value.toLowerCase())
        : false;
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Audit Type",
      dataIndex: "AUDIT_TYPE",
      key: "AUDIT_TYPE",
      ...getColumnSearchProps("AUDIT_TYPE"),
    },
    {
      title: "Username",
      dataIndex: "OS_USERNAME",
      key: "OS_USERNAME",
      ...getColumnSearchProps("OS_USERNAME"),
    },
    {
      title: "User Host",
      dataIndex: "USERHOST",
      key: "USERHOST",
      ...getColumnSearchProps("USERHOST"),
    },
    {
      title: "Session ID",
      dataIndex: "SESSIONID",
      key: "SESSIONID",
      ...getColumnSearchProps("SESSIONID"),
    },
    {
      title: "Timestamp",
      dataIndex: "EVENT_TIMESTAMP",
      key: "EVENT_TIMESTAMP",
      render: (text) => moment(text).format("LLL"),
      sorter: (a, b) =>
        moment(a.EVENT_TIMESTAMP).unix() - moment(b.EVENT_TIMESTAMP).unix(),
      sortDirections: ["descend", "ascend"],
      defaultSortOrder: "descend",
    },

    {
      title: "Action Name",
      dataIndex: "ACTION_NAME",
      key: "ACTION_NAME",
      ...getColumnSearchProps("ACTION_NAME"),
    },
    {
      title: "View Details",
      dataIndex: "",
      key: "ACTION",

      render: (text, record) => (
        <Space>
          <button
            style={{ justifyContent: "center" }}
            type="primary"
            onClick={() => showModal(record)}
          >
            <EyeOutlined />
          </button>
        </Space>
      ),
    },
  ];
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header />
        <div>
          <div className="relative bg-indigo-200 dark:bg-indigo-500 p-4 sm:p-6 rounded-sm overflow-hidden mb-8">
            {/* Background illustration */}
            <div
              className="absolute right-0 top-0 -mt-4 mr-16 pointer-events-none hidden xl:block"
              aria-hidden="true"
            >
              <svg
                width="319"
                height="198"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <defs>
                  <path id="welcome-a" d="M64 0l64 128-64-20-64 20z" />
                  <path id="welcome-e" d="M40 0l40 80-40-12.5L0 80z" />
                  <path id="welcome-g" d="M40 0l40 80-40-12.5L0 80z" />
                  <linearGradient
                    x1="50%"
                    y1="0%"
                    x2="50%"
                    y2="100%"
                    id="welcome-b"
                  >
                    <stop stopColor="#A5B4FC" offset="0%" />
                    <stop stopColor="#818CF8" offset="100%" />
                  </linearGradient>
                  <linearGradient
                    x1="50%"
                    y1="24.537%"
                    x2="50%"
                    y2="100%"
                    id="welcome-c"
                  >
                    <stop stopColor="#4338CA" offset="0%" />
                    <stop stopColor="#6366F1" stopOpacity="0" offset="100%" />
                  </linearGradient>
                </defs>
                <g fill="none" fillRule="evenodd">
                  <g transform="rotate(64 36.592 105.604)">
                    <mask id="welcome-d" fill="#fff">
                      <use xlinkHref="#welcome-a" />
                    </mask>
                    <use fill="url(#welcome-b)" xlinkHref="#welcome-a" />
                    <path
                      fill="url(#welcome-c)"
                      mask="url(#welcome-d)"
                      d="M64-24h80v152H64z"
                    />
                  </g>
                  <g transform="rotate(-51 91.324 -105.372)">
                    <mask id="welcome-f" fill="#fff">
                      <use xlinkHref="#welcome-e" />
                    </mask>
                    <use fill="url(#welcome-b)" xlinkHref="#welcome-e" />
                    <path
                      fill="url(#welcome-c)"
                      mask="url(#welcome-f)"
                      d="M40.333-15.147h50v95h-50z"
                    />
                  </g>
                  <g transform="rotate(44 61.546 392.623)">
                    <mask id="welcome-h" fill="#fff">
                      <use xlinkHref="#welcome-g" />
                    </mask>
                    <use fill="url(#welcome-b)" xlinkHref="#welcome-g" />
                    <path
                      fill="url(#welcome-c)"
                      mask="url(#welcome-h)"
                      d="M40.333-15.147h50v95h-50z"
                    />
                  </g>
                </g>
              </svg>
            </div>

            {/* Content */}
            <div className="relative">
              <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-1">
                Oracle Audit Table 📊
              </h1>
              <p className="dark:text-indigo-200">Here is what’s happening </p>
            </div>
          </div>
          <div className="p-2 m-2 ">
            <div className="w-full">
              {/* <FilterGroup onFilter={applyFilter} /> */}
            </div>
            {/* <div className="mx-7 border-2"></div> */}
            <Table
              columns={columns}
              dataSource={filteredData.length > 0 ? filteredData : tableData}
              loading={loading}
            />
            <Modal
              width={800}
              title="View Details"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={null} // Removing the footer for a cleaner look
            >
              {selectedRecord && (
                <div>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <p>
                        <strong>Audit Type:</strong> {selectedRecord.AUDIT_TYPE}
                      </p>
                      <p>
                        <strong>Username:</strong> {selectedRecord.OS_USERNAME}
                      </p>
                      <p>
                        <strong>User Host:</strong> {selectedRecord.USERHOST}
                      </p>
                      <p>
                        <strong>Session ID:</strong> {selectedRecord.SESSIONID}
                      </p>
                      <p>
                        <strong>Timestamp:</strong>{" "}
                        {moment(selectedRecord.EVENT_TIMESTAMP).format("LLL")}
                      </p>
                      <p>
                        <strong>Action Name:</strong>{" "}
                        {selectedRecord.ACTION_NAME}
                      </p>
                    </Col>
                    <Col span={12}>
                      {selectedRecord.sql_text &&
                      typeof selectedRecord.sql_text === "string" ? (
                        <div
                          style={{
                            maxHeight: "300px",
                            overflowY: "auto",
                            padding: "8px",
                            border: "1px solid #e8e8e8",
                          }}
                        >
                          <p>
                            <strong>SQL Query:</strong>
                          </p>
                          <code style={{ whiteSpace: "pre-wrap" }}>
                            {tryFormatSql(selectedRecord.sql_text)}
                          </code>
                        </div>
                      ) : (
                        <p>
                          <strong>SQL Query:</strong> Invalid SQL data format
                        </p>
                      )}
                    </Col>
                  </Row>
                </div>
              )}
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DTable;
