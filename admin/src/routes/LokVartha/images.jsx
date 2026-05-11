import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Button,
  message,
  Modal,
  Spin,
  Switch,
  Table,
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
import { fetchData, postData } from "../../api/apiService";
import { MdEdit } from "react-icons/md";
import AddUser from "./addUser";

const { RangePicker } = DatePicker;
const { Option } = Select;

const PhotoGallery = ({ data, onEdit, onToggle }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.map((item) => (
        <div
          key={item._id}
          className="border border-gray-200 rounded-xl p-5 w-full shadow-sm hover:shadow-lg transition-all duration-300 bg-white"
        >
          {/* Header with Title and Actions */}
          <div className="flex justify-between items-start mb-3">
            <h3
              className="font-semibold text-base mb-0 flex-1 pr-2 line-clamp-2"
              title={item.title}
            >
              {item.title || "N/A"}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                type="text"
                icon={<MdEdit size={18} />}
                onClick={() => onEdit(item)}
                className="p-1 h-auto"
                title="Edit"
              />
              <Switch
                checked={item.isActive === true}
                onChange={() => onToggle(item)}
                size="small"
              />
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mb-3">
            {item.images?.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {item.images.slice(0, 6).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-md overflow-hidden border border-gray-200 bg-gray-100"
                  >
                    <img
                      src={img}
                      alt={`${item.title} - Image ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML =
                          '<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs">Error</div>';
                      }}
                    />
                  </div>
                ))}
                {item.images.length > 6 && (
                  <div className="relative aspect-square rounded-md overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                    <span className="text-xs text-gray-500 font-medium">
                      +{item.images.length - 6}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-32 rounded-md border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No Images</span>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 font-medium">MLA:</span>
              <span className="text-gray-700 capitalize">
                {item.mla?.user?.name || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 font-medium">Status:</span>
              <span
                className="text-white px-2 py-0.5 rounded text-xs font-medium"
                style={{
                  backgroundColor:
                    item.status === "Published"
                      ? "#10b981"
                      : item.status === "Draft"
                      ? "#f59e0b"
                      : "#6b7280",
                }}
              >
                {item.status || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 font-medium">Date:</span>
              <span className="text-gray-700">
                {item.publishDate
                  ? moment(item.publishDate).format("DD/MM/YYYY")
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* Content Preview */}
          {item.content && (
            <div className="pt-3 border-t border-gray-100">
              <p
                className="text-xs text-gray-600 line-clamp-3"
                title={item.content}
              >
                {item.content.length > 120
                  ? `${item.content.substring(0, 120)}...`
                  : item.content}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const Images = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("0");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [userModelFlag, setUserModelFlag] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [newStatus, setNewStatus] = useState(false);
  const [modalLoad, setModalLoad] = useState(false);
  const [statusFilter, setStatusFilter] = useState(""); // "" = All, "Published", "Draft"
  const [dateRange, setDateRange] = useState(null);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);

  const toggleMedia = async (record) => {
    try {
      const response = await postData("/api/mla/toggle-media", {
        mediaId: record._id,
      });

      if (response?.responseCode === 200) {
        message.success(response?.message || "Status toggled successfully!");
        return true;
      } else {
        message.error(response?.message || "Failed to toggle status");
        return false;
      }
    } catch (error) {
      message.error("Error toggling media status");
      return false;
    }
  };

  const userChangeStatus = async () => {
    console.log(selectedRecord);
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
      } else if (response?.responseCode == 400) {
        message.error(response?.message || "Something went wrong");
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to fetch photo gallery");
    } finally {
      setModalLoad(false);
      fetchUserList();
    }
  };

  const handleEdit = (record) => {
    setEditId(record._id);
    setUserModelFlag(true);
    setSelectedRecord(record);
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return statusFilter || dateRange || selectedFilter !== "0";
  };

  // Clear all filters
  const handleClearFilters = () => {
    setStatusFilter("");
    setDateRange(null);
    setSelectedFilter("0");
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const fetchUserList = async () => {
    // Build payload according to API specification
    const payload = {
      page: currentPage,
      pageSize: pageSize,
    };

    // Add search if provided
    if (searchQuery && searchQuery.trim()) {
      payload.search = searchQuery.trim();
    }

    // Add filter (always PhotoGallery for this component)
    payload.filter = "PhotoGallery";

    // Add status filter if selected
    if (statusFilter && statusFilter.trim()) {
      payload.status = statusFilter;
    }

    // Add date range filters if provided
    if (dateRange && dateRange[0]) {
      payload.startDate = moment(dateRange[0]).format("YYYY-MM-DD");
    }
    if (dateRange && dateRange[1]) {
      payload.endDate = moment(dateRange[1]).format("YYYY-MM-DD");
    }

    // Add sort: "-1" for newest first (descending), "1" for oldest first (ascending)
    // selectedFilter "0" = Newest First = "-1", selectedFilter "1" = Oldest First = "1"
    payload.sort = selectedFilter === "1" ? "1" : "-1";

    try {
      setLoading(true);
      const response = await postData("/api/mla/list-of-media", payload);
      if (response?.responseCode === 200) {
        setUsers(response?.data?.media || []);
        setTotal(response?.data?.totalMedia || 0);
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to fetch photo gallery");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (record) => {
    try {
      await toggleMedia(record);
      fetchUserList();
    } catch (error) {
      console.error("Failed to toggle media:", error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, [
    selectedFilter,
    currentPage,
    pageSize,
    searchQuery,
    statusFilter,
    dateRange,
  ]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  console.log("users", users);

  return (
    <Spin spinning={loading}>
      <div className="relative">
        {/* Main Content */}
        <div
          className={`transition-all duration-300 ${
            userModelFlag ? "blur-sm" : ""
          }`}
        >
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
                          statusFilter,
                          dateRange,
                          selectedFilter !== "0",
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
              title={
                <span className="text-lg font-semibold">Filters & Sort</span>
              }
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
                      <div className="grid grid-cols-1 gap-4">
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
                            value={statusFilter}
                            onChange={(value) => {
                              setStatusFilter(value || "");
                              setCurrentPage(1);
                            }}
                          >
                            <Option value="">All Status</Option>
                            <Option value="Published">Published</Option>
                            <Option value="Draft">Draft</Option>
                          </Select>
                        </div>

                        {/* Date Range Filter */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Publish Date Range
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
              {users.length > 0 ? (
                <PhotoGallery
                  data={users}
                  onEdit={handleEdit}
                  onToggle={handleToggle}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No photo galleries found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddUser
        patientDrawer={userModelFlag}
        setPatientDrawer={setUserModelFlag}
        fetchPatientsList={fetchUserList}
        editId={editId}
        setEditId={setEditId}
        data={selectedRecord}
        mediaType="PhotoGallery"
      />

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

export default Images;
