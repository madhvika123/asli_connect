import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Button,
  message,
  Modal,
  Spin,
  Table,
  Drawer,
  Space,
  Divider,
  Select,
  DatePicker,
} from "antd";
import { InputAdornment, TextField } from "@mui/material";
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { postData } from "../../api/apiService";
import AddUser from "./addUser";

const { RangePicker } = DatePicker;
const { Option } = Select;

const Events = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("-1");
  const [searchQuery, setSearchQuery] = useState("");

  const [users, setUsers] = useState([]);

  const [editId, setEditId] = useState(null);
  const [userModelFlag, setUserModelFlag] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [newStatus, setNewStatus] = useState(false);
  const [modalLoad, setModalLoad] = useState(false);

  // Filter states
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [predefinedFilter, setPredefinedFilter] = useState(null);

  // Event type options
  const eventTypeOptions = [
    { value: "Conference", label: "Conference" },
    { value: "Workshop", label: "Workshop" },
    { value: "Seminar", label: "Seminar" },
    { value: "Meetup", label: "Meetup" },
    { value: "Health Camp", label: "Health Camp" },
  ];

  const userChangeStatus = async () => {
    setModalLoad(true);
    const payload = {
      userId: selectedRecord._id,
    };
    try {
      setLoading(true);
      const response = await postData("/api/admin/toggle-user", payload);
      if (response?.responseCode == 200) {
        setWarningModal(false);
        setSelectedRecord(null);
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to update status");
    } finally {
      setModalLoad(false);
      fetchUserList();
    }
  };

  const columns = [
    {
      title: "S.No",
      align: "center",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Event Title",
      dataIndex: "title",
      key: "title",
      align: "center",
      render: (title) => <span className="capitalize">{title || "N/A"}</span>,
    },
    {
      title: "Event Type",
      dataIndex: "eventType",
      key: "eventType",
      align: "center",
      render: (eventType) => <span>{eventType || "N/A"}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      align: "center",
      render: (desc) => {
        const displayText = desc ? desc.slice(0, 30) : "N/A";
        return (
          <span title={desc}>
            {displayText}
            {desc && desc.length > 30 ? "..." : ""}
          </span>
        );
      },
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      align: "center",
      render: (location) => <span>{location || "N/A"}</span>,
    },
    {
      title: "Event Date",
      dataIndex: "dateAndTime",
      key: "eventDate",
      align: "center",
      render: (value) => (value ? moment(value).format("DD/MM/YYYY") : "N/A"),
    },
    //event time
    {
      title: "Event Time",
      dataIndex: "dateAndTime",
      key: "eventTime",
      align: "center",
      render: (value) => (value ? moment(value).format("hh:mm A") : "N/A"),
    },

    {
      title: "Organizer (MLA)",
      dataIndex: ["mla", "user", "name"],
      key: "mlaName",
      align: "center",
      render: (name) => <span className="capitalize">{name || "N/A"}</span>,
    },
  ];

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      selectedEventType ||
      dateRange ||
      predefinedFilter ||
      selectedFilter !== "-1"
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedEventType(null);
    setDateRange(null);
    setPredefinedFilter(null);
    setSelectedFilter("-1");
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const fetchUserList = async () => {
    const payload = {
      page: currentPage,
      pageSize: pageSize,
    };

    // Add search only if provided
    if (searchQuery) {
      payload.search = searchQuery;
    }

    // Add event type filter only if selected
    if (selectedEventType) {
      payload.eventType = selectedEventType;
    }

    // Add date range filters only if dateRange is set
    if (dateRange && dateRange[0]) {
      payload.startDate = dateRange[0].format("YYYY-MM-DD");
    }
    if (dateRange && dateRange[1]) {
      payload.endDate = dateRange[1].format("YYYY-MM-DD");
    }

    // Add predefined filter (ongoing/upcoming/past)
    if (predefinedFilter) {
      payload.filter = predefinedFilter;
    }

    // Add sort filter
    if (selectedFilter !== "-1") {
      payload.sort = selectedFilter;
    }

    try {
      setLoading(true);
      const response = await postData("/api/mla/list-of-events", payload);
      if (response?.responseCode === 200) {
        setUsers(response?.data?.events || []);
        setTotal(response?.data?.totalEvents || 0);
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to fetch events");
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
    selectedEventType,
    dateRange,
    predefinedFilter,
  ]);

  // Real-time search debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  // Clear search when filters change
  useEffect(() => {
    if (selectedEventType || dateRange || predefinedFilter) {
      setSearchInput("");
      setSearchQuery("");
    }
  }, [selectedEventType, dateRange, predefinedFilter]);

  return (
    <Spin spinning={loading}>
      <div className="mt-2 flex flex-col gap-2">
        <div className="flex items-center justify-between client-details-form">
          <div className="flex items-center justify-start gap-2 w-full">
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
          <div className="flex items-center justify-end gap-2 w-full">
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
                      selectedEventType,
                      dateRange,
                      predefinedFilter,
                      selectedFilter !== "-1",
                    ].filter(Boolean).length
                  }
                </span>
              )}
            </div>
            <Button
              type="button"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditId(null);
                setUserModelFlag(true);
              }}
              className="bg-primary text-white h-[36px]"
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
                    <Option value="-1">Newest First</Option>
                    <Option value="1">Oldest First</Option>
                  </Select>
                </div>

                <Divider className="my-2" />

                {/* Filters Section */}
                <div>
                  <h4 className="text-base font-semibold mb-3">Filters</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {/* Predefined Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Event Status
                      </label>
                      <Select
                        placeholder="Select Event Status"
                        allowClear
                        style={{ width: "100%" }}
                        size="large"
                        value={predefinedFilter}
                        onChange={(value) => {
                          setPredefinedFilter(value);
                          setCurrentPage(1);
                        }}
                      >
                        <Option value="ongoing">Ongoing</Option>
                        <Option value="upcoming">Upcoming</Option>
                        <Option value="past">Past</Option>
                      </Select>
                    </div>

                    {/* Event Type Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Event Type
                      </label>
                      <Select
                        placeholder="Select Event Type"
                        allowClear
                        style={{ width: "100%" }}
                        size="large"
                        value={selectedEventType}
                        onChange={(value) => {
                          setSelectedEventType(value);
                          setCurrentPage(1);
                        }}
                      >
                        {eventTypeOptions.map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    {/* Date Range Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Date Range
                      </label>
                      <RangePicker
                        style={{ width: "100%" }}
                        size="large"
                        value={dateRange}
                        onChange={(dates) => {
                          setDateRange(dates);
                          setCurrentPage(1);
                        }}
                        format="YYYY-MM-DD"
                        placeholder={["Start Date", "End Date"]}
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
                    Clear All Filters
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
            locale={{ emptyText: "No Events available" }}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: total,
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

        <AddUser
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

export default Events;
