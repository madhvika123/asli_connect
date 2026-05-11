import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, message, Modal, Spin, Switch, Table, Tag } from "antd";
import { Drawer, InputAdornment, MenuItem, TextField } from "@mui/material";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { fetchData, postData } from "../../api/apiService";
import { MdEdit, MdOutlineCancel } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { TbClipboardText } from "react-icons/tb";
import AddCategory from "./AddCategory";

const LabCategoryMain = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [labCategories, setLabCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [categoryDrawer, setCategoryDrawer] = useState(false);

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
            title: "Category ID",
            dataIndex: "categoryId",
            align: "center",
            key: "categoryId",
            render: (id) => <span className="font-semibold">{id || "N/A"}</span>,
        },
        {
            title: "Category Name",
            dataIndex: "name",
            align: "center",
            key: "name",
            render: (name) => (
                <span className="font-medium capitalize">{name || "N/A"}</span>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            align: "center",
            key: "description",
            render: (description) => (
                <span className="text-gray-600 max-w-xs truncate">
                    {description || "N/A"}
                </span>
            ),
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
            title: "Created At",
            dataIndex: "createdAt",
            align: "center",
            key: "createdAt",
            render: (date) => (
                <div className="flex flex-col">
                    <span className="font-medium">
                        {date ? moment(date).format("DD/MM/YYYY") : "N/A"}
                    </span>
                </div>
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
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => {
                            setCurrentCategory(record);
                            setCategoryDrawer(true);
                        }}
                        className="!bg-blue-500 hover:!bg-blue-600"
                    />
                </div>
            ),
        },
    ];

    const fetchLabCategories = async () => {
        try {
            setLoading(true);
            const response = await fetchData("/api/admin/list-of-lab-test-category-dropdown");

            if (response?.responseCode === 200) {
                let categories = response?.data || [];

                // Filter categories based on search query
                if (searchQuery) {
                    categories = categories.filter(category =>
                        category.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        category.categoryId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        category.description?.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                }

                // Calculate pagination
                const startIndex = (currentPage - 1) * pageSize;
                const endIndex = startIndex + pageSize;
                const paginatedCategories = categories.slice(startIndex, endIndex);

                setLabCategories(paginatedCategories);
                setTotal(categories.length);
            } else {
                message.error(response?.message || "Failed to fetch lab categories");
            }
        } catch (error) {
            message.error(error?.message || "Failed to fetch lab categories");
        } finally {
            setLoading(false);
        }
    };

    const deleteCategory = async () => {
        if (!currentCategory) return;

        try {
            setDeleteLoading(true);
            // Assuming there's a delete endpoint - adjust as needed
            const response = await postData("/api/admin/delete-lab-category", {
                categoryId: currentCategory._id
            });

            if (response?.responseCode === 200) {
                message.success("Category deleted successfully");
                fetchLabCategories();
                setDeleteModal(false);
            } else {
                message.error(response?.message || "Failed to delete category");
            }
        } catch (error) {
            message.error(error?.message || "Failed to delete category");
        } finally {
            setDeleteLoading(false);
        }
    };

    useEffect(() => {
        fetchLabCategories();
    }, [currentPage, pageSize, searchQuery]);

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
                        <TextField
                            id="search-categories"
                            label="Search Lab Categories"
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

                        <Button
                            type='primary'
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setCurrentCategory(null);
                                setCategoryDrawer(true);
                            }}
                            className='text-white h-[36px]'>
                            Add New Category
                        </Button>
                    </div>
                </div>

                <div className="max-h-[80dvh] overflow-y-auto pr-1">
                    <Table
                        columns={columns}
                        dataSource={labCategories}
                        locale={{
                            emptyText: (
                                <div className="flex flex-col items-center justify-center py-10">
                                    <TbClipboardText className="text-4xl text-gray-400 mb-2" />
                                    <p className="text-gray-500">No lab categories available</p>
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

                {/* Add/Edit Category Drawer */}
                <Drawer
                    open={categoryDrawer}
                    onClose={() => setCategoryDrawer(false)}
                    anchor="right"
                    PaperProps={{ style: { width: "40%" } }}
                >
                    <AddCategory
                        currentCategory={currentCategory}
                        onClose={() => setCategoryDrawer(false)}
                        onSuccess={fetchLabCategories}
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
                                Delete Lab Category
                            </h4>
                            <p className="text-center mb-4">
                                Are you sure you want to delete this lab category?
                            </p>
                            {currentCategory && (
                                <div className="border rounded-lg p-3 mb-4">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium">Category ID:</span>
                                        <span>{currentCategory.categoryId}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium">Category Name:</span>
                                        <span className="capitalize">
                                            {currentCategory.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Status:</span>
                                        <Tag color={statusColors[currentCategory.status]} className="capitalize">
                                            {currentCategory.status}
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
                                    onClick={deleteCategory}
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

export default LabCategoryMain;