import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Button,
  message,
  Modal,
  Spin,
  Switch,
  Table,
  Drawer,
  Space,
  Divider,
  Select,
  DatePicker,
  Checkbox,
  Radio,
} from "antd";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import {
  PlusOutlined,
  SearchOutlined,
  DownloadOutlined,
  FilterOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { postData } from "../../api/apiService";
import { MdEdit } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { PiGitBranchFill } from "react-icons/pi";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";
import { useDocumentButton } from "../../utils/DocumentViewer";
import { createTruncatedTextRenderer } from "../../utils/TruncatedTextWithTooltip";

const { RangePicker } = DatePicker;
const { Option } = Select;

const PartyMember = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [reVerificationModal, setReVerificationModal] = useState(false);
  const [selectedPartyMember, setSelectedPartyMember] = useState(null);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [isVolunteer, setIsVolunteer] = useState(null);
  const [downloadModalVisible, setDownloadModalVisible] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [downloadFormat, setDownloadFormat] = useState("excel");
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

  // Real-time search debounce
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
      selectedStatus ||
      selectedGender ||
      dateRange ||
      isVolunteer !== null ||
      selectedParlimentaryConstituency ||
      selectedAssemblyConstituency ||
      selectedFilter !== "-1"
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedStatus(null);
    setSelectedGender(null);
    setDateRange(null);
    setIsVolunteer(null);
    setSelectedParlimentaryConstituency(null);
    setSelectedAssemblyConstituency(null);
    setSelectedFilter("-1");
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const getDocumentNumber = (docs, type) => {
    if (!docs || !Array.isArray(docs)) return "N/A";
    const doc = docs.find((d) => d.documentType === type);
    return doc ? doc.documentNumber : "N/A";
  };

  const getDocumentUrl = (docs, type) => {
    if (!docs || !Array.isArray(docs)) return null;
    const doc = docs.find((d) => d.documentType === type);
    return doc?.url || doc?.documentUrl || null;
  };

  // Document button helper hook for Aadhar
  const {
    renderDocuments: renderAadharDocuments,
    DocumentModal: AadharDocumentModal,
  } = useDocumentButton({
    buttonText: "View",
    emptyText: "No document",
    modalTitle: "Aadhar Document",
  });

  // Document button helper hook for Voter ID
  const {
    renderDocuments: renderVoterDocuments,
    DocumentModal: VoterDocumentModal,
  } = useDocumentButton({
    buttonText: "View",
    emptyText: "No document",
    modalTitle: "Voter ID Document",
  });

  // Available columns for download
  const availableColumns = [
    { key: "sno", title: "S.No", dataKey: "index" },
    { key: "name", title: "User Name", dataKey: "name" },
    { key: "phone", title: "Phone", dataKey: "phone" },
    { key: "email", title: "Email", dataKey: "email" },
    { key: "dateOfBirth", title: "Date of Birth", dataKey: "dateOfBirth" },
    { key: "gender", title: "Gender", dataKey: "gender" },
    { key: "flatNumber", title: "Flat / House No", dataKey: "flatNumber" },
    { key: "area", title: "Area", dataKey: "area" },
    { key: "street", title: "Street", dataKey: "street" },
    { key: "city", title: "City / Town", dataKey: "city" },
    { key: "district", title: "District", dataKey: "district" },
    { key: "state", title: "State", dataKey: "state" },
    { key: "pincode", title: "Pincode", dataKey: "pincode" },
    { key: "teshil", title: "Tehsil", dataKey: "teshil" },
    { key: "aadhaar", title: "Aadhar Number", dataKey: "aadhaar" },
    { key: "voterId", title: "Voter ID", dataKey: "voterId" },
    {
      key: "parliamentryConstituency",
      title: "Parliamentary Constituency",
      dataKey: "parliamentryConstituency",
    },
    {
      key: "assemblyConstituency",
      title: "Assembly Constituency",
      dataKey: "assemblyConstituency",
    },
    { key: "parentName", title: "Parent Name", dataKey: "parentName" },
    { key: "memberShipId", title: "Membership ID", dataKey: "memberShipId" },
    { key: "status", title: "Status", dataKey: "isActive" },
    { key: "createdAt", title: "Created At", dataKey: "createdAt" },
  ];

  // Initialize selected columns when modal opens
  useEffect(() => {
    if (downloadModalVisible) {
      setSelectedColumns(availableColumns.map((col) => col.key));
    }
  }, [downloadModalVisible, availableColumns]);

  const columns = [
    {
      title: "S.No",
      align: "center",
      key: "index",
      rowScope: "row",
      render: (_, record, index) => index + 1,
    },
    {
      title: "User Name",
      dataIndex: ["user", "name"],
      align: "center",
      key: "name",
      render: (name) => {
        const displayName = name ? name.slice(0, 16) : "User";
        return (
          <span className="capitalize" title={name || "User"}>
            {displayName}
            {name && name.length > 16 ? "..." : ""}
          </span>
        );
      },
    },
    {
      title: "Phone",
      dataIndex: ["user", "phone"],
      align: "center",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      align: "center",
      key: "email",
    },
    {
      title: "Date of Birth",
      dataIndex: ["user", "dateOfBirth"],
      align: "center",
      key: "dateOfBirth",
      render: (date) => date || "N/A",
    },
    {
      title: "Gender",
      dataIndex: ["user", "gender"],
      key: "gender",
      align: "center",
      render: (gender) => gender || "N/A",
    },
    // -------------------------
    // ADDRESS RELATED FIELDS
    // -------------------------
    {
      title: "Flat / House No",
      dataIndex: ["user", "flatNumber"],
      key: "flatNumber",
      align: "center",
      render: createTruncatedTextRenderer({ maxLength: 20 }),
    },
    {
      title: "Area",
      dataIndex: ["user", "area"],
      key: "area",
      align: "center",
      render: createTruncatedTextRenderer({ maxLength: 20 }),
    },
    {
      title: "Street",
      dataIndex: ["user", "street"],
      key: "street",
      align: "center",
      render: (_, record) => {
        const text = record?.user?.street || record?.user?.address || "N/A";
        return createTruncatedTextRenderer({ maxLength: 25 })(text);
      },
    },
    {
      title: "City / Town",
      dataIndex: ["user", "city"],
      key: "city",
      align: "center",
      render: createTruncatedTextRenderer({ maxLength: 20 }),
    },
    {
      title: "District",
      dataIndex: ["user", "district"],
      key: "district",
      align: "center",
      render: createTruncatedTextRenderer({ maxLength: 20 }),
    },
    {
      title: "State",
      dataIndex: ["user", "state"],
      key: "state",
      align: "center",
      render: createTruncatedTextRenderer({ maxLength: 20 }),
    },
    {
      title: "Pincode",
      dataIndex: ["user", "pincode"],
      key: "pincode",
      align: "center",
      render: (val) => val || "N/A",
    },
    {
      title: "Tehsil",
      dataIndex: ["user", "teshil"],
      key: "teshil",
      align: "center",
      render: createTruncatedTextRenderer({ maxLength: 20 }),
    },
    // -------------------------
    // DOCUMENTS
    // -------------------------
    {
      title: "Aadhar Number",
      key: "aadhaar",
      align: "center",
      render: (_, record) => {
        const docNumber = getDocumentNumber(record?.user?.document, "aadhaar");
        const docUrl = getDocumentUrl(record?.user?.document, "aadhaar");

        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span>{docNumber}</span>
            {docUrl && (
              <div onClick={(e) => e.stopPropagation()}>
                {renderAadharDocuments([docUrl])}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Voter ID",
      key: "voterId",
      align: "center",
      render: (_, record) => {
        const docNumber = getDocumentNumber(record?.user?.document, "voterId");
        const docUrl = getDocumentUrl(record?.user?.document, "voterId");

        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span>{docNumber}</span>
            {docUrl && (
              <div onClick={(e) => e.stopPropagation()}>
                {renderVoterDocuments([docUrl])}
              </div>
            )}
          </div>
        );
      },
    },
    // -------------------------
    // Constituencies
    // -------------------------
    {
      title: "Parliamentary Constituency",
      dataIndex: ["user", "parliamentryConstituency"],
      key: "parliamentryConstituency",
      align: "center",
      render: (pc) => (pc?.name ? pc.name : "N/A"),
    },
    {
      title: "Assembly Constituency",
      dataIndex: ["user", "assemblyConstituency"],
      key: "assemblyConstituency",
      align: "center",
      render: (ac) => (ac?.name ? ac.name : "N/A"),
    },
    {
      title: "Parent Name",
      dataIndex: "parentName",
      key: "parentName",
      align: "center",
      render: (parentName) => <span>{parentName || "N/A"}</span>,
    },
    {
      title: "Membership ID",
      dataIndex: "memberShipId",
      key: "memberShipId",
      align: "center",
      render: (memberShipId) => <span>{memberShipId || "N/A"}</span>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt) =>
        createdAt ? new Date(createdAt).toISOString().slice(0, 10) : "N/A",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      align: "center",
      key: "isActive",
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={() => handleOpenReVerificationModal(record, isActive)}
        />
      ),
    },
  ];

  const handleOpenReVerificationModal = (record, currentStatus) => {
    setSelectedPartyMember({ ...record, currentStatus });
    setReVerificationModal(true);
  };

  const handleConfirmToggle = async () => {
    if (!selectedPartyMember) return;

    try {
      const newStatus = selectedPartyMember.currentStatus
        ? "reject"
        : "approve"; // backend expects 'approve'/'reject'

      const payload = {
        partyMemberId: selectedPartyMember._id,
        status: newStatus,
      };

      const response = await postData(
        "/api/admin/toggle-party-member",
        payload
      );
      if (response?.responseCode === 200) {
        message.success(response.message || "Status updated successfully");
        setReVerificationModal(false);
        setSelectedPartyMember(null);
        fetchUserList();
      } else {
        message.error(response?.message || "Failed to update member status");
      }
    } catch (error) {
      console.error(error);
      message.error(
        error.response?.data?.message || "Failed to update member status"
      );
    }
  };

  const fetchUserList = async () => {
    const payload = {
      page: currentPage,
      pageSize: pageSize,
    };

    // Add search filter only if searchQuery has value
    if (searchQuery) {
      payload.search = searchQuery;
    }

    // Add status filter only if selected
    if (selectedStatus) {
      payload.status = selectedStatus;
    }

    // Add gender filter only if selected
    if (selectedGender) {
      payload.gender = selectedGender;
    }

    // Add date range filters only if dateRange is set
    if (dateRange && dateRange[0]) {
      payload.startDate = dateRange[0].format("YYYY-MM-DD");
    }
    if (dateRange && dateRange[1]) {
      payload.endDate = dateRange[1].format("YYYY-MM-DD");
    }

    // Add sortBy filter
    if (selectedFilter) {
      payload.sortBy = selectedFilter;
    }

    // Add isVolunteer filter only if selected
    if (isVolunteer !== null) {
      payload.isVolunteer = isVolunteer;
    }

    // Add constituency filters
    if (selectedParlimentaryConstituency?._id) {
      payload.parliamentryConstituencyId = selectedParlimentaryConstituency._id;
    }
    if (selectedAssemblyConstituency?._id) {
      payload.assemblyConstituencyId = selectedAssemblyConstituency._id;
    }

    try {
      setLoading(true);
      const response = await postData(
        "/api/admin/list-of-party-members",
        payload
      );
      if (response?.responseCode === 200) {
        setUsers(response?.data?.Partymembers || []);
        setTotal(response?.data?.total || 1);
      } else {
        setUsers([]);
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      setUsers([]);
      message.error(error?.message || "Failed to fetch members");
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
    isVolunteer,
    selectedParlimentaryConstituency,
    selectedAssemblyConstituency,
  ]);

  // Helper function to get column value
  const getColumnValue = (item, columnKey, index) => {
    switch (columnKey) {
      case "sno":
        return index + 1;
      case "name":
        return item?.user?.name || "N/A";
      case "phone":
        return item?.user?.phone || "N/A";
      case "email":
        return item?.user?.email || "N/A";
      case "dateOfBirth":
        return item?.user?.dateOfBirth || "N/A";
      case "gender":
        return item?.user?.gender || "N/A";
      case "flatNumber":
        return item?.user?.flatNumber || "N/A";
      case "area":
        return item?.user?.area || "N/A";
      case "street":
        return item?.user?.street || item?.user?.address || "N/A";
      case "city":
        return item?.user?.city || "N/A";
      case "district":
        return item?.user?.district || "N/A";
      case "state":
        return item?.user?.state || "N/A";
      case "pincode":
        return item?.user?.pincode || "N/A";
      case "teshil":
        return item?.user?.teshil || "N/A";
      case "aadhaar":
        return getDocumentNumber(item?.user?.document, "aadhaar");
      case "voterId":
        return getDocumentNumber(item?.user?.document, "voterId");
      case "parliamentryConstituency":
        return item?.user?.parliamentryConstituency?.name || "N/A";
      case "assemblyConstituency":
        return item?.user?.assemblyConstituency?.name || "N/A";
      case "parentName":
        return item?.parentName || "N/A";
      case "memberShipId":
        return item?.memberShipId || "N/A";
      case "status":
        return item?.isActive ? "Active" : "Inactive";
      case "createdAt":
        return item?.createdAt
          ? new Date(item.createdAt).toISOString().slice(0, 10)
          : "N/A";
      default:
        return "N/A";
    }
  };

  // Download Excel
  const handleDownloadExcel = async (data) => {
    const selectedCols = availableColumns.filter((col) =>
      selectedColumns.includes(col.key)
    );

    if (selectedCols.length === 0) {
      message.warning("Please select at least one column to download.");
      return;
    }

    // Prepare data with selected columns
    const excelData = data.map((item, index) => {
      const row = {};
      selectedCols.forEach((col) => {
        row[col.title] = getColumnValue(item, col.key, index);
      });
      return row;
    });

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Party Members");

    // Generate Excel file
    XLSX.writeFile(
      wb,
      `party_members_${moment().format("YYYY-MM-DD_HH-mm-ss")}.xlsx`
    );

    message.success("Excel file downloaded successfully!");
  };

  // Download PDF
  const handleDownloadPDF = async (data) => {
    const selectedCols = availableColumns.filter((col) =>
      selectedColumns.includes(col.key)
    );

    if (selectedCols.length === 0) {
      message.warning("Please select at least one column to download.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Party Members List", 14, 15);

    // Prepare table data
    const tableData = data.map((item, index) => {
      return selectedCols.map((col) => getColumnValue(item, col.key, index));
    });

    const headers = selectedCols.map((col) => col.title);

    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
    });

    doc.save(`party_members_${moment().format("YYYY-MM-DD_HH-mm-ss")}.pdf`);
    message.success("PDF downloaded successfully!");
  };

  // Main download handler
  const handleDownload = async () => {
    if (selectedColumns.length === 0) {
      message.warning("Please select at least one column to download.");
      return;
    }

    try {
      setLoading(true);
      setDownloadModalVisible(false);

      const payload = {
        page: 1,
        pageSize: total,
      };

      // Add all filters to download payload
      if (searchQuery) {
        payload.search = searchQuery;
      }
      if (selectedStatus) {
        payload.status = selectedStatus;
      }
      if (selectedGender) {
        payload.gender = selectedGender;
      }
      if (dateRange && dateRange[0]) {
        payload.startDate = dateRange[0].format("YYYY-MM-DD");
      }
      if (dateRange && dateRange[1]) {
        payload.endDate = dateRange[1].format("YYYY-MM-DD");
      }
      if (selectedFilter) {
        payload.sortBy = selectedFilter;
      }
      if (isVolunteer !== null) {
        payload.isVolunteer = isVolunteer;
      }
      if (selectedParlimentaryConstituency?._id) {
        payload.parliamentryConstituencyId =
          selectedParlimentaryConstituency._id;
      }
      if (selectedAssemblyConstituency?._id) {
        payload.assemblyConstituencyId = selectedAssemblyConstituency._id;
      }

      const response = await postData(
        "/api/admin/list-of-party-members",
        payload
      );

      if (response?.responseCode === 200) {
        const data = response?.data?.Partymembers || [];

        if (data.length === 0) {
          message.warning("No party member data available to download.");
          return;
        }

        if (downloadFormat === "excel") {
          await handleDownloadExcel(data);
        } else {
          await handleDownloadPDF(data);
        }
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to download party members");
    } finally {
      setLoading(false);
    }
  };

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
                      selectedParlimentaryConstituency,
                      selectedAssemblyConstituency,
                      selectedStatus,
                      selectedGender,
                      dateRange,
                      isVolunteer !== null,
                      selectedFilter !== "-1",
                    ].filter(Boolean).length
                  }
                </span>
              )}
            </div>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => setDownloadModalVisible(true)}
              className="h-[36px] w-[36px] p-0"
              title="Download"
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
                    {/* Parliamentary Constituency */}
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

                    {/* Assembly Constituency */}
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
                        <Option value="all">All</Option>
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
                        <Option value="others">Others</Option>
                      </Select>
                    </div>

                    {/* Is Volunteer Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Is Volunteer
                      </label>
                      <Select
                        placeholder="Select Option"
                        allowClear
                        style={{ width: "100%" }}
                        size="large"
                        value={isVolunteer}
                        onChange={(value) => {
                          setIsVolunteer(value);
                          setCurrentPage(1);
                        }}
                      >
                        <Option value={true}>Yes</Option>
                        <Option value={false}>No</Option>
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
                  {searchQuery || hasActiveFilters()
                    ? "No Members Found"
                    : "No Members available"}
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
      </div>

      {/* Download Modal */}
      <Modal
        title="Download Options"
        open={downloadModalVisible}
        onOk={handleDownload}
        onCancel={() => setDownloadModalVisible(false)}
        okText="Download"
        cancelText="Cancel"
        width={500}
      >
        <Space direction="vertical" size="large" className="w-full">
          {/* Format Selection */}
          <div>
            <h4 className="text-base font-semibold mb-3">Select Format</h4>
            <Radio.Group
              value={downloadFormat}
              onChange={(e) => setDownloadFormat(e.target.value)}
            >
              <Radio value="excel">Excel (.xlsx)</Radio>
              <Radio value="pdf">PDF (.pdf)</Radio>
            </Radio.Group>
          </div>

          <Divider />

          {/* Column Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-semibold">Select Columns</h4>
              <Space>
                <Button
                  type="link"
                  size="small"
                  onClick={() =>
                    setSelectedColumns(availableColumns.map((col) => col.key))
                  }
                >
                  Select All
                </Button>
                <Button
                  type="link"
                  size="small"
                  onClick={() => setSelectedColumns([])}
                >
                  Clear All
                </Button>
              </Space>
            </div>
            <Checkbox.Group
              value={selectedColumns}
              onChange={setSelectedColumns}
              className="w-full"
            >
              <Space direction="vertical" className="w-full">
                {availableColumns.map((col) => (
                  <Checkbox key={col.key} value={col.key}>
                    {col.title}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </div>
        </Space>
      </Modal>

      {/* Document Modals */}
      <AadharDocumentModal />
      <VoterDocumentModal />

      {/* Re-verification Modal */}
      <Modal
        title="Re-verification Required"
        open={reVerificationModal}
        onCancel={() => {
          setReVerificationModal(false);
          setSelectedPartyMember(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setReVerificationModal(false);
              setSelectedPartyMember(null);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={handleConfirmToggle}
            style={{
              backgroundColor: "#3D8926",
              borderColor: "#3D8926",
            }}
          >
            Confirm
          </Button>,
        ]}
        centered
        width={500}
      >
        {selectedPartyMember && (
          <div>
            <p className="mb-4">
              Are you sure you want to{" "}
              <strong>
                {selectedPartyMember.currentStatus ? "deactivate" : "activate"}
              </strong>{" "}
              this party member?
            </p>
            <div className="border rounded-lg p-3 bg-gray-50">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Name:</span>
                <span className="capitalize">
                  {selectedPartyMember?.user?.name || "N/A"}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Phone:</span>
                <span>{selectedPartyMember?.user?.phone || "N/A"}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Membership ID:</span>
                <span>{selectedPartyMember?.memberShipId || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Current Status:</span>
                <span
                  className={`capitalize ${
                    selectedPartyMember.currentStatus
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedPartyMember.currentStatus ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Spin>
  );
};

export default PartyMember;
