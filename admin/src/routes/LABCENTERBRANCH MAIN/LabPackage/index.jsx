import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, message, Modal, Spin, Table, Tag } from "antd";
import { Drawer, InputAdornment, MenuItem, TextField } from "@mui/material";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { fetchData, postData } from "../../../api/apiService";
import { MdEdit, MdOutlineCancel } from "react-icons/md";
import { TbClipboardText } from "react-icons/tb";
import AddLabPackage from "./AddLabPackage";

const LabPackageBranch = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [labPackages, setLabPackages] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [sortOrder, setSortOrder] = useState(-1); // -1 for newest, 1 for oldest, 2 for price
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [currentLabPackage, setCurrentLabPackage] = useState(null);
    const [packageDrawer, setPackageDrawer] = useState(false);
    const [expandedKeys, setExpandedKeys] = useState({});

    const toggleExpand = (key) => {
        setExpandedKeys((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const statusOptions = [
        { value: "", label: "All Status" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
    ];

    const sortOptions = [
        { value: -1, label: "Newest First" },
        { value: 1, label: "Oldest First" },
        { value: 2, label: "Price: Low to High" },
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
            width: 80,
            render: (_, record, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: "Package ID",
            dataIndex: "packageId",
            align: "center",
            key: "packageId",
            width: 140,
            render: (id) => <span className="font-semibold text-blue-600">{id || "N/A"}</span>,
        },
        {
            title: "Package Name",
            dataIndex: "name",
            align: "left",
            key: "name",
            width: 200,
            render: (name) => (
                <span className="font-medium capitalize">{name || "N/A"}</span>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 200,
            render: (description, record) => {
                const isExpanded = expandedKeys[record.key];
                const shortText = description?.slice(0, 40) || "N/A";

                return (
                    <span className="text-sm text-gray-600">
                        {description
                            ? isExpanded
                                ? description
                                : `${shortText}${description.length > 40 ? "..." : ""}`
                            : "N/A"}
                        {description?.length > 40 && (
                            <button
                                onClick={() => toggleExpand(record.key)}
                                className="ml-2 text-blue-500 underline bg-transparent border-none cursor-pointer"
                            >
                                {isExpanded ? "less" : "more"}
                            </button>
                        )}
                    </span>
                );
            },
        },
        {
            title: "Tests Included",
            dataIndex: "tests",
            key: "tests",
            width: 250,
            render: (tests, record) => {
                const isExpanded = expandedKeys[`${record.key}_tests`];

                return (
                    <div className="text-sm">
                        {tests && tests.length > 0 ? (
                            <div>
                                <div className="mb-2">
                                    <span className="font-semibold text-purple-600">
                                        {tests.length} Test{tests.length > 1 ? 's' : ''}
                                    </span>
                                </div>
                                <ul className="list-disc list-inside text-gray-600">
                                    {isExpanded
                                        ? tests.map((test, index) => (
                                            <li key={index} className="text-xs mb-1">
                                                <span className="font-medium">{test.name}</span>
                                                <span className="text-green-600 ml-1">(₹{test.price})</span>
                                            </li>
                                        ))
                                        : tests.slice(0, 2).map((test, index) => (
                                            <li key={index} className="text-xs mb-1">
                                                <span className="font-medium">{test.name}</span>
                                                <span className="text-green-600 ml-1">(₹{test.price})</span>
                                            </li>
                                        ))
                                    }
                                    {tests.length > 2 && (
                                        <li className="text-xs">
                                            <button
                                                onClick={() => toggleExpand(`${record.key}_tests`)}
                                                className="text-blue-500 underline bg-transparent border-none cursor-pointer"
                                            >
                                                {isExpanded
                                                    ? "show less"
                                                    : `+${tests.length - 2} more tests...`
                                                }
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        ) : (
                            "No tests included"
                        )}
                    </div>
                );
            },
        },
        {
            title: "Pricing",
            key: "pricing",
            align: "center",
            width: 150,
            render: (_, record) => (
                <div className="flex flex-col items-center">
                    <div className="text-xs text-gray-500 line-through">
                        ₹{record.originalPrice || 0}
                    </div>
                    <div className="font-semibold text-green-600 text-base">
                        ₹{record.finalAmount || 0}
                    </div>
                    <div className="text-xs text-orange-500 font-medium">
                        {record.discount}% OFF
                    </div>
                </div>
            ),
        },
        {
            title: "Expiry Date",
            dataIndex: "expiryDate",
            align: "center",
            key: "expiryDate",
            width: 120,
            render: (date) => {
                const expiryDate = moment(date);
                const today = moment();
                const isExpired = expiryDate.isBefore(today);

                return (
                    <div className="flex flex-col">
                        <span className={`text-sm ${isExpired ? 'text-red-500' : 'text-gray-700'}`}>
                            {date ? expiryDate.format("DD/MM/YYYY") : "N/A"}
                        </span>
                        {isExpired && (
                            <span className="text-xs text-red-500 font-medium">Expired</span>
                        )}
                    </div>
                );
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            align: "center",
            key: "status",
            width: 100,
            render: (status) => (
                <Tag color={statusColors[status]} className="capitalize font-medium">
                    {status}
                </Tag>
            ),
        },
        {
            title: "Created Date",
            dataIndex: "createdAt",
            align: "center",
            key: "createdAt",
            width: 120,
            render: (date) => (
                <span className="text-gray-500 text-sm">
                    {date ? moment(date).format("DD/MM/YYYY") : "N/A"}
                </span>
            ),
        },
        {
            title: "Action",
            align: "center",
            key: "action",
            width: 100,
            render: (_, record) => (
                <div className="flex gap-2 justify-center">
                    <Button
                        type="primary"
                        size="small"
                        icon={<MdEdit className="text-lg" />}
                        onClick={() => {
                            setCurrentLabPackage(record);
                            setPackageDrawer(true);
                        }}
                        className="!bg-blue-100 !text-blue-500 !border-blue-200 hover:!bg-blue-200"
                        title="Edit Package"
                    />
                </div>
            ),
        },
    ];

    const fetchLabPackages = async () => {
        try {
            setLoading(true);

            const payload = {
                search: searchQuery.trim(),
                sortBy: sortOrder,
                page: currentPage,
                pageSize: pageSize
            };

            const response = await postData("/api/labCenterBranch/list-of-lab-test-package-by-lab-center-branch", payload);

            if (response?.responseCode === 200) {
                const { packages = [], totalPackages = 0 } = response?.data || {};

                // Filter by status if selected (client-side filter)
                let filteredPackages = packages;
                if (selectedStatus) {
                    filteredPackages = packages.filter(pkg => pkg.status === selectedStatus);
                }

                setLabPackages(filteredPackages);
                setTotal(selectedStatus ? filteredPackages.length : totalPackages);
            } else {
                message.error(response?.message || "Failed to fetch lab packages");
                setLabPackages([]);
                setTotal(0);
            }
        } catch (error) {
            message.error(error?.message || "Failed to fetch lab packages");
            setLabPackages([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    const deleteLabPackage = async () => {
        if (!currentLabPackage) return;

        try {
            setDeleteLoading(true);
            // Note: You'll need to implement the delete API endpoint
            const payload = {
                packageId: currentLabPackage._id,
                isDeleted: true,
            };

            // Replace with actual delete API endpoint when available
            const response = await postData("/api/admin/delete-lab-package", payload);
            if (response?.responseCode === 200) {
                message.success("Lab package deleted successfully");
                fetchLabPackages();
                setDeleteModal(false);
            } else {
                message.error(response?.message || "Failed to delete lab package");
            }
        } catch (error) {
            message.error(error?.message || "Failed to delete lab package");
        } finally {
            setDeleteLoading(false);
        }
    };

    // Fetch data when dependencies change
    useEffect(() => {
        fetchLabPackages();
    }, [currentPage, pageSize, searchQuery, sortOrder, selectedStatus]);

    // Search debounce effect
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setSearchQuery(searchInput);
            setCurrentPage(1);
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchInput]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedStatus, sortOrder]);

    return (
        <Spin spinning={loading}>
            <div className="mt-2 flex flex-col gap-2">
                <div className="flex items-center justify-between client-details-form flex-wrap gap-3">
                    <div className="flex items-center justify-between gap-2 w-full flex-wrap">
                        <div className="flex gap-2 flex-wrap">
                            <TextField
                                id="search-lab-packages"
                                label="Search Lab Packages"
                                variant="outlined"
                                size="small"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                type="search"
                                className="min-w-[250px]"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <SearchOutlined className="search-icon text-gray-400" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                select
                                label="Status"
                                variant="outlined"
                                size="small"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="min-w-[140px]"
                            >
                                {statusOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                select
                                label="Sort By"
                                variant="outlined"
                                size="small"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="min-w-[160px]"
                            >
                                {sortOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>

                        <Button
                            type='primary'
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setCurrentLabPackage(null);
                                setPackageDrawer(true);
                            }}
                            className='text-white h-[36px] shadow-md hover:shadow-lg transition-shadow'>
                            Add New Lab Package
                        </Button>
                    </div>
                </div>

                <div className="max-h-[80dvh] overflow-y-auto pr-1">
                    <Table
                        columns={columns}
                        dataSource={labPackages}
                        locale={{
                            emptyText: (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <TbClipboardText className="text-5xl text-gray-300 mb-3" />
                                    <p className="text-gray-500 text-lg">No lab packages available</p>
                                    <p className="text-gray-400 text-sm">Add your first lab package to get started</p>
                                </div>
                            ),
                        }}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: total,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} packages`,
                            onChange: (page, size) => {
                                setCurrentPage(page);
                                if (size !== pageSize) {
                                    setPageSize(size);
                                    setCurrentPage(1);
                                }
                            },
                            pageSizeOptions: ['10', '20', '50', '100'],
                        }}
                        rowKey={(record) => record._id}
                        scroll={{ x: 1600 }}
                        className="custom-table"
                    />
                </div>

                {/* Add/Edit Lab Package Drawer */}
                <Drawer
                    open={packageDrawer}
                    onClose={() => setPackageDrawer(false)}
                    anchor="right"
                    PaperProps={{ style: { width: "40%" } }}
                    title={currentLabPackage ? "Edit Lab Package" : "Add New Lab Package"}
                >
                    <AddLabPackage
                        currentLabPackage={currentLabPackage}
                        onSuccess={() => {
                            fetchLabPackages(); // Refresh the package list
                            setPackageDrawer(false); // Close the drawer
                        }}
                        onClose={() => setPackageDrawer(false)}
                    />
                </Drawer>

                {/* Delete Confirmation Modal */}
                <Modal
                    open={deleteModal}
                    onCancel={() => setDeleteModal(false)}
                    footer={null}
                    centered
                    width={500}
                    className="custom-modal"
                >
                    <Spin spinning={deleteLoading}>
                        <div className="p-6">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MdOutlineCancel className="text-3xl text-red-500" />
                                </div>
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                                    Delete Lab Package
                                </h4>
                                <p className="text-gray-600">
                                    Are you sure you want to delete this lab package? This action cannot be undone.
                                </p>
                            </div>

                            {currentLabPackage && (
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium text-gray-700">Package ID:</span>
                                        <span className="text-blue-600 font-semibold">
                                            {currentLabPackage.packageId}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium text-gray-700">Name:</span>
                                        <span className="capitalize font-medium">
                                            {currentLabPackage.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium text-gray-700">Tests:</span>
                                        <span className="text-purple-600">
                                            {currentLabPackage.tests?.length || 0} tests included
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-700">Status:</span>
                                        <Tag color={statusColors[currentLabPackage.status]} className="capitalize">
                                            {currentLabPackage.status}
                                        </Tag>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-center items-center gap-4">
                                <Button
                                    type="default"
                                    onClick={() => setDeleteModal(false)}
                                    className="min-w-[120px] h-10"
                                    size="large"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    danger
                                    className="min-w-[120px] h-10"
                                    onClick={deleteLabPackage}
                                    size="large"
                                >
                                    Delete Package
                                </Button>
                            </div>
                        </div>
                    </Spin>
                </Modal>
            </div>
        </Spin>
    );
};

export default LabPackageBranch;