import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Button,
  message,
  Modal,
  Spin,
  Switch,
  Table,
  Avatar,
  Tooltip,
  DatePicker,
  Select,
  Drawer,
  Space,
  Divider,
} from "antd";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { postData, fetchData } from "../../api/apiService";
import AddMLAUSER from "./addmlauser";

const { RangePicker } = DatePicker;
const { Option } = Select;

const MLA = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("0"); // 0: Newest, 1: Oldest
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [userModelFlag, setUserModelFlag] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalLoad, setModalLoad] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [constituencies, setConstituencies] = useState([]);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);

  // Fetch constituencies on component mount
  useEffect(() => {
    const fetchConstituencies = async () => {
      try {
        const response = await fetchData(
          "/api/user/list-of-constituencies-dropdown"
        );
        setConstituencies(response?.data || []);
      } catch (error) {
        console.error("Error fetching constituencies:", error);
      }
    };
    fetchConstituencies();
  }, []);

  // Debounce search input for real-time functionality
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      selectedGender ||
      dateRange ||
      selectedConstituency ||
      selectedFilter !== "0"
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedGender(null);
    setDateRange(null);
    setSelectedConstituency(null);
    setSelectedFilter("0");
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const userChangeStatus = async () => {
    setModalLoad(true);
    const payload = { partyId: selectedRecord._id };
    try {
      const response = await postData("/api/admin/toggle-party", payload);
      if (response?.responseCode === 200) {
        setWarningModal(false);
        setSelectedRecord(null);
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to change status");
    } finally {
      setModalLoad(false);
      fetchUserList();
    }
  };

  const columns = [
    {
      title: "S.No",
      key: "index",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      align: "center",
      render: (avatar, record) =>
        avatar ? (
          <Avatar src={avatar} alt={record.user?.name} />
        ) : (
          <Avatar style={{ color: "#000000" }}>{record.user?.name?.[0]}</Avatar>
        ),
    },
    {
      title: "Name",
      dataIndex: ["user", "name"],
      key: "name",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
      align: "center",
    },
    {
      title: "Phone",
      dataIndex: ["user", "phone"],
      key: "phone",
      align: "center",
    },
    {
      title: "DOB",
      dataIndex: ["user", "dateOfBirth"],
      key: "dateOfBirth",
      align: "center",
      render: (dob) => (dob ? moment(dob).format("DD/MM/YYYY") : "N/A"),
    },
    {
      title: "Gender",
      dataIndex: ["user", "gender"],
      key: "gender",
      align: "center",
      render: (gender) =>
        gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "-",
    },
    {
      title: "Constituency",
      dataIndex: ["constituency", "name"],
      key: "constituency",
      align: "center",
    },
    {
      title: "District",
      dataIndex: ["constituency", "district", "name"],
      key: "district",
      align: "center",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      align: "center",
      render: (address) => (
        <Tooltip title={address}>
          {address?.length > 30 ? address.slice(0, 30) + "..." : address}
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <span
          style={{
            color: status === "active" ? "green" : "red",
            fontWeight: 500,
          }}
        >
          {status}
        </span>
      ),
    },
    // {
    //   title: "Active",
    //   dataIndex: "isActive",
    //   key: "isActive",
    //   align: "center",
    //   render: (isActive, record) => (
    //     <Switch
    //       checked={isActive}
    //       onChange={() => {
    //         setSelectedRecord(record);
    //         setWarningModal(true);
    //       }}
    //     />
    //   ),
    // },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "N/A"),
    },
  ];

  const fetchUserList = async () => {
    const payload = {
      page: currentPage,
      pageSize,
    };

    // Add search filter only if searchQuery has value
    if (searchQuery) {
      payload.search = searchQuery;
    }

    // Add gender filter only if selected
    if (selectedGender) {
      payload.gender = selectedGender;
    }

    // Add constituency filter only if selected
    if (selectedConstituency) {
      payload.constituencyId = selectedConstituency;
    }

    // Add date range filters only if dateRange is set
    if (dateRange && dateRange[0]) {
      payload.startDate = dateRange[0].format("YYYY-MM-DD");
    }
    if (dateRange && dateRange[1]) {
      payload.endDate = dateRange[1].format("YYYY-MM-DD");
    }
    try {
      setLoading(true);
      const response = await postData("/api/admin/list-of-mlas", payload);
      if (response?.responseCode === 200) {
        let fetchedUsers = response?.data?.mlas || [];
        // Sort frontend based on selectedFilter
        fetchedUsers.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return selectedFilter === "0" ? dateB - dateA : dateA - dateB; // Newest / Oldest
        });
        setUsers(fetchedUsers);
        setTotal(response?.data?.totalMLAs || 1);
      } else {
        setUsers([]);
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      setUsers([]);
      message.error(error?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, [
    selectedFilter,
    currentPage,
    pageSize,
    searchQuery,
    selectedGender,
    dateRange,
    selectedConstituency,
  ]);

  return (
    <Spin spinning={loading}>
      <div className="mt-2 flex flex-col gap-2">
        <div className="flex items-center justify-between client-details-form">
          <div className="flex items-center justify-start gap-1 w-full">
            <TextField
              id="outlined-basic"
              label="Search"
              variant="outlined"
              className="w-full max-w-[400px]"
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              type="search"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchOutlined className="search-icon" />
                  </InputAdornment>
                ),
              }}
            />
            {hasActiveFilters() && (
              <Button
                type="text"
                icon={<ClearOutlined />}
                onClick={handleClearFilters}
                className="text-red-500 hover:text-red-700"
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                type={hasActiveFilters() ? "primary" : "default"}
                icon={<FilterOutlined />}
                onClick={() => setFilterDrawerVisible(true)}
                className="h-[36px] w-[36px] p-0"
                title="Filters"
              />
              {hasActiveFilters() && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center z-10">
                  {
                    [
                      selectedGender,
                      dateRange,
                      selectedConstituency,
                      selectedFilter !== "0",
                    ].filter(Boolean).length
                  }
                </span>
              )}
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditId(null);
                setUserModelFlag(true);
              }}
              className="h-[36px] w-[36px] p-0 bg-primary"
              title="Add New"
            />
          </div>
        </div>

        {/* Filter Drawer */}
        <Drawer
          title={<span className="text-lg font-semibold">Filters & Sort</span>}
          placement="right"
          onClose={() => setFilterDrawerVisible(false)}
          open={filterDrawerVisible}
          width={700}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <Space direction="vertical" size="middle" className="w-full">
                {/* Sort Section */}
                <div>
                  <h4 className="text-base font-semibold mb-3">Sort By</h4>
                  <Select
                    style={{ width: "100%" }}
                    size="large"
                    value={selectedFilter}
                    onChange={(value) => {
                      setSelectedFilter(value);
                      setCurrentPage(1);
                    }}
                  >
                    <Option value="0">Newest First</Option>
                    <Option value="1">Oldest First</Option>
                  </Select>
                </div>

                <Divider className="my-2" />

                {/* Filters Section */}
                <div>
                  <h4 className="text-base font-semibold mb-3">Filters</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Gender Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Gender
                      </label>
                      <Select
                        placeholder="Select Gender"
                        allowClear
                        style={{ width: "100%" }}
                        size="large"
                        value={selectedGender}
                        onChange={(value) => {
                          setSelectedGender(value);
                          setCurrentPage(1);
                        }}
                      >
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="other">Other</Option>
                      </Select>
                    </div>

                    {/* Constituency Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Constituency
                      </label>
                      <Select
                        placeholder="Select Constituency"
                        allowClear
                        style={{ width: "100%" }}
                        size="large"
                        value={selectedConstituency}
                        onChange={(value) => {
                          setSelectedConstituency(value);
                          setCurrentPage(1);
                        }}
                        showSearch
                        filterOption={(input, option) =>
                          (option?.children ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {constituencies.map((constituency) => (
                          <Option
                            key={constituency._id}
                            value={constituency._id}
                          >
                            {constituency.name}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    {/* Date Range */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Created At (Date Range)
                      </label>
                      <RangePicker
                        placeholder={["Start Date", "End Date"]}
                        allowClear
                        style={{ width: "100%" }}
                        size="large"
                        format="YYYY-MM-DD"
                        value={dateRange}
                        onChange={(dates) => {
                          setDateRange(dates);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Space>
            </div>

            {/* Footer with buttons */}
            <div className="border-t pt-4 mt-4">
              <Space className="w-full justify-end">
                {hasActiveFilters() && (
                  <Button
                    type="default"
                    icon={<ClearOutlined />}
                    onClick={handleClearFilters}
                    className="text-red-500 hover:text-red-700"
                  >
                    Clear All
                  </Button>
                )}
                <Button
                  type="primary"
                  onClick={() => setFilterDrawerVisible(false)}
                >
                  Apply Filters
                </Button>
              </Space>
            </div>
          </div>
        </Drawer>
        <div className="max-h-[80dvh] overflow-y-auto pr-1">
          <Table
            columns={columns}
            dataSource={users}
            locale={{
              emptyText: (
                <div style={{ color: "black" }}>
                  {searchQuery ? "No User Found" : "No Users available"}
                </div>
              ),
            }}
            pagination={{
              current: currentPage,
              pageSize,
              total,
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              },
            }}
            rowKey={(record) => record._id}
            scroll={{ x: "max-content" }}
          />
        </div>
        <AddMLAUSER
          patientDrawer={userModelFlag}
          setPatientDrawer={setUserModelFlag}
          fetchPatientsList={fetchUserList}
          editId={editId}
          setEditId={setEditId}
        />
      </div>

      <Modal visible={warningModal} footer={null} centered closeIcon={false}>
        <Spin spinning={modalLoad}>
          <div className="dashboard m-2">
            <h4 className="text-xl font-semibold text-center py-2">
              Are you sure you want to{" "}
              {selectedRecord?.isActive ? "Deactivate" : "Activate"} <br /> this
              user status
            </h4>
            <footer className="flex justify-center items-center pt-2 space-x-4">
              <Button
                type="default"
                onClick={() => {
                  setSelectedRecord(null);
                  setWarningModal(false);
                }}
                className="min-w-[100px]"
              >
                No
              </Button>
              <Button
                type="primary"
                className="min-w-[100px]"
                onClick={() => userChangeStatus()}
              >
                Yes
              </Button>
            </footer>
          </div>
        </Spin>
      </Modal>
    </Spin>
  );
};

export default MLA;
