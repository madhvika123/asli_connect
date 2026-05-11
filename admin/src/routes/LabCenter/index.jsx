import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, message, Modal, Spin, Switch, Table, Tag } from "antd";
import { Drawer, InputAdornment, MenuItem, TextField } from "@mui/material";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { fetchData, postData } from "../../api/apiService";
import { MdEdit, MdOutlineCancel } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { TbClipboardText } from "react-icons/tb";
import AddLabCenter from "./AddLabCenter";

const LabCenterMain = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [labCenters, setLabCenters] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [currentLabCenter, setCurrentLabCenter] = useState(null);
    const [labCenterDrawer, setLabCenterDrawer] = useState(false);
    const [expandedKeys, setExpandedKeys] = useState({});

    const toggleExpand = (key) => {
        setExpandedKeys(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const statusOptions = [
        { value: "", label: "All Status" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
    ];

    const statusColors = {
        active: "green",
        inactive: "red",
    };

    const columns = [
        {
            title: "S.No",
            align: "center",
            key: "index",
            render: (_, record, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: "Lab ID",
            dataIndex: "labId",
            align: "center",
            key: "labId",
            render: (id) => <span className="font-semibold">{id || "N/A"}</span>,
        },
        {
            title: "Lab Center Name",
            dataIndex: "name",
            align: "center",
            key: "name",
            render: (name) => (
                <span className="font-medium capitalize">{name || "N/A"}</span>
            ),
        },
        {
            title: "Contact Information",
            key: "contact",
            align: "center",
            render: (_, record) => (
                <div className="flex flex-col">
                    <span className="font-medium">{record.email || "N/A"}</span>
                    <span className="text-gray-500">{record.phone || "N/A"}</span>
                </div>
            ),
        },
        {
            title: "Address",
            key: "address",
            align: "center",
            render: (_, record) => {
                const key = `${record._id}_address`;
                const isExpanded = expandedKeys[key];

                const fullAddress = `${record.address || ""}, ${record.city || ""}, ${record.state || ""}, ${record.pincode || ""}, ${record.country || ""}`
                    .replace(/^,\s*|,\s*$/g, '')        // remove leading/trailing commas
                    .replace(/,\s*,/g, ',')             // remove double commas

                const shortAddress = fullAddress.length > 30 ? fullAddress.slice(0, 30) : fullAddress;
                const needsExpansion = fullAddress.length > 30;
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

                return (
                    <div className="flex flex-col text-sm max-w-[220px]">
                        <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-words mb-1"
                        >
                            {isExpanded
                                ? fullAddress
                                : needsExpansion
                                    ? `${shortAddress}...`
                                    : fullAddress || "N/A"}
                        </a>

                        {needsExpansion && (
                            <button
                                onClick={() => toggleExpand(key)}
                                className="text-xs text-blue-500 underline bg-transparent border-none p-0 m-0 self-start"
                            >
                                {isExpanded ? "show less" : "more"}
                            </button>
                        )}
                    </div>
                );
            },
        },


        {
            title: "Website",
            dataIndex: "website",
            align: "center",
            key: "website",
            render: (website) => {
                if (!website) return "N/A";

                // Ensure the URL starts with http or https
                const formattedUrl = website.startsWith("http://") || website.startsWith("https://")
                    ? website
                    : `https://${website}`;

                return (
                    <a
                        href={formattedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        {website.length > 30 ? `${website.substring(0, 30)}...` : website}
                    </a>
                );
            },
        },

        {
            title: "Status",
            dataIndex: "status",
            align: "center",
            key: "status",
            render: (status) => (
                <Tag color={statusColors[status]} className="capitalize font-medium">
                    {status}
                </Tag>
            ),
        },
        {
            title: "Registration Date",
            dataIndex: "registrationDate",
            align: "center",
            key: "registrationDate",
            render: (date) => (
                <span className="text-gray-500">
                    {date ? moment(date).format("DD/MM/YYYY") : "N/A"}
                </span>
            ),
        },
        // {
        //     title: "Created At",
        //     dataIndex: "createdAt",
        //     align: "center",
        //     key: "createdAt",
        //     render: (date) => (
        //         <span className="text-gray-500">
        //             {date ? moment(date).format("DD/MM/YYYY") : "N/A"}
        //         </span>
        //     ),
        // },
        {
            title: "Action",
            align: "center",
            key: "action",
            render: (_, record) => (
                <div className="flex gap-2 justify-center">
                    <Button
                        type="primary"
                        icon={<MdEdit className="text-lg" />}
                        onClick={() => {
                            setCurrentLabCenter(record);
                            setLabCenterDrawer(true);
                        }}
                        className="!bg-blue-100 !text-blue-500"
                    />
                </div>
            ),
        },
    ];

    const fetchLabCenters = async () => {
        try {
            setLoading(true);
            const response = await fetchData("/api/admin/list-of-lab-center-dropdown");

            if (response?.responseCode === 200) {
                let filteredData = response?.data || [];

                // Apply search filter
                if (searchQuery) {
                    filteredData = filteredData.filter(lab =>
                        lab.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        lab.labId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        lab.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        lab.phone?.includes(searchQuery) ||
                        lab.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        lab.address?.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                }

                // Apply status filter
                if (selectedStatus) {
                    filteredData = filteredData.filter(lab => lab.status === selectedStatus);
                }

                // Apply pagination
                const startIndex = (currentPage - 1) * pageSize;
                const endIndex = startIndex + pageSize;
                const paginatedData = filteredData.slice(startIndex, endIndex);

                setLabCenters(paginatedData);
                setTotal(filteredData.length);
            } else {
                message.error(response?.message || "Failed to fetch lab centers");
            }
        } catch (error) {
            message.error(error?.message || "Failed to fetch lab centers");
        } finally {
            setLoading(false);
        }
    };

    const deleteLabCenter = async () => {
        if (!currentLabCenter) return;

        try {
            setDeleteLoading(true);
            const payload = {
                labCenterId: currentLabCenter._id,
                isDeleted: true,
            };

            // Note: You'll need to replace this with your actual delete API endpoint
            const response = await postData("/api/admin/delete-lab-center", payload);
            if (response?.responseCode === 200) {
                message.success("Lab center deleted successfully");
                fetchLabCenters();
                setDeleteModal(false);
            } else {
                message.error(response?.message || "Failed to delete lab center");
            }
        } catch (error) {
            message.error(error?.message || "Failed to delete lab center");
        } finally {
            setDeleteLoading(false);
        }
    };

    useEffect(() => {
        fetchLabCenters();
    }, [currentPage, pageSize, selectedStatus, searchQuery]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setSearchQuery(searchInput);
            setCurrentPage(1); // Reset to first page when searching
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchInput]);

    return (
        <Spin spinning={loading}>
            <div className="mt-2 flex flex-col gap-2">
                <div className="flex items-center justify-between client-details-form flex-wrap gap-3">
                    <div className="flex items-center justify-between gap-2 w-full flex-wrap">
                        <div className="flex gap-2 flex-wrap">
                            <TextField
                                id="search-lab-centers"
                                label="Search Lab Centers"
                                variant="outlined"
                                size="small"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                type="search"
                                className="min-w-[200px]"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <SearchOutlined className="search-icon" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {/* <TextField
                                select
                                label="Status"
                                variant="outlined"
                                size="small"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="min-w-[120px]"
                            >
                                {statusOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField> */}
                        </div>

                        <Button
                            type='primary'
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setCurrentLabCenter(null);
                                setLabCenterDrawer(true);
                            }}
                            className='text-white h-[36px]'>
                            Add New Lab Center
                        </Button>
                    </div>
                </div>

                <div className="max-h-[80dvh] overflow-y-auto pr-1">
                    <Table
                        columns={columns}
                        dataSource={labCenters}
                        locale={{
                            emptyText: (
                                <div className="flex flex-col items-center justify-center py-10">
                                    <TbClipboardText className="text-4xl text-gray-400 mb-2" />
                                    <p className="text-gray-500">No lab centers available</p>
                                </div>
                            ),
                        }}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: total,
                            showSizeChanger: true,
                            onChange: (page, size) => {
                                setCurrentPage(page);
                                setPageSize(size);
                            },
                        }}
                        rowKey={(record) => record._id}
                        scroll={{ x: "max-content" }}
                    />
                </div>

                {/* Add/Edit Lab Center Drawer */}
                <Drawer
                    open={labCenterDrawer}
                    onClose={() => setLabCenterDrawer(false)}
                    anchor="right"
                    PaperProps={{ style: { width: "40%" } }}
                >
                    <AddLabCenter
                        currentLabCenter={currentLabCenter}
                        onClose={() => setLabCenterDrawer(false)}
                        onSuccess={() => {
                            fetchLabCenters();
                            setCurrentLabCenter(null);
                        }}
                    />
                </Drawer>

                {/* Delete Confirmation Modal */}
                <Modal
                    open={deleteModal}
                    onCancel={() => setDeleteModal(false)}
                    footer={null}
                    centered
                >
                    <Spin spinning={deleteLoading}>
                        <div className="p-4">
                            <h4 className="text-xl font-semibold text-center py-2">
                                Delete Lab Center
                            </h4>
                            <p className="text-center mb-4">
                                Are you sure you want to delete this lab center?
                            </p>
                            {currentLabCenter && (
                                <div className="border rounded-lg p-3 mb-4">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium">Lab ID:</span>
                                        <span>{currentLabCenter.labId}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium">Name:</span>
                                        <span className="capitalize">
                                            {currentLabCenter.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Status:</span>
                                        <Tag color={statusColors[currentLabCenter.status]} className="capitalize">
                                            {currentLabCenter.status}
                                        </Tag>
                                    </div>
                                </div>
                            )}
                            <footer className="flex justify-center items-center pt-2 space-x-4">
                                <Button
                                    type="default"
                                    onClick={() => setDeleteModal(false)}
                                    className="min-w-[100px]"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    danger
                                    className="min-w-[100px]"
                                    onClick={deleteLabCenter}
                                >
                                    Delete
                                </Button>
                            </footer>
                        </div>
                    </Spin>
                </Modal>
            </div>
        </Spin>
    );
};

export default LabCenterMain;