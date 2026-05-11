import React, { useEffect, useState, useMemo } from "react";
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
  InputNumber,
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

// Specific way of help ID that requires amount filters
const AMOUNT_FILTER_WAY_OF_HELP_ID = "68e7674d06ef0904e3daaea7";

const WallOfHelp = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState(null);
  const [donation, setDonations] = useState([]);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [selectedTypeOfHelp, setSelectedTypeOfHelp] = useState(null);
  const [selectedWayOfHelp, setSelectedWayOfHelp] = useState(null);
  const [typeOfHelpOptions, setTypeOfHelpOptions] = useState([]);
  const [preferredWayOfHelpOptions, setPreferredWayOfHelpOptions] = useState(
    []
  );
  // Amount filter states
  const [minAmount, setMinAmount] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [exactAmount, setExactAmount] = useState(null);
  const [amountFilterType, setAmountFilterType] = useState("range"); // "range" or "exact"
  // Urgency filter states
  const [selectedUrgency, setSelectedUrgency] = useState([]);

  // Document button helper hook
  const { renderDocuments, DocumentModal } = useDocumentButton({
    buttonText: "View Docs",
    emptyText: "No documents",
    modalTitle: "View Documents",
  });

  // Fetch dropdown options on component mount
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        // Fetch Type of Help options
        const typeOfHelpResponse = await fetchData(
          "/api/user/type-of-help-dropdown"
        );
        if (typeOfHelpResponse?.responseCode === 200) {
          setTypeOfHelpOptions(typeOfHelpResponse?.data || []);
        }

        // Fetch Preferred Way of Help options
        const wayOfHelpResponse = await fetchData(
          "/api/user/preferred-way-for-help-dropdown"
        );
        if (wayOfHelpResponse?.responseCode === 200) {
          setPreferredWayOfHelpOptions(wayOfHelpResponse?.data || []);
        }
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
      }
    };

    fetchDropdownOptions();
  }, []);

  // Check if any filters are active
  const hasActiveFilters = () => {
    const isAmountFilterActive =
      selectedWayOfHelp === AMOUNT_FILTER_WAY_OF_HELP_ID &&
      (exactAmount !== null || minAmount !== null || maxAmount !== null);

    return (
      selectedTypeOfHelp ||
      selectedWayOfHelp ||
      status ||
      selectedFilter !== "-1" ||
      isAmountFilterActive ||
      selectedUrgency.length > 0
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedTypeOfHelp(null);
    setSelectedWayOfHelp(null);
    setStatus(null);
    setSelectedFilter("-1");
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
    // Clear amount filters
    setExactAmount(null);
    setMinAmount(null);
    setMaxAmount(null);
    setAmountFilterType("range");
    // Clear urgency filters
    setSelectedUrgency([]);
  };

  // Clear search when filters change
  useEffect(() => {
    if (
      selectedTypeOfHelp ||
      selectedWayOfHelp ||
      status ||
      exactAmount !== null ||
      minAmount !== null ||
      maxAmount !== null ||
      selectedUrgency.length > 0
    ) {
      setSearchInput("");
      setSearchQuery("");
    }
  }, [
    selectedTypeOfHelp,
    selectedWayOfHelp,
    status,
    exactAmount,
    minAmount,
    maxAmount,
    selectedUrgency,
  ]);

  // Real-time search debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  const handleDonationStatus = async (record, status) => {
    try {
      const paylaod = {
        financialRequestId: record._id,
        status,
      };

      const response = await postData(
        "/api/mla/approve-or-reject-financial-help-request",
        paylaod
      );

      if (response.responseCode !== 200) {
        message.error(response.message || "failed to update");
      }

      message.success(`Donation request ${status} successfully`);
      fetchUserList();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to update status"
      );
    }
  };

  const donationColumns = [
    {
      title: "S.No",
      align: "center",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (name) => <span className="capitalize">{name || "N/A"}</span>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      align: "center",
      render: (phone) => <span>{phone || "N/A"}</span>,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      align: "center",
      render: (address, record) => {
        // Prefer address, but fall back to fields if necessary
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
          text = parts || "N/A";
        }
        return createTruncatedTextRenderer({ maxLength: 30 })(text);
      },
    },
    {
      title: "Type of Help",
      dataIndex: ["typeOfHelp", "name"],
      key: "typeOfHelp",
      align: "center",
      render: (name) => <span>{name || "N/A"}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      align: "center",
      render: createTruncatedTextRenderer({ maxLength: 30 }),
    },
    {
      title: "Urgency",
      dataIndex: "urgency",
      key: "urgency",
      align: "center",
      render: (urgency) => (
        <Tag color="red" style={{ textTransform: "capitalize" }}>
          {urgency || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Way of Help",
      dataIndex: ["preferredWayForHelp", "name"],
      key: "preferredWayForHelp",
      align: "center",
      render: (name) => <span>{name || "N/A"}</span>,
    },
    {
      title: "Documents",
      dataIndex: "documents",
      key: "documents",
      align: "center",
      render: renderDocuments,
    },

    {
      title: "UPI",
      dataIndex: "UPI",
      key: "UPI",
      align: "center",
      render: (UPI) => <span>{UPI || "N/A"}</span>,
    },
    {
      title: "Amount Requested",
      dataIndex: "amountRequested",
      key: "amountRequested",
      align: "center",
      render: (amount) => <span>{amount ? `₹ ${amount}` : "₹ 0"}</span>,
    },
    {
      title: "Amount Collected",
      dataIndex: "amountCollected",
      key: "amountCollected",
      align: "center",
      render: (amount) => <span>{`₹ ${amount || 0}`}</span>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt) =>
        createdAt ? moment(createdAt).format("DD/MM/YYYY") : "N/A",
    },
    //updated at
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
      render: (updatedAt) =>
        updatedAt ? moment(updatedAt).format("DD/MM/YYYY") : "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        let color = "default";
        if (status === "approved") color = "green";
        else if (status === "pending") color = "orange";
        else if (status === "rejected") color = "red";

        return (
          <Tag color={color} style={{ textTransform: "capitalize" }}>
            {status || "N/A"}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <Button
            type="primary"
            size="small"
            onClick={() => handleDonationStatus(record, "approved")}
          >
            Approve
          </Button>
          <Button
            danger
            size="small"
            onClick={() => handleDonationStatus(record, "rejected")}
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
      search: searchQuery || undefined,
      sort: selectedFilter,
    };

    // Add filters only if selected
    if (status) {
      payload.status = status === "all" ? undefined : status;
    }
    // Pass IDs for filtering
    if (selectedTypeOfHelp) {
      payload.typeOfHelp = selectedTypeOfHelp;
    }
    if (selectedWayOfHelp) {
      payload.preferredWayForHelp = selectedWayOfHelp;
    }

    // Add amount filter - only for specific way of help
    if (selectedWayOfHelp === AMOUNT_FILTER_WAY_OF_HELP_ID) {
      if (amountFilterType === "exact" && exactAmount !== null) {
        payload.amountRequested = exactAmount;
      } else if (amountFilterType === "range") {
        if (minAmount !== null || maxAmount !== null) {
          payload.amountRequested = [
            minAmount !== null ? minAmount : 0,
            maxAmount !== null ? maxAmount : Number.MAX_SAFE_INTEGER,
          ];
        }
      }
    }

    // Add urgency filter
    if (selectedUrgency.length > 0) {
      payload.urgency =
        selectedUrgency.length === 1 ? selectedUrgency[0] : selectedUrgency;
    }

    try {
      setLoading(true);
      const response = await postData(
        "/api/mla/list-of-financial-help-requests",
        payload
      );
      if (response?.responseCode == 200) {
        setDonations(response?.data?.financialRequest || []);
        setTotal(response?.data?.totalFinancialHelpRequest || 1);
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

  useEffect(() => {
    fetchUserList();
  }, [
    selectedFilter,
    currentPage,
    pageSize,
    searchQuery,
    status,
    selectedTypeOfHelp,
    selectedWayOfHelp,
    exactAmount,
    minAmount,
    maxAmount,
    amountFilterType,
    selectedUrgency,
  ]);

  console.log("users", donation);

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
                      selectedTypeOfHelp,
                      selectedWayOfHelp,
                      status,
                      selectedFilter !== "-1",
                      selectedWayOfHelp === AMOUNT_FILTER_WAY_OF_HELP_ID &&
                        (exactAmount !== null ||
                          minAmount !== null ||
                          maxAmount !== null),
                      selectedUrgency.length > 0,
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
                        value={status}
                        onChange={(value) => {
                          setStatus(value);
                          setCurrentPage(1);
                        }}
                      >
                        <Option value="pending">Pending</Option>
                        <Option value="approved">Approved</Option>
                        <Option value="rejected">Rejected</Option>
                      </Select>
                    </div>

                    {/* Type of Help Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Type of Help
                      </label>
                      <Select
                        placeholder="Select Type of Help"
                        allowClear
                        style={{ width: "100%" }}
                        size="large"
                        value={selectedTypeOfHelp}
                        onChange={(value) => {
                          setSelectedTypeOfHelp(value);
                          setCurrentPage(1);
                        }}
                        loading={typeOfHelpOptions.length === 0}
                      >
                        {typeOfHelpOptions.map((option) => (
                          <Option key={option._id} value={option._id}>
                            {option.name}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    {/* Way of Help Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Way of Help
                      </label>
                      <Select
                        placeholder="Select Way of Help"
                        allowClear
                        style={{ width: "100%" }}
                        size="large"
                        value={selectedWayOfHelp}
                        onChange={(value) => {
                          setSelectedWayOfHelp(value);
                          // Clear amount filters if a different way of help is selected
                          if (value !== AMOUNT_FILTER_WAY_OF_HELP_ID) {
                            setExactAmount(null);
                            setMinAmount(null);
                            setMaxAmount(null);
                            setAmountFilterType("range");
                          }
                          setCurrentPage(1);
                        }}
                        loading={preferredWayOfHelpOptions.length === 0}
                      >
                        {preferredWayOfHelpOptions.map((option) => (
                          <Option key={option._id} value={option._id}>
                            {option.name}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    {/* Amount Filter Type - Only show for specific way of help */}
                    {selectedWayOfHelp === AMOUNT_FILTER_WAY_OF_HELP_ID && (
                      <>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium mb-2">
                            Amount Filter Type
                          </label>
                          <Select
                            style={{ width: "100%" }}
                            size="large"
                            value={amountFilterType}
                            onChange={(value) => {
                              setAmountFilterType(value);
                              if (value === "exact") {
                                setMinAmount(null);
                                setMaxAmount(null);
                              } else {
                                setExactAmount(null);
                              }
                              setCurrentPage(1);
                            }}
                          >
                            <Option value="range">Amount Range</Option>
                            <Option value="exact">Exact Amount</Option>
                          </Select>
                        </div>

                        {/* Amount Filter - Range or Exact */}
                        {amountFilterType === "range" ? (
                          <div className="col-span-2">
                            <label className="block text-sm font-medium mb-2">
                              Amount Range (₹)
                            </label>
                            <div className="flex items-center gap-2">
                              <InputNumber
                                placeholder="Min Amount"
                                min={0}
                                style={{ width: "100%" }}
                                size="large"
                                value={minAmount}
                                onChange={(value) => {
                                  setMinAmount(value);
                                  setCurrentPage(1);
                                }}
                                formatter={(value) =>
                                  value ? `₹ ${value}` : ""
                                }
                                parser={(value) =>
                                  value.replace(/₹\s?|(,*)/g, "")
                                }
                              />
                              <span className="text-gray-500">to</span>
                              <InputNumber
                                placeholder="Max Amount"
                                min={0}
                                style={{ width: "100%" }}
                                size="large"
                                value={maxAmount}
                                onChange={(value) => {
                                  setMaxAmount(value);
                                  setCurrentPage(1);
                                }}
                                formatter={(value) =>
                                  value ? `₹ ${value}` : ""
                                }
                                parser={(value) =>
                                  value.replace(/₹\s?|(,*)/g, "")
                                }
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="col-span-2">
                            <label className="block text-sm font-medium mb-2">
                              Exact Amount (₹)
                            </label>
                            <InputNumber
                              placeholder="Enter exact amount"
                              min={0}
                              style={{ width: "100%" }}
                              size="large"
                              value={exactAmount}
                              onChange={(value) => {
                                setExactAmount(value);
                                setCurrentPage(1);
                              }}
                              formatter={(value) => (value ? `₹ ${value}` : "")}
                              parser={(value) =>
                                value.replace(/₹\s?|(,*)/g, "")
                              }
                            />
                          </div>
                        )}
                      </>
                    )}

                    {/* Urgency Filter */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Urgency
                      </label>
                      <Select
                        mode="multiple"
                        placeholder="Select Urgency (can select multiple)"
                        allowClear
                        style={{ width: "100%" }}
                        size="large"
                        value={selectedUrgency}
                        onChange={(value) => {
                          setSelectedUrgency(value || []);
                          setCurrentPage(1);
                        }}
                      >
                        <Option value="Not Urgent (whenever possible)">
                          Not Urgent (whenever possible)
                        </Option>
                        <Option value="Soon (within a week)">
                          Soon (within a week)
                        </Option>
                        <Option value="Immediate (within 24 hours)">
                          Immediate (within 24 hours)
                        </Option>
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

        <div className="max-h-[80dvh] overflow-y-auto pr-1">
          <Table
            columns={donationColumns}
            dataSource={donation}
            locale={{
              emptyText: (
                <div style={{ color: "black" }}>
                  {searchQuery || hasActiveFilters()
                    ? "No Donations Found"
                    : "No Donations available"}
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

        {/* Document Viewer Modal */}
        <DocumentModal />
      </div>
    </Spin>
  );
};

export default WallOfHelp;
