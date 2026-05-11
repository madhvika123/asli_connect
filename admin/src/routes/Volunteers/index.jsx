import React, { useEffect, useState } from "react";
import {
  Button,
  message,
  Spin,
  Table,
  Tag,
  Modal,
  Drawer,
  Space,
  Divider,
  Select,
  DatePicker,
  InputNumber,
  Tooltip,
} from "antd";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import {
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  HourglassOutlined,
  FilterOutlined,
  ClearOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { postData, fetchData } from "../../api/apiService";
import AddVolunteer from "./AddVolunteer";
import moment from "moment";
import TruncatedTextWithTooltip from "../../utils/TruncatedTextWithTooltip";

const { Option } = Select;
const { RangePicker } = DatePicker;

const Volunteers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [volunteers, setVolunteers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalVolunteers: 0,
    activeVolunteers: 0,
    pendingVolunteers: 0,
  });
  const [userModelFlag, setUserModelFlag] = useState(false);
  const [partyMembers, setPartyMembers] = useState([]);
  const [statusUpdateModal, setStatusUpdateModal] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);
  const [startAge, setStartAge] = useState(null);
  const [endAge, setEndAge] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [selectedPreferredTimeSlot, setSelectedPreferredTimeSlot] =
    useState(null);

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  // Fetch party members for dropdown
  const fetchPartyMembers = async () => {
    try {
      const payload = {
        page: 1,
        pageSize: 1000, // Fetch all party members for dropdown
        search: "",
        sortBy: "-1",
        isVolunteer: true,
      };
      const response = await postData(
        "/api/admin/list-of-party-members",
        payload
      );
      if (response?.responseCode === 200) {
        setPartyMembers(response?.data?.Partymembers || []);
      }
    } catch (error) {
      console.error("Failed to fetch party members:", error);
    }
  };

  // Fetch dropdown data
  useEffect(() => {
    fetchVolunteerList();
    VolunteerdData();
    fetchPartyMembers();
  }, []);

  const volunteerColumns = [
    {
      title: "S.No",
      align: "center",
      key: "index",
      width: 120,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Volunteer ID",
      dataIndex: "volunteerId",
      key: "volunteerId",
      align: "center",
      width: 150,
      render: (volunteerId) => <span>{volunteerId || "N/A"}</span>,
    },
    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: 180,
      render: (name) => <span className="capitalize">{name || "N/A"}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
      width: 220,
      render: (email) => <span>{email || "N/A"}</span>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      align: "center",
      width: 150,
      render: (phone) => <span>{phone || "N/A"}</span>,
    },

    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      align: "center",
      width: 120,
      render: (age) => <span>{age ? `${age} years` : "N/A"}</span>,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      align: "center",
      width: 140,
      render: (gender) => <span className="capitalize">{gender || "N/A"}</span>,
    },
    {
      title: "Occupation",
      dataIndex: "occupation",
      key: "occupation",
      align: "center",
      width: 180,
      render: (occupation) => (
        <span className="capitalize">{occupation || "N/A"}</span>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      align: "center",
      width: 250,
      render: (address, record) => {
        // Prefer address if present, else assemble from other fields
        let text;
        if (address) {
          text = address;
        } else {
          const parts = [
            record.flatNumber,
            record.area,
            record.street,
            record.city,
            record.district,
            record.state,
            record.pincode,
          ]
            .filter(Boolean)
            .join(", ");
          text = parts || null;
        }
        return (
          <TruncatedTextWithTooltip
            text={text}
            maxLength={30}
            placeholder="N/A"
          />
        );
      },
    },

    {
      title: "Areas of Interest",
      dataIndex: "areasOfInterest",
      key: "areasOfInterest",
      align: "center",
      width: 280,
      render: (areasOfInterest, record) => {
        // Support both singular and plural field names
        const areas = areasOfInterest || record.areaOfInterest;

        if (Array.isArray(areas) && areas.length > 0) {
          const colors = [
            "blue",
            "green",
            "orange",
            "purple",
            "cyan",
            "magenta",
          ];
          const visibleAreas = areas.slice(0, 2);
          const remainingCount = areas.length - 2;

          return (
            <Tooltip
              title={
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    maxWidth: "400px",
                  }}
                >
                  {areas.map((area, index) => (
                    <Tag
                      key={index}
                      color={colors[index % colors.length]}
                      style={{
                        margin: 0,
                        borderRadius: "12px",
                        padding: "2px 10px",
                        fontSize: "11px",
                        fontWeight: "500",
                      }}
                    >
                      {area}
                    </Tag>
                  ))}
                </div>
              }
              overlayStyle={{
                maxWidth: "500px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "nowrap",
                  gap: "6px",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                {visibleAreas.map((area, index) => (
                  <Tag
                    key={index}
                    color={colors[index % colors.length]}
                    style={{
                      margin: 0,
                      borderRadius: "12px",
                      padding: "2px 10px",
                      fontSize: "11px",
                      fontWeight: "500",
                      flexShrink: 0,
                    }}
                  >
                    {area}
                  </Tag>
                ))}
                {remainingCount > 0 && (
                  <Tag
                    style={{
                      margin: 0,
                      borderRadius: "12px",
                      padding: "2px 10px",
                      fontSize: "11px",
                      backgroundColor: "#f0f0f0",
                      color: "#666",
                      border: "1px solid #d9d9d9",
                      flexShrink: 0,
                    }}
                  >
                    +{remainingCount}
                  </Tag>
                )}
              </div>
            </Tooltip>
          );
        }
        return <span style={{ color: "#999" }}>N/A</span>;
      },
    },
    {
      title: "Availability",
      dataIndex: "availability",
      key: "availability",
      align: "center",
      width: 150,
      render: (availability) => {
        if (!availability) {
          return <span style={{ color: "#999" }}>N/A</span>;
        }
        return (
          <Tag
            icon={<CheckCircleOutlined />}
            color="success"
            style={{
              borderRadius: "12px",
              padding: "4px 12px",
              fontSize: "12px",
              fontWeight: "500",
            }}
          >
            {availability}
          </Tag>
        );
      },
    },
    {
      title: "Preferred Time Slot",
      dataIndex: "preferredTimeSlot",
      key: "preferredTimeSlot",
      align: "center",
      width: 200,
      render: (preferredTimeSlot, record) => {
        // Support both singular and plural field names
        const slot = preferredTimeSlot || record.preferredTimeSlots;

        if (Array.isArray(slot) && slot.length > 0) {
          return (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                justifyContent: "center",
              }}
            >
              {slot.slice(0, 2).map((time, index) => (
                <Tag
                  key={index}
                  icon={<ClockCircleOutlined />}
                  color="geekblue"
                  style={{
                    margin: 0,
                    borderRadius: "12px",
                    padding: "3px 10px",
                    fontSize: "11px",
                  }}
                >
                  {time}
                </Tag>
              ))}
              {slot.length > 2 && (
                <Tag
                  style={{
                    margin: 0,
                    borderRadius: "12px",
                    padding: "3px 10px",
                    fontSize: "11px",
                    backgroundColor: "#f0f0f0",
                    color: "#666",
                  }}
                >
                  +{slot.length - 2}
                </Tag>
              )}
            </div>
          );
        } else if (typeof slot === "string" && slot.trim()) {
          return (
            <Tag
              icon={<ClockCircleOutlined />}
              color="geekblue"
              style={{
                borderRadius: "12px",
                padding: "4px 12px",
                fontSize: "12px",
              }}
            >
              {slot}
            </Tag>
          );
        }
        return <span style={{ color: "#999" }}>N/A</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 150,
      render: (status) => {
        let color = "default";
        if (status === "approved") color = "green";
        else if (status === "pending") color = "orange";
        else if (status === "rejected" || status === "closed") color = "red";

        return (
          <Tag color={color} style={{ textTransform: "capitalize" }}>
            {status || "N/A"}
          </Tag>
        );
      },
    },

    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      width: 180,
      render: (createdAt) =>
        createdAt ? moment(createdAt).format("DD/MM/YYYY") : "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      width: 200,
      render: (record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <Button
            type="primary"
            size="small"
            onClick={() => handleStatusUpdate(record, "approved")}
            disabled={record.status === "approved"}
            style={{
              backgroundColor:
                record.status === "approved" ? "#ccc" : "#3D8926",
              borderColor: record.status === "approved" ? "#ccc" : "#3D8926",
            }}
          >
            Approve
          </Button>

          <Button
            danger
            size="small"
            onClick={() => handleStatusUpdate(record, "rejected")}
            disabled={record.status === "rejected"}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  // Handle volunteer status update
  const handleStatusUpdate = (volunteer, status) => {
    setSelectedVolunteer({ ...volunteer, newStatus: status });
    setStatusUpdateModal(true);
  };

  const confirmStatusUpdate = async () => {
    if (!selectedVolunteer) return;

    setStatusUpdateLoading(true);
    try {
      const payload = {
        volunteerId: selectedVolunteer._id,
        status: selectedVolunteer.newStatus,
      };

      const response = await postData(
        "/api/admin/update-volunteer-status",
        payload
      );

      if (response?.responseCode === 200) {
        message.success(
          `Volunteer ${selectedVolunteer.newStatus} successfully`
        );
        setStatusUpdateModal(false);
        setSelectedVolunteer(null);
        fetchVolunteerList();
        VolunteerdData();
      } else {
        message.error(response?.message || "Failed to update volunteer status");
      }
    } catch (error) {
      message.error(error?.message || "Failed to update volunteer status");
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const VolunteerdData = async () => {
    try {
      const response = await fetchData("/api/admin/volunteer-analytics");
      if (response.responseCode === 200) {
        setDashboardStats(response.data);
      } else {
        message.error(response.message || "Failed to fetch dashboard data");
      }
    } catch (error) {
      message.error("Failed to fetch dashboard data");
    }
  };

  const fetchVolunteerList = async () => {
    const mlaId = localStorage.getItem("userId");
    const payload = {
      page: currentPage,
      pageSize: pageSize,
      search: searchQuery || undefined,
      sort: selectedFilter,
      gender: selectedGender
        ? selectedGender.charAt(0).toUpperCase() +
          selectedGender.slice(1).toLowerCase()
        : undefined,
      startAge: startAge !== null ? startAge : undefined,
      endAge: endAge !== null ? endAge : undefined,
      status: selectedStatus || undefined,
      startDate:
        dateRange && dateRange[0]
          ? dateRange[0].format("YYYY-MM-DD")
          : undefined,
      endDate:
        dateRange && dateRange[1]
          ? dateRange[1].format("YYYY-MM-DD")
          : undefined,
      availability: selectedAvailability || undefined,
      preferredTimeSlot: selectedPreferredTimeSlot || undefined,
      // mlaId: mlaId || undefined,
    };

    try {
      setLoading(true);
      const response = await postData("/api/mla/list-of-volunteers", payload);

      if (response?.responseCode === 200) {
        setVolunteers(response?.data?.volunteers || []);
        setTotal(response?.data?.totalVolunteers || 1);
      } else {
        message.error(response?.message || "Failed to fetch volunteers");
      }
    } catch (error) {
      message.error(error?.message || "Failed to fetch volunteers list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteerList();
  }, [
    selectedFilter,
    currentPage,
    pageSize,
    searchQuery,
    selectedGender,
    startAge,
    endAge,
    selectedStatus,
    dateRange,
    selectedAvailability,
    selectedPreferredTimeSlot,
  ]);

  // Clear search when any filter is applied
  useEffect(() => {
    if (
      selectedGender ||
      startAge !== null ||
      endAge !== null ||
      selectedStatus ||
      dateRange ||
      selectedAvailability ||
      selectedPreferredTimeSlot
    ) {
      setSearchInput("");
      setSearchQuery("");
    }
  }, [
    selectedGender,
    startAge,
    endAge,
    selectedStatus,
    dateRange,
    selectedAvailability,
    selectedPreferredTimeSlot,
  ]);

  const handleClearFilters = () => {
    setSelectedGender(null);
    setStartAge(null);
    setEndAge(null);
    setSelectedStatus(null);
    setDateRange(null);
    setSelectedAvailability(null);
    setSelectedPreferredTimeSlot(null);
    setSelectedFilter("-1");
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const hasActiveFilters = () => {
    return (
      selectedGender ||
      startAge !== null ||
      endAge !== null ||
      selectedStatus ||
      dateRange ||
      selectedAvailability ||
      selectedPreferredTimeSlot ||
      selectedFilter !== "-1"
    );
  };

  const handleAddVolunteer = () => {
    setUserModelFlag(true);
  };

  return (
    <Spin spinning={loading}>
      <div className="mt-2 flex flex-col gap-2">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Volunteers
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {dashboardStats?.totalVolunteers || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#3D8926]">
                <TeamOutlined style={{ color: "white", fontSize: "22px" }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Active Volunteers
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {dashboardStats?.activeVolunteers || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#3D8926]">
                <UserSwitchOutlined
                  style={{ color: "white", fontSize: "22px" }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Pending Applications
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {dashboardStats?.pendingVolunteers || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#3D8926]">
                <HourglassOutlined
                  style={{ color: "white", fontSize: "22px" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex items-center justify-between client-details-form">
          <div className="flex items-center justify-start gap-2 w-full">
            <TextField
              id="outlined-basic"
              label="Search"
              variant="outlined"
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              type="search"
              className="w-full max-w-[400px]"
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
                      selectedGender,
                      startAge !== null,
                      endAge !== null,
                      selectedStatus,
                      dateRange,
                      selectedAvailability,
                      selectedPreferredTimeSlot,
                      selectedFilter !== "-1",
                    ].filter(Boolean).length
                  }
                </span>
              )}
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddVolunteer}
              className="h-[36px] w-[36px] p-0"
              style={{
                backgroundColor: "#3D8926",
                borderColor: "#3D8926",
              }}
              title="Add Volunteer"
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

                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Status
                      </label>
                      <Select
                        placeholder="Select Status"
                        allowClear
                        style={{ width: "100%" }}
                        size="large"
                        value={selectedStatus}
                        onChange={(value) => {
                          setSelectedStatus(value);
                          setCurrentPage(1);
                        }}
                      >
                        <Option value="approved">Approved</Option>
                        <Option value="pending">Pending</Option>
                        <Option value="rejected">Rejected</Option>
                        {/* <Option value="closed">Closed</Option> */}
                      </Select>
                    </div>

                    {/* Age Range Filter */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Age Range
                      </label>
                      <div className="flex items-center gap-2">
                        <InputNumber
                          placeholder="Start Age"
                          min={0}
                          max={150}
                          style={{ width: "100%" }}
                          size="large"
                          value={startAge}
                          onChange={(value) => {
                            setStartAge(value);
                            setCurrentPage(1);
                          }}
                        />
                        <span className="text-gray-500">to</span>
                        <InputNumber
                          placeholder="End Age"
                          min={0}
                          max={150}
                          style={{ width: "100%" }}
                          size="large"
                          value={endAge}
                          onChange={(value) => {
                            setEndAge(value);
                            setCurrentPage(1);
                          }}
                        />
                      </div>
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

                    {/* Availability Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Availability
                      </label>
                      <Select
                        placeholder="Select Availability"
                        allowClear
                        style={{ width: "100%" }}
                        size="large"
                        value={selectedAvailability}
                        onChange={(value) => {
                          setSelectedAvailability(value);
                          setCurrentPage(1);
                        }}
                      >
                        <Option value="Weekdays">Weekdays</Option>
                        <Option value="Weekends">Weekends</Option>
                        <Option value="Anytime">Anytime</Option>
                      </Select>
                    </div>

                    {/* Preferred Time Slot Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Preferred Time Slot
                      </label>
                      <Select
                        placeholder="Select Time Slot"
                        allowClear
                        style={{ width: "100%" }}
                        size="large"
                        value={selectedPreferredTimeSlot}
                        onChange={(value) => {
                          setSelectedPreferredTimeSlot(value);
                          setCurrentPage(1);
                        }}
                      >
                        <Option value="Complete Day">Complete Day</Option>
                        <Option value="Afternoon">Afternoon</Option>
                        <Option value="Evening">Evening</Option>
                        <Option value="Morning">Morning</Option>
                      </Select>
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

        {/* Table Section */}
        <div className="">
          <Table
            columns={volunteerColumns}
            dataSource={volunteers}
            locale={{ emptyText: "No volunteers available" }}
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
      </div>

      {/* Add Volunteer Drawer */}
      <AddVolunteer
        volunteerDrawer={userModelFlag}
        setVolunteerDrawer={setUserModelFlag}
        fetchVolunteersList={fetchVolunteerList}
        partyMembers={partyMembers}
      />

      {/* Status Update Confirmation Modal */}
      <Modal
        title="Confirm Status Update"
        open={statusUpdateModal}
        onCancel={() => {
          setStatusUpdateModal(false);
          setSelectedVolunteer(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setStatusUpdateModal(false);
              setSelectedVolunteer(null);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            loading={statusUpdateLoading}
            onClick={confirmStatusUpdate}
            style={{
              backgroundColor: "#3D8926",
              borderColor: "#3D8926",
            }}
          >
            Confirm
          </Button>,
        ]}
      >
        <p>
          Are you sure you want to {selectedVolunteer?.newStatus} volunteer{" "}
          <strong>{selectedVolunteer?.name}</strong>?
        </p>
      </Modal>
    </Spin>
  );
};

export default Volunteers;
