import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, message, Modal, Spin, Switch, Table, Tag } from "antd";
import { Drawer, InputAdornment, MenuItem, TextField } from "@mui/material";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { fetchData, postData } from "../../../api/apiService";
import { MdEdit, MdOutlineCancel } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { TbClipboardText } from "react-icons/tb";
import AddLabTest from "./AddLabtest";


const LabTestMainBranch = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [labTests, setLabTests] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [currentLabTest, setCurrentLabTest] = useState(null);
    const [labTestDrawer, setLabTestDrawer] = useState(false);
    const [categories, setCategories] = useState([]);
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
        { value: "newest", label: "Newest First" },
        { value: "oldest", label: "Oldest First" },
        { value: "priceLowToHigh", label: "Price: Low to High" },
        { value: "priceHighToLow", label: "Price: High to Low" },
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
            title: "Test ID",
            dataIndex: "testId",
            align: "center",
            key: "testId",
            width: 120,
            render: (id) => <span className="font-semibold text-blue-600">{id || "N/A"}</span>,
        },
        {
            title: "Test Name",
            dataIndex: "name",
            align: "left",
            key: "name",
            width: 200,
            render: (name) => (
                <span className="font-medium capitalize">{name || "N/A"}</span>
            ),
        },
        {
            title: "Category",
            key: "category",
            align: "center",
            width: 150,
            render: (_, record) => (
                <div className="flex flex-col">
                    <span className="font-medium text-purple-600">
                        {record.category?.name || "N/A"}
                    </span>
                    <span className="text-xs text-gray-500">
                        {record.category?.categoryId || ""}
                    </span>
                </div>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 250,
            render: (description, record) => {
                const isExpanded = expandedKeys[record.key];
                const shortText = description?.slice(0, 30) || "N/A";

                return (
                    <span className="text-sm text-gray-600">
                        {description
                            ? isExpanded
                                ? description
                                : `${shortText}${description.length > 30 ? "..." : ""}`
                            : "N/A"}
                        {description?.length > 30 && (
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
            title: "Price",
            dataIndex: "price",
            align: "center",
            key: "price",
            width: 100,
            render: (price) => (
                <span className="font-semibold text-green-600">
                    ₹{price || "0"}
                </span>
            ),
        },
        {
            title: "Preparation",
            dataIndex: "preparation",
            align: "left",
            key: "preparation",
            width: 200,
            render: (preparation, record) => {
                const isExpanded = expandedKeys[`${record.key}_prep`];
                
                return (
                    <div className="text-sm">
                        {preparation && preparation.length > 0 ? (
                            <ul className="list-disc list-inside text-gray-600">
                                {isExpanded 
                                    ? preparation.map((item, index) => (
                                        <li key={index} className="text-xs mb-1">
                                            {item}
                                        </li>
                                      ))
                                    : preparation.slice(0, 2).map((item, index) => (
                                        <li key={index} className="text-xs mb-1">
                                            {item.length > 50 ? `${item.substring(0, 50)}...` : item}
                                        </li>
                                      ))
                                }
                                {preparation.length > 2 && (
                                    <li className="text-xs">
                                        <button
                                            onClick={() => toggleExpand(`${record.key}_prep`)}
                                            className="text-blue-500 underline bg-transparent border-none cursor-pointer"
                                        >
                                            {isExpanded 
                                                ? "show less" 
                                                : `+${preparation.length - 2} more...`
                                            }
                                        </button>
                                    </li>
                                )}
                            </ul>
                        ) : (
                            "No preparation required"
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
            render: (_, record) => (
                <div className="flex gap-2 justify-center">
                    <Button
                        type="primary"
                        size="small"
                        icon={<MdEdit className="text-lg" />}
                        onClick={() => {
                            setCurrentLabTest(record);
                            setLabTestDrawer(true);
                        }}
                        className="!bg-blue-100 !text-blue-500 !border-blue-200 hover:!bg-blue-200"
                        title="Edit Test"
                    />
                </div>
            ),
        },
    ];

    const fetchLabTests = async () => {
        try {
            setLoading(true);
            
            // Prepare payload according to API specification
            const payload = {
                search: searchQuery.trim(),
                sort: sortOrder,
                page: currentPage,
                pageSize: pageSize
            };

            const response = await postData("/api/labCenterBranch/list-of-lab-tests-by-lab-center-branch", payload);

            if (response?.responseCode === 200) {
                const { tests = [], totalTest = 0 } = response?.data || {};
                
                // Filter by status if selected (client-side filter for status)
                let filteredTests = tests;
                if (selectedStatus) {
                    filteredTests = tests.filter(test => test.status === selectedStatus);
                }

                // Filter by category if selected (client-side filter for category)
                if (selectedCategory) {
                    filteredTests = filteredTests.filter(test => test.category?._id === selectedCategory);
                }

                setLabTests(filteredTests);
                setTotal(selectedStatus || selectedCategory ? filteredTests.length : totalTest);
            } else {
                message.error(response?.message || "Failed to fetch lab tests");
                setLabTests([]);
                setTotal(0);
            }
        } catch (error) {
            message.error(error?.message || "Failed to fetch lab tests");
            setLabTests([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetchData("/api/admin/list-of-lab-test-category-dropdown");
            if (response?.responseCode === 200) {
                setCategories(response?.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const deleteLabTest = async () => {
        if (!currentLabTest) return;

        try {
            setDeleteLoading(true);
            const payload = {
                testId: currentLabTest._id,
                isDeleted: true,
            };

            const response = await postData("/api/admin/delete-lab-test", payload);
            if (response?.responseCode === 200) {
                message.success("Lab test deleted successfully");
                fetchLabTests();
                setDeleteModal(false);
            } else {
                message.error(response?.message || "Failed to delete lab test");
            }
        } catch (error) {
            message.error(error?.message || "Failed to delete lab test");
        } finally {
            setDeleteLoading(false);
        }
    };

    // Fetch data when dependencies change
    useEffect(() => {
        fetchLabTests();
    }, [currentPage, pageSize, searchQuery, sortOrder, selectedStatus, selectedCategory]);

    useEffect(() => {
        fetchCategories();
    }, []);

    // Search debounce effect
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setSearchQuery(searchInput);
            setCurrentPage(1); // Reset to first page on search
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchInput]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedStatus, selectedCategory, sortOrder]);

    return (
        <Spin spinning={loading}>
            <div className="mt-2 flex flex-col gap-2">
                <div className="flex items-center justify-between client-details-form flex-wrap gap-3">
                    <div className="flex items-center justify-between gap-2 w-full flex-wrap">
                        <div className="flex gap-2 flex-wrap">
                            <TextField
                                id="search-lab-tests"
                                label="Search Lab Tests"
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
                                label="Category"
                                variant="outlined"
                                size="small"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="min-w-[180px]"
                            >
                                <MenuItem value="">All Categories</MenuItem>
                                {categories.map((category) => (
                                    <MenuItem key={category._id} value={category._id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </TextField>

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
                                setCurrentLabTest(null);
                                setLabTestDrawer(true);
                            }}
                            className='text-white h-[36px] shadow-md hover:shadow-lg transition-shadow'>
                            Add New Lab Test
                        </Button>
                    </div>
                </div>

                <div className="max-h-[80dvh] overflow-y-auto pr-1">
                    <Table
                        columns={columns}
                        dataSource={labTests}
                        locale={{
                            emptyText: (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <TbClipboardText className="text-5xl text-gray-300 mb-3" />
                                    <p className="text-gray-500 text-lg">No lab tests available</p>
                                    <p className="text-gray-400 text-sm">Add your first lab test to get started</p>
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
                                `${range[0]}-${range[1]} of ${total} tests`,
                            onChange: (page, size) => {
                                setCurrentPage(page);
                                if (size !== pageSize) {
                                    setPageSize(size);
                                    setCurrentPage(1); // Reset to first page when page size changes
                                }
                            },
                            pageSizeOptions: ['10', '20', '50', '100'],
                        }}
                        rowKey={(record) => record._id}
                        scroll={{ x: 1400 }}
                        className="custom-table"
                    />
                </div>

                {/* Add/Edit Lab Test Drawer */}
                <Drawer
                    open={labTestDrawer}
                    onClose={() => setLabTestDrawer(false)}
                    anchor="right"
                    PaperProps={{ 
                        style: { 
                            width: "45%", 
                            minWidth: "500px",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
                        } 
                    }}
                >
                    <AddLabTest
                        currentLabTest={currentLabTest}
                        categories={categories}
                        onClose={() => setLabTestDrawer(false)}
                        onSuccess={() => {
                            fetchLabTests();
                            setCurrentLabTest(null);
                        }}
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
                                    Delete Lab Test
                                </h4>
                                <p className="text-gray-600">
                                    Are you sure you want to delete this lab test? This action cannot be undone.
                                </p>
                            </div>
                            
                            {currentLabTest && (
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium text-gray-700">Test ID:</span>
                                        <span className="text-blue-600 font-semibold">
                                            {currentLabTest.testId}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium text-gray-700">Name:</span>
                                        <span className="capitalize font-medium">
                                            {currentLabTest.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium text-gray-700">Category:</span>
                                        <span className="text-purple-600">
                                            {currentLabTest.category?.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-700">Status:</span>
                                        <Tag color={statusColors[currentLabTest.status]} className="capitalize">
                                            {currentLabTest.status}
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
                                    onClick={deleteLabTest}
                                    size="large"
                                >
                                    Delete Test
                                </Button>
                            </div>
                        </div>
                    </Spin>
                </Modal>
            </div>
        </Spin>
    );
};

export default LabTestMainBranch;