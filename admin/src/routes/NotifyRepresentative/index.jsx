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
  Drawer,
  Space,
  Divider,
  Select,
  DatePicker,
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
// import AddDoctor from "./AddDoctor";
import { PiGitBranchFill } from "react-icons/pi";
import TruncatedTextWithTooltip, {
  createTruncatedTextRenderer,
} from "../../utils/TruncatedTextWithTooltip";
import { useDocumentButton } from "../../utils/DocumentViewer";

const { Option } = Select;
const { RangePicker } = DatePicker;

const NotifyRepresentative = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [district, setDistrict] = useState([]);
  const [tehsil, setTehsil] = useState([]);
  const [village, setVillage] = useState([]);
  const [area, setArea] = useState([]);
  const [state, setState] = useState([]);
  const [street, setStreet] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTehsil, setSelectedTehsil] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedStreet, setSelectedStreet] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [dateRange, setDateRange] = useState(null);

  // Document button helper hook
  const { renderDocuments, DocumentModal } = useDocumentButton({
    buttonText: "View",
    emptyText: "No documents",
    modalTitle: "View Documents",
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      // If search has more than 3 chars → search
      // OR if cleared (length === 0) → reload full list
      if (searchInput.length > 3 || searchInput.length === 0) {
        setCurrentPage(1);
        fetchUserList();
      }
    }, 500); // ⏳ debounce: wait 500ms after user stops typing

    return () => clearTimeout(timeout); // cleanup old timeout
  }, [searchInput]);

  const handleReject = async (record) => {
    try {
      console.log("record", record);
      const payload = {
        notifyRepresentativeId: record._id,
        status: "declined",
      };

      const response = await postData(
        "/api/mla/accept-or-reject-notify-representative",
        payload
      );

      if (response.responseCode !== 200) {
        message.error(response.message || "failed to reject");
      }
      message.success("Request rejected successfully");
      // Optional: refresh table data
      fetchUserList();
    } catch (error) {
      message.error(error?.message || "Failed to reject request");
    }
  };

  const handleApprove = async (record) => {
    try {
      console.log("record", record);
      const payload = {
        notifyRepresentativeId: record._id,
        status: "seen",
      };

      const response = await postData(
        "/api/mla/accept-or-reject-notify-representative",
        payload
      );

      if (response.responseCode !== 200) {
        message.error(response.message || "failed to Approve");
      }
      message.success("Request Approve successfully");
      // Optional: refresh table data
      fetchUserList();
    } catch (error) {
      message.error(error?.message || "Failed to Approve request");
    }
  };

  const columns = [
    {
      title: "S.No",
      key: "index",
      align: "center",
      width: 60,
      fixed: "left",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Name",
      key: "name",
      dataIndex: ["partyMember", "user", "name"],
      align: "center",
      width: 120,
      render: (name) => <span className="capitalize">{name || "N/A"}</span>,
    },
    {
      title: "Phone",
      key: "phone",
      dataIndex: ["partyMember", "user", "phone"],
      align: "center",
      width: 120,
      render: (phone) => <span>{phone || "N/A"}</span>,
    },
    {
      title: "Title",
      key: "title",
      dataIndex: "title",
      align: "center",
      width: 150,
      render: (title) => (
        <span title={title}>{title ? (title.length > 20 ? `${title.slice(0, 20)}...` : title) : "N/A"}</span>
      ),
    },
    {
      title: "State",
      key: "state",
      dataIndex: "state",
      align: "center",
      width: 120,
      render: (state) => <span className="capitalize">{state || "N/A"}</span>,
    },
    {
      title: "District",
      key: "district",
      dataIndex: "district",
      align: "center",
      width: 120,
      render: (district) => (
        <span className="capitalize">{district || "N/A"}</span>
      ),
    },
    {
      title: "Mandal",
      key: "mandal",
      dataIndex: "mandal",
      align: "center",
      width: 120,
      render: (mandal) => <span className="capitalize">{mandal || "N/A"}</span>,
    },
    {
      title: "City/Town",
      key: "village",
      dataIndex: "village",
      align: "center",
      width: 120,
      render: (village) => (
        <span className="capitalize">{village || "N/A"}</span>
      ),
    },
    {
      title: "Area",
      key: "area",
      dataIndex: "area",
      align: "center",
      width: 120,
      render: (area) => <span className="capitalize">{area || "N/A"}</span>,
    },
    {
      title: "Street",
      key: "street",
      dataIndex: "street",
      align: "center",
      width: 120,
      render: (street) => <span className="capitalize">{street || "N/A"}</span>,
    },
    {
      title: "Pincode",
      key: "pincode",
      dataIndex: "pincode",
      align: "center",
      width: 100,
      render: (pincode) => <span>{pincode || "N/A"}</span>,
    },
    {
      title: "Date & Time",
      key: "dateAndTime",
      dataIndex: "dateAndTime",
      align: "center",
      width: 160,
      render: (date) => (
        <span>
          {date
            ? moment(date).format("DD/MM/YYYY hh:mm A")
            : "N/A"}
        </span>
      ),
    },
    {
      title: "Description",
      key: "description",
      dataIndex: "description",
      align: "center",
      width: 200,
      render: createTruncatedTextRenderer({ maxLength: 30 }),
    },
    {
      title: "Documents",
      key: "documents",
      dataIndex: "documents",
      align: "center",
      width: 120,
      render: renderDocuments,
    },
    {
      title: "Status",
      key: "status",
      align: "center",
      width: 120,
      render: (record) => {
        const response = record.responses?.[0];
        const status = response?.status || "pending";
        let color = "default";
        if (status === "approved" || status === "seen") color = "green";
        else if (status === "pending") color = "orange";
        else if (status === "rejected" || status === "declined") color = "red";

        return (
          <Tag color={color} style={{ textTransform: "capitalize" }}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      width: 150,
      fixed: "right",
      render: (record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
          <Button
            type="primary"
            size="small"
            onClick={() => handleApprove(record, "approved")}
            disabled={record.responses?.[0]?.status === "seen"}
          >
            Approve
          </Button>
          <Button
            danger
            size="small"
            onClick={() => handleReject(record, "rejected")}
            disabled={record.responses?.[0]?.status === "seen"}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  const fetchUserList = async () => {
    const payload = {
      page: currentPage,
      pageSize: pageSize,
      // isPartyMember: false,
      search: searchInput,
      sortBy: selectedFilter, /// 1 --- old or 0 -- latest
      states: selectedState ? [selectedState] : [], // convert into array
      district: selectedDistrict ? [selectedDistrict] : [], // convert the string into array
      village: selectedVillage ? [selectedVillage] : [], // convert into array
      mandal: selectedTehsil ? [selectedTehsil] : [], // convert into array
      areas: selectedArea ? [selectedArea] : [], // convert into array
      street: selectedStreet ? [selectedStreet] : [], // convert into array
      status: selectedStatus || undefined, // Add status filter
      startDate:
        dateRange && dateRange[0]
          ? dateRange[0].format("YYYY-MM-DD")
          : undefined,
      endDate:
        dateRange && dateRange[1]
          ? dateRange[1].format("YYYY-MM-DD")
          : undefined,
    };
    try {
      setLoading(true);
      const response = await postData(
        "/api/mla/list-of-notify-representative",
        payload
      );
      if (response?.responseCode == 200) {
        setData(response?.data?.notifyRepresentative || []);
        setTotal(response?.data?.totalNotifyRepresentative || 1);
      } else if (response?.responseCode == 400) {
        message.error(response?.message || "Something went wrong");
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to fetch doctors List");
    } finally {
      setLoading(false);
    }
  };

  const getnotifyFlters = async () => {
    try {
      const response = await postData(
        "/api/mla/listOfNotifyRepresentativeFilters",
        {
          states: selectedState,
          district: selectedDistrict,
          mandal: selectedTehsil,
          village: selectedVillage,
          areas: selectedArea,
        }
      );
      if (response.responseCode === 200) {
        setDistrict(response.data.districts || []);
        setTehsil(response.data.mandals || []);
        setVillage(response.data.villages || []);
        setArea(response.data.areas || []);
        setState(response.data.states || []);
        setStreet(response.data.street || []);
      } else {
        message.error(response.message || "Failed to fetch notify filters");
      }
    } catch (error) {
      message.error(error.message || "Failed to fetch notify filters");
    }
  };

  // Fetch filter options on mount and when filters change
  useEffect(() => {
    getnotifyFlters();
  }, [
    selectedState,
    selectedDistrict,
    selectedTehsil,
    selectedVillage,
    selectedArea,
  ]);

  // Clear search when any filter is applied or changed
  useEffect(() => {
    if (
      selectedState ||
      selectedDistrict ||
      selectedVillage ||
      selectedTehsil ||
      selectedArea ||
      selectedStreet ||
      selectedStatus ||
      dateRange ||
      selectedFilter !== "-1"
    ) {
      setSearchInput("");
      setSearchQuery("");
    }
  }, [
    selectedState,
    selectedDistrict,
    selectedVillage,
    selectedTehsil,
    selectedArea,
    selectedStreet,
    selectedStatus,
    dateRange,
    selectedFilter,
  ]);

  // Fetch user list when filters change
  useEffect(() => {
    fetchUserList();
  }, [
    selectedFilter,
    currentPage,
    pageSize,
    searchQuery,
    selectedState,
    selectedDistrict,
    selectedVillage,
    selectedTehsil,
    selectedArea,
    selectedStreet,
    selectedStatus,
    dateRange,
  ]);

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      selectedState ||
      selectedDistrict ||
      selectedVillage ||
      selectedTehsil ||
      selectedArea ||
      selectedStreet ||
      selectedStatus ||
      dateRange ||
      selectedFilter !== "-1"
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedVillage("");
    setSelectedTehsil("");
    setSelectedArea("");
    setSelectedStreet("");
    setSelectedStatus(null);
    setDateRange(null);
    setSelectedFilter("-1");
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  // console.log("users", data);
  // console.log("district", district);
  // console.log("tehsil", tehsil);
  // console.log("village", village);
  console.log("selectedDistrict", selectedDistrict);
  console.log("selectedTehsil", selectedTehsil);
  console.log("selectedVillage", selectedVillage);

  return (
    <Spin spinning={loading}>
      <div className="mt-2 flex flex-col gap-2">
        <div className="flex items-center justify-between client-details-form">
          <div className="flex items-center justify-start gap-2 w-full">
            <TextField
              id="outlined-basic"
              label="Search Title"
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
                      selectedState,
                      selectedDistrict,
                      selectedVillage,
                      selectedTehsil,
                      selectedArea,
                      selectedStreet,
                      selectedStatus,
                      dateRange,
                      selectedFilter !== "-1",
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
                      setSearchInput("");
                      setSearchQuery("");
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
                    {/* State Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        State
                      </label>
                      <Select
                        placeholder="Select State"
                        allowClear
                        style={{ width: "100%" }}
                        size="large"
                        value={selectedState || undefined}
                        onChange={(value) => {
                          setSelectedState(value || "");
                          setSelectedDistrict(""); // Reset district when state changes
                          setSelectedTehsil(""); // Reset tehsil when state changes
                          setSelectedVillage(""); // Reset village when state changes
                          setSelectedArea(""); // Reset area when state changes
                          setSelectedStreet(""); // Reset street when state changes
                          setSearchInput("");
                          setSearchQuery("");
                          setCurrentPage(1);
                        }}
                      >
                        {state?.map((item) => (
                          <Option key={item} value={item}>
                            {item}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    {/* District Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        District
                      </label>
                      <Select
                        placeholder="Select District"
                        allowClear
                        style={{ width: "100%" }}
                        size="large"
                        value={selectedDistrict || undefined}
                        onChange={(value) => {
                          setSelectedDistrict(value || "");
                          setSelectedTehsil(""); // Reset tehsil when district changes
                          setSelectedVillage(""); // Reset village when district changes
                          setSelectedArea(""); // Reset area when district changes
                          setSelectedStreet(""); // Reset street when district changes
                          setSearchInput("");
                          setSearchQuery("");
                          setCurrentPage(1);
                        }}
                        disabled={!selectedState}
                      >
                        {district?.map((item) => (
                          <Option key={item} value={item}>
                            {item}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    {/* Tehsil Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tehsil
                      </label>
                      <Select
                        placeholder="Select Tehsil"
                        allowClear
                        style={{ width: "100%" }}
                        size="large"
                        value={selectedTehsil || undefined}
                        onChange={(value) => {
                          setSelectedTehsil(value || "");
                          setSearchInput("");
                          setSearchQuery("");
                          setCurrentPage(1);
                        }}
                        disabled={!selectedDistrict}
                      >
                        {tehsil?.map((item) => (
                          <Option key={item} value={item}>
                            {item}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    {/* Village Filter (City/Town) */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        City/Town
                      </label>
                      <Select
                        placeholder="Select City/Town"
                        allowClear
                        style={{ width: "100%" }}
                        size="large"
                        value={selectedVillage || undefined}
                        onChange={(value) => {
                          setSelectedVillage(value || "");
                          setSelectedArea(""); // Reset area when village changes
                          setSelectedStreet(""); // Reset street when village changes
                          setSearchInput("");
                          setSearchQuery("");
                          setCurrentPage(1);
                        }}
                        disabled={!selectedDistrict}
                      >
                        {village?.map((item) => (
                          <Option key={item} value={item}>
                            {item}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    {/* Area Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Area
                      </label>
                      <Select
                        placeholder="Select Area"
                        allowClear
                        style={{ width: "100%" }}
                        size="large"
                        value={selectedArea || undefined}
                        onChange={(value) => {
                          setSelectedArea(value || "");
                          setSelectedStreet(""); // Reset street when area changes
                          setSearchInput("");
                          setSearchQuery("");
                          setCurrentPage(1);
                        }}
                        disabled={!selectedVillage}
                      >
                        {area?.map((item) => (
                          <Option key={item} value={item}>
                            {item}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    {/* Street Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Street
                      </label>
                      <Select
                        placeholder="Select Street"
                        allowClear
                        style={{ width: "100%" }}
                        size="large"
                        value={selectedStreet || undefined}
                        onChange={(value) => {
                          setSelectedStreet(value || "");
                          setSearchInput("");
                          setSearchQuery("");
                          setCurrentPage(1);
                        }}
                        disabled={!selectedArea}
                      >
                        {street?.map((item) => (
                          <Option key={item} value={item}>
                            {item}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Response Status
                      </label>
                      <Select
                        placeholder="Select Status"
                        allowClear
                        style={{ width: "100%" }}
                        size="large"
                        value={selectedStatus || undefined}
                        onChange={(value) => {
                          setSelectedStatus(value);
                          setSearchInput("");
                          setSearchQuery("");
                          setCurrentPage(1);
                        }}
                      >
                        <Option value="pending">Pending</Option>
                        <Option value="attending">Attending</Option>
                        <Option value="declined">Declined</Option>
                        <Option value="seen">Seen</Option>
                      </Select>
                    </div>

                    {/* Date Range Filter */}
                    <div>
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
                          setSearchInput("");
                          setSearchQuery("");
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
        <div className="w-full overflow-x-auto">
          <div className="min-w-full">
            <Table
              columns={columns}
              dataSource={data}
              locale={{ emptyText: "No requests available" }}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
                onChange: (page, pageSize) => {
                  setCurrentPage(page);
                  setPageSize(pageSize);
                },
                responsive: true,
              }}
              rowKey={(record) => record._id}
              scroll={{ 
                x: "max-content",
                y: "calc(80vh - 200px)"
              }}
              size="small"
              className="responsive-table"
            />
          </div>
        </div>
        <DocumentModal />
      </div>
    </Spin>
  );
};

export default NotifyRepresentative;
