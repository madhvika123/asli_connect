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
import { FaUserDoctor } from "react-icons/fa6";
import { PiGitBranchFill } from "react-icons/pi";
import AddUser from "./addUser";
import TruncatedTextWithTooltip from "../../utils/TruncatedTextWithTooltip";
import { useDocumentButton } from "../../utils/DocumentViewer";

const { RangePicker } = DatePicker;
const { Option } = Select;

const Videos = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("0");
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [videoModelFlag, setVideoModelFlag] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [newStatus, setNewStatus] = useState(false);
  const [modalLoad, setModalLoad] = useState(false);
  const [userModelFlag, setUserModelFlag] = useState(false);
  const [statusFilter, setStatusFilter] = useState(""); // "" = All, "Published", "Draft"
  const [dateRange, setDateRange] = useState(null);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);

  // Document button helper hook
  const { renderDocuments, DocumentModal } = useDocumentButton({
    buttonText: "View",
    emptyText: "No images",
    modalTitle: "View Images",
  });

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
      message.error(error?.message || "Failed to fetch videos");
    } finally {
      setModalLoad(false);
      fetchVideoList();
    }
  };

  const handleStatusChange = (record, status) => {
    try {
      const payload = {
        financialRequestId: record._id,
        status: status,
      };
      setLoading(true);
      const response = postData(
        "/api/mla/approve-or-reject-financial-help-request",
        payload
      );
      if (response?.responseCode === 200) {
        message.success("Status updated successfully");
        fetchVideoList();
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "S.No",
      key: "index",
      align: "center",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center",
      render: (title) => {
        if (!title) return "N/A";
        return (
          <span className="capitalize">
            <TruncatedTextWithTooltip
              text={title}
              maxLength={20}
              tooltipMaxWidth={400}
            />
          </span>
        );
      },
    },
    {
      title: "MLA Name",
      dataIndex: ["mla", "user", "name"],
      key: "mlaName",
      align: "center",
      render: (name) => <span className="capitalize">{name || "N/A"}</span>,
    },
    {
      title: "Publish Date",
      dataIndex: "publishDate",
      key: "publishDate",
      align: "center",
      render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "N/A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            backgroundColor:
              status === "Published"
                ? "green"
                : status === "Draft"
                ? "orange"
                : "gray",
            color: "white",
          }}
        >
          {status || "N/A"}
        </span>
      ),
    },
    {
      title: "Video",
      dataIndex: "videoUrl",
      key: "video",
      align: "center",
      render: (videoUrl) =>
        videoUrl ? (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            Watch Video
          </a>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      align: "center",
      render: (content) => {
        if (!content) return "N/A";
        return (
          <TruncatedTextWithTooltip
            text={content}
            maxLength={30}
            tooltipMaxWidth={400}
          />
        );
      },
    },
    {
      title: "Documents",
      key: "documents",
      dataIndex: "images",
      align: "center",
      render: renderDocuments,
    },
    {
      title: "URL",
      key: "url",
      dataIndex: "url",
      align: "center",
      render: (url) => {
        if (!url || url.trim() === "") {
          return <span style={{ color: "#999" }}>N/A</span>;
        }
        return (
          <Button
            type="link"
            onClick={() => window.open(url, "_blank")}
            style={{ padding: 0 }}
          >
            View URL
          </Button>
        );
      },
    },
    {
      title: "Edit",
      key: "edit",
      align: "center",
      render: (_, record) => (
        <Button
          type="text"
          icon={<MdEdit size={20} />}
          onClick={() => {
            setEditId(record._id);
            setUserModelFlag(true);
            setSelectedRecord(record);
          }}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Switch
          checked={record.isActive === true}
          onChange={async () => {
            const success = await toggleMedia(record);
            if (success) {
              // optionally refresh table data
              fetchVideoList();
              record.isActive = record.isActive === true ? false : true;
            }
          }}
        />
      ),
    },
  ];

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

  const fetchVideoList = async () => {
    // Build payload according to API specification
    const payload = {
      page: currentPage,
      pageSize: pageSize,
    };

    // Add search if provided
    if (searchQuery && searchQuery.trim()) {
      payload.search = searchQuery.trim();
    }

    // Add filter (always Videos for this component)
    payload.filter = "Videos";

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
        setVideos(response?.data?.media || []);
        setTotal(response?.data?.totalMedia || 0);
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoList();
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

  console.log("videos", videos);

  return (
    <Spin spinning={loading}>
      <div className="relative">
        {/* Main Content */}
        <div
          className={`transition-all duration-300 ${
            videoModelFlag ? "blur-sm" : ""
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
              <Table
                columns={columns}
                dataSource={videos}
                locale={{ emptyText: "No videos available" }}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: total,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50", "100"],
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
        </div>

        <AddUser
          patientDrawer={userModelFlag}
          setPatientDrawer={setUserModelFlag}
          fetchPatientsList={fetchVideoList}
          editId={editId}
          setEditId={setEditId}
          mediaType="Videos"
          data={selectedRecord}
        />

        <DocumentModal />
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

export default Videos;
