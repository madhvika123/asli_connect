import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Button,
  message,
  Modal,
  Spin,
  Switch,
  Table,
  Tag,
  Tooltip,
  DatePicker,
  Select,
  Drawer,
  Space,
  Divider,
} from "antd";
const { RangePicker } = DatePicker;
const { Option } = Select;
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
// import AddDoctor from "./AddDoctor";
import { PiGitBranchFill } from "react-icons/pi";
import TruncatedTextWithTooltip, {
  createTruncatedTextRenderer,
} from "../../utils/TruncatedTextWithTooltip";
import { useDocumentButton } from "../../utils/DocumentViewer";

const PartyRequest = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null); // "approved" | "rejected"
  const [warningModal, setWarningModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalLoad, setModalLoad] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  // Constituency filters
  const [parlimentaryConstituencies, setParlimentaryConstituencies] = useState(
    []
  );
  const [constituencies, setConstituencies] = useState([]);
  const [
    selectedParlimentaryConstituency,
    setSelectedParlimentaryConstituency,
  ] = useState(null);
  const [selectedAssemblyConstituency, setSelectedAssemblyConstituency] =
    useState(null);

  // Document button helper hook
  const { renderDocuments, DocumentModal } = useDocumentButton({
    buttonText: "View",
    emptyText: "No images",
    modalTitle: "View Documents",
  });

  // Fetch constituencies
  const fetchConstituencies = async () => {
    try {
      const response = await postData(
        "/api/admin/fetch-Assembly-constituencies",
        {
          limit: 1000,
          page: 1,
          parliamentaryConstituencyId:
            selectedParlimentaryConstituency?._id || null,
        }
      );
      setConstituencies(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching constituencies:", error);
    }
  };

  const fetchParlimentaryConstituencies = async () => {
    try {
      const response = await postData(
        "/api/admin/fetch-Parlimentary-constituencies",
        {
          limit: 1000,
          page: 1,
        }
      );
      setParlimentaryConstituencies(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching constituencies:", error);
    }
  };

  useEffect(() => {
    fetchParlimentaryConstituencies();
  }, []);

  useEffect(() => {
    fetchConstituencies();
    // Reset assembly constituency when parliamentary changes
    if (selectedParlimentaryConstituency) {
      setSelectedAssemblyConstituency(null);
    }
  }, [selectedParlimentaryConstituency]);

  // Debounce search input to reduce API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1); // reset to first page on new search
    }, 300); // 300ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  // Clear search when any filter is applied
  useEffect(() => {
    if (
      selectedStatus ||
      selectedGender ||
      dateRange ||
      selectedParlimentaryConstituency ||
      selectedAssemblyConstituency
    ) {
      setSearchInput("");
      setSearchQuery("");
    }
  }, [
    selectedStatus,
    selectedGender,
    dateRange,
    selectedParlimentaryConstituency,
    selectedAssemblyConstituency,
  ]);

  const requestColumns = [
    {
      title: "S.No",
      align: "center",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: ["user", "name"],
      key: "name",
      align: "center",
      render: (name) => {
        if (!name) return <span>N/A</span>;

        const displayName = name.length > 16 ? `${name.slice(0, 16)}...` : name;

        return (
          <Tooltip title={name}>
            <span className="capitalize">{displayName}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
      align: "center",
      render: (email) => <span>{email || "N/A"}</span>,
    },
    {
      title: "Father's/Mother's Name",
      dataIndex: "parentName",
      key: "parentName",
      align: "center",
      render: (parentName) => <span>{parentName || "N/A"}</span>,
    },
    {
      title: "Phone",
      dataIndex: ["user", "phone"],
      key: "phone",
      align: "center",
      render: (phone) => <span>{phone || "N/A"}</span>,
    },
    {
      title: "Date of Birth",
      dataIndex: ["user", "dateOfBirth"],
      key: "dob",
      align: "center",
      render: (dob) => (dob ? moment(dob).format("DD/MM/YYYY") : "N/A"),
    },
    {
      title: "Gender",
      dataIndex: ["user", "gender"],
      key: "gender",
      align: "center",
      render: (gender) => <span>{gender || "N/A"}</span>,
    },
    {
      title: "Marital Status",
      dataIndex: "maritalStatus",
      key: "maritalStatus",
      align: "center",
      render: (maritalStatus) => <span>{maritalStatus || "N/A"}</span>,
    },
    {
      title: "Parliamentary Constituency",
      dataIndex: ["user", "parliamentaryConstituency", "name"],
      key: "parliamentaryConstituency",
      align: "center",
      render: (name) => <span>{name || "N/A"}</span>,
    },
    {
      title: "Assembly Constituency",
      dataIndex: ["user", "assemblyConstituency", "name"],
      key: "assemblyConstituency",
      align: "center",
      render: (name) => <span>{name || "N/A"}</span>,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      align: "center",
      render: createTruncatedTextRenderer({ maxLength: 30 }),
    },
    {
      title: "Photos",
      dataIndex: "images",
      key: "images",
      align: "center",
      render: renderDocuments,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        let color = "default";
        if (status === "pending") color = "orange";
        if (status === "approved") color = "green";
        if (status === "rejected") color = "red";
        return <Tag color={color}>{status || "N/A"}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="space-x-2">
          <Button
            type="primary"
            size="small"
            // disabled={record.status !== "pending"}
            onClick={() => {
              setSelectedUser(record);
              setSelectedAction("approved");
              setWarningModal(true);
            }}
          >
            Approve
          </Button>

          <Button
            type="default"
            danger
            size="small"
            disabled={record.status !== "pending"}
            onClick={() => {
              setSelectedUser(record);
              setSelectedAction("rejected");
              setWarningModal(true);
            }}
          >
            Reject
          </Button>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt) =>
        createdAt ? moment(createdAt).format("DD/MM/YYYY") : "N/A",
    },
  ];

  const fetchUserList = async () => {
    const payload = {
      page: currentPage,
      pageSize: pageSize,
      search: searchQuery || undefined,
      sortBy: selectedFilter,
      status: selectedStatus || undefined,
      gender: selectedGender || undefined,
      startDate:
        dateRange && dateRange[0]
          ? dateRange[0].format("YYYY-MM-DD")
          : undefined,
      endDate:
        dateRange && dateRange[1]
          ? dateRange[1].format("YYYY-MM-DD")
          : undefined,
      // Constituency filters
      parliamentaryConstituencyId:
        selectedParlimentaryConstituency?._id || undefined,
      assemblyConstituencyId: selectedAssemblyConstituency?._id || undefined,
    };
    try {
      setLoading(true);
      const response = await postData("/api/admin/list-of-requests", payload);
      if (response?.responseCode == 200) {
        setUsers(response?.data?.requests || []);
        setTotal(response?.data?.totalRequests || 1);
      } else if (response?.responseCode == 400) {
        message.error(response?.message || "Something went wrong");
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to fetch requests List");
    } finally {
      setLoading(false);
    }
  };

  // === Function to Approve or Reject ===
  const updateRequestStatus = async (id, action) => {
    try {
      setLoading(true);

      const res = await postData(
        `/api/admin/approve-or-reject-membership-request`,
        {
          status: action, // "approved" or "rejected"
          requestId: id,
        }
      );

      console.log("Response from updateRequestStatus:", res);

      if (res?.responseCode === 200) {
        message.success(`Request ${action} successfully`);
        fetchUserList();
        setWarningModal(false);
        setSelectedUser(null);
      } else {
        message.error(res?.message || "Failed to update request");
      }
    } catch (err) {
      console.error(err);
      message.error("Error updating request");
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
    selectedStatus,
    selectedGender,
    dateRange,
    selectedParlimentaryConstituency,
    selectedAssemblyConstituency,
  ]);

  const handleClearFilters = () => {
    setSelectedStatus(null);
    setSelectedGender(null);
    setDateRange(null);
    setSelectedFilter("-1");
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
    // Clear constituency filters
    setSelectedParlimentaryConstituency(null);
    setSelectedAssemblyConstituency(null);
  };

  const hasActiveFilters = () => {
    return (
      selectedStatus ||
      selectedGender ||
      dateRange ||
      selectedFilter !== "-1" ||
      selectedParlimentaryConstituency ||
      selectedAssemblyConstituency
    );
  };

  console.log("users", users);

  return (
    <Spin spinning={loading}>
      <div className="mt-2 flex flex-col gap-2">
        {/* Top Bar - Search and Actions */}
        <div className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg shadow-sm">
          {/* Search Section */}
          <div className="flex items-center gap-2 flex-1">
            <TextField
              id="outlined-basic"
              label="Search"
              variant="outlined"
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && setSearchQuery(searchInput.trim())
              }
              type="search"
              className="w-[350px]"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchOutlined
                      className="cursor-pointer"
                      onClick={() => setSearchQuery(searchInput.trim())}
                    />
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
                      selectedStatus,
                      selectedGender,
                      dateRange,
                      selectedFilter !== "-1",
                      selectedParlimentaryConstituency,
                      selectedAssemblyConstituency,
                    ].filter(Boolean).length
                  }
                </span>
              )}
            </div>
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
                        <Option value="all">All (Including Approved)</Option>
                        <Option value="pending">Pending</Option>
                        <Option value="approved">Approved</Option>
                        <Option value="rejected">Rejected</Option>
                      </Select>
                    </div>

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

                    {/* Parliamentary Constituency Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Parliamentary Constituency
                      </label>
                      <Select
                        placeholder="Select Parliamentary Constituency"
                        allowClear
                        style={{ width: "100%" }}
                        size="large"
                        value={selectedParlimentaryConstituency?._id || null}
                        onChange={(value) => {
                          const selected = parlimentaryConstituencies.find(
                            (pc) => pc._id === value
                          );
                          setSelectedParlimentaryConstituency(selected || null);
                          setCurrentPage(1);
                        }}
                      >
                        {parlimentaryConstituencies.map((pc) => (
                          <Option key={pc._id} value={pc._id}>
                            {pc.name}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    {/* Assembly Constituency Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Assembly Constituency
                      </label>
                      <Select
                        placeholder="Select Assembly Constituency"
                        allowClear
                        style={{ width: "100%" }}
                        size="large"
                        value={selectedAssemblyConstituency?._id || null}
                        onChange={(value) => {
                          const selected = constituencies.find(
                            (ac) => ac._id === value
                          );
                          setSelectedAssemblyConstituency(selected || null);
                          setCurrentPage(1);
                        }}
                        disabled={!selectedParlimentaryConstituency}
                      >
                        {constituencies.map((ac) => (
                          <Option key={ac._id} value={ac._id}>
                            {ac.name}
                          </Option>
                        ))}
                      </Select>
                      {!selectedParlimentaryConstituency && (
                        <p className="text-xs text-gray-500 mt-1">
                          Please select a Parliamentary Constituency first
                        </p>
                      )}
                    </div>

                    {/* Date Range Filter */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Date Range
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
            columns={requestColumns}
            dataSource={users}
            locale={{
              emptyText: (
                <div style={{ color: "black" }}>
                  {searchQuery || hasActiveFilters()
                    ? "No Requests Found"
                    : "No Requests available"}
                </div>
              ),
            }}
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
        <Modal visible={warningModal} footer={null} centered closeIcon={false}>
          <Spin spinning={modalLoad}>
            <div className="dashboard m-2">
              <h4 className="text-xl font-semibold text-center py-2">
                Are you sure you want to{" "}
                {selectedAction === "approved" ? "Approve" : "Reject"} <br />{" "}
                this Party Member request?
              </h4>
              <footer className="flex justify-center items-center pt-2 space-x-4">
                <Button
                  type="default"
                  onClick={() => {
                    setSelectedUser(null);
                    setWarningModal(false);
                  }}
                  className="min-w-[100px]"
                >
                  No
                </Button>
                <Button
                  type="primary"
                  className="min-w-[100px]"
                  onClick={() =>
                    updateRequestStatus(selectedUser?._id, selectedAction)
                  }
                >
                  Yes
                </Button>
              </footer>
            </div>
          </Spin>
        </Modal>

        {/* Document Viewer Modal */}
        <DocumentModal />

        {/* <AddDoctor
          doctorDrawer={doctorDrawer}
          setDoctorDrawer={setDoctorDrawer}
          fetchDoctorsList={fetchDoctorsList}
          editId={editId}
          setEditId={setEditId}
          branchData={branchData}
          setBranchData={setBranchData}
          departmentData={departmentData}
        /> */}
      </div>
    </Spin>
  );
};

export default PartyRequest;
