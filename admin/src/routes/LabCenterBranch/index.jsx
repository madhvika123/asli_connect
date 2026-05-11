import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, message, Modal, Spin, Switch, Table, Tag } from "antd";
import { Drawer, InputAdornment, MenuItem, TextField } from "@mui/material";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { fetchData, postData } from "../../api/apiService";
import { MdEdit, MdOutlineCancel } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { TbClipboardText } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import AddLabCenterBranch from "./AddLabCenter";

const LabCenterBranch = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [labBranches, setLabBranches] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedHomeCollection, setSelectedHomeCollection] = useState("");
    const [selectedLabVisit, setSelectedLabVisit] = useState("");
    const [selectedSort, setSelectedSort] = useState("0");
    const [maxDistance, setMaxDistance] = useState();
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [currentBranch, setCurrentBranch] = useState(null);
    const [branchDrawer, setBranchDrawer] = useState(false);
    const [expandedKeys, setExpandedKeys] = useState({});
    const navigate = useNavigate();

    const toggleExpand = (key) => {
        setExpandedKeys(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };


    const sortOptions = [
        { value: "0", label: "Newest First" },
        { value: "1", label: "Rating Sort" },
        { value: "2", label: "Near Me" },
    ];

    const homeCollectionOptions = [
        { value: "", label: "All" },
        { value: "true", label: "Available" },
        { value: "false", label: "Not Available" },
    ];

    const labVisitOptions = [
        { value: "", label: "All" },
        { value: "true", label: "Available" },
        { value: "false", label: "Not Available" },
    ];

    const statusColors = {
        active: "green",
        inactive: "red",
    };

    const handleBranchSuccess = () => {
        setBranchDrawer(false);
        fetchLabBranches();
    };


    const columns = [
        {
            title: "S.No",
            align: "center",
            key: "index",
            render: (_, record, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: "Branch ID",
            dataIndex: "labCenterBranchId",
            align: "center",
            key: "labCenterBranchId",
            render: (id) => <span className="font-semibold">{id || "N/A"}</span>,
        },
        {
            title: "Branch Name",
            dataIndex: "name",
            align: "center",
            key: "name",
            render: (name, record) => (
                <span
                    className="font-medium capitalize text-blue-600 hover:underline cursor-pointer"
                    onClick={() => navigate(`/labcenterbranchprofile?branchId=${record._id}`)}
                >
                    {name || "N/A"}
                </span>
            ),
        },
        {
            title: "Parent Lab Center",
            key: "labCenter",
            align: "center",
            render: (_, record) => (
                <span className="font-medium text-blue-600">
                    {record.labCenter?.name || "N/A"}
                </span>
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
                const isExpanded = expandedKeys[`${record._id}_address`];
                const fullAddress = `${record.address || ""}, ${record.city || ""}, ${record.state || ""}, ${record.pincode || ""}, ${record.country || ""}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',');
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

                // Create shortened address for collapsed view
                const fullAddressText = `${record.address || ""}, ${record.city || ""}, ${record.state || ""}, ${record.pincode || ""}, ${record.country || ""}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',');
                const shortAddress = fullAddressText.length > 30 ? fullAddressText.slice(0, 30) : fullAddressText;
                const needsExpansion = fullAddressText.length > 30;

                return (
                    <div className="flex flex-col text-sm max-w-[200px]">
                        <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-blue-600 mb-1 break-words"
                        >
                            <span className="font-medium">
                                {isExpanded
                                    ? fullAddressText
                                    : needsExpansion
                                        ? `${shortAddress}...`
                                        : fullAddressText || "N/A"
                                }
                            </span>
                        </a>

                        {needsExpansion && (
                            <button
                                onClick={() => toggleExpand(`${record._id}_address`)}
                                className="text-blue-500 underline bg-transparent border-none cursor-pointer text-xs mb-1 self-start"
                            >
                                {isExpanded ? "show less" : "more"}
                            </button>
                        )}
                    </div>
                );
            },
        },
        {
            title: "Services",
            key: "services",
            align: "center",
            render: (_, record) => (
                <div className="flex flex-col gap-1">
                    <Tag color={record.homeCollectionService?.isAvailable ? "green" : "red"} className="text-xs">
                        Home Collection: {record.homeCollectionService?.isAvailable ? "Yes" : "No"}
                    </Tag>
                    <Tag color={record.labVisitServiceAvailable ? "green" : "red"} className="text-xs">
                        Lab Visit: {record.labVisitServiceAvailable ? "Yes" : "No"}
                    </Tag>
                </div>
            ),
        },
        {
            title: "Home Collection Details",
            key: "homeCollectionDetails",
            align: "center",
            render: (_, record) => {
                const service = record.homeCollectionService;
                if (!service?.isAvailable) return "N/A";

                return (
                    <div className="flex flex-col text-xs">
                        <span>Radius: {service.serviceRadius} km</span>
                        <span>Within: ₹{service.charges?.withinRadius || 0}</span>
                        <span>Beyond: ₹{service.charges?.beyondRadius || 0}</span>
                    </div>
                );
            },
        },
        {
            title: "Tests Available",
            key: "tests",
            align: "center",
            render: (_, record) => (
                <div className="flex flex-col gap-1">
                    {record.tests?.length > 0 ? (
                        <>
                            <span className="font-medium text-blue-600">
                                {record.tests.length} Tests
                            </span>
                            <div className="text-xs text-gray-500">
                                {record.tests.slice(0, 2).map((test, index) => (
                                    <div key={test._id}>{test.name}</div>
                                ))}
                                {record.tests.length > 2 && (
                                    <span>+{record.tests.length - 2} more</span>
                                )}
                            </div>
                        </>
                    ) : (
                        "No tests available"
                    )}
                </div>
            ),
        },
        // {
        //     title: "Distance",
        //     key: "distance",
        //     align: "center",
        //     render: (_, record) => (
        //         <span className="text-gray-600 font-medium">
        //             {record.distance ? `${(record.distance / 1000).toFixed(2)} km` : "N/A"}
        //         </span>
        //     ),
        // },
        {
            title: "Website",
            dataIndex: "website",
            align: "center",
            key: "website",
            render: (website) => {
                if (!website) return "N/A";

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
                            setCurrentBranch(record);
                            setBranchDrawer(true);
                        }}
                        className="!bg-blue-100 !text-blue-500"
                    />
                </div>
            ),
        },
    ];

    const fetchLabBranches = async () => {
        try {
            setLoading(true);
            const payload = {
                search: searchQuery,
                labCenterIds: [], // You can add specific lab center IDs here if needed
                maxDistance: maxDistance,
                sort: parseInt(selectedSort),
                page: currentPage,
                pageSize: pageSize,
            };

            // Add optional filters if selected
            if (selectedHomeCollection !== "") {
                payload.homeCollectionService = selectedHomeCollection === "true";
            }
            if (selectedLabVisit !== "") {
                payload.labVisitServiceAvailable = selectedLabVisit === "true";
            }

            const response = await postData("/api/admin/list-of-lab-center-branches", payload);

            if (response?.responseCode === 200) {
                const data = response?.data || {};
                setLabBranches(data.labBranches || []);
                setTotal(data.totalLabBranches || 0);
            } else {
                message.error(response?.message || "Failed to fetch lab branches");
            }
        } catch (error) {
            message.error(error?.message || "Failed to fetch lab branches");
        } finally {
            setLoading(false);
        }
    };

    const deleteBranch = async () => {
        if (!currentBranch) return;

        try {
            setDeleteLoading(true);
            const payload = {
                branchId: currentBranch._id,
                isDeleted: true,
            };

            // Note: Replace with your actual delete API endpoint
            const response = await postData("/api/admin/delete-lab-branch", payload);
            if (response?.responseCode === 200) {
                message.success("Lab branch deleted successfully");
                fetchLabBranches();
                setDeleteModal(false);
            } else {
                message.error(response?.message || "Failed to delete lab branch");
            }
        } catch (error) {
            message.error(error?.message || "Failed to delete lab branch");
        } finally {
            setDeleteLoading(false);
        }
    };

    useEffect(() => {
        fetchLabBranches();
    }, [currentPage, pageSize, selectedSort, selectedHomeCollection, selectedLabVisit, maxDistance, searchQuery]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setSearchQuery(searchInput);
            setCurrentPage(1);
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
                                id="search-lab-branches"
                                label="Search Lab Branches"
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
                                label="Home Collection"
                                variant="outlined"
                                size="small"
                                value={selectedHomeCollection}
                                onChange={(e) => setSelectedHomeCollection(e.target.value)}
                                className="min-w-[150px]"
                            >
                                {homeCollectionOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField> */}

                            {/* <TextField
                                select
                                label="Lab Visit"
                                variant="outlined"
                                size="small"
                                value={selectedLabVisit}
                                onChange={(e) => setSelectedLabVisit(e.target.value)}
                                className="min-w-[120px]"
                            >
                                {labVisitOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField> */}

                            <TextField
                                select
                                label="Sort By"
                                variant="outlined"
                                size="small"
                                value={selectedSort}
                                onChange={(e) => setSelectedSort(e.target.value)}
                                className="min-w-[130px]"
                            >
                                {sortOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            {/* <TextField
                                label="Max Distance (km)"
                                variant="outlined"
                                size="small"
                                type="number"
                                value={maxDistance}
                                onChange={(e) => setMaxDistance(Number(e.target.value))}
                                className="min-w-[150px]"
                                inputProps={{ min: 1, max: 100 }}
                            /> */}
                        </div>

                        <Button
                            type='primary'
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setCurrentBranch(null);
                                setBranchDrawer(true);
                            }}
                            className='text-white h-[36px]'>
                            Add New Lab Branch
                        </Button>
                    </div>
                </div>

                <div className="max-h-[80dvh] overflow-y-auto pr-1">
                    <Table
                        columns={columns}
                        dataSource={labBranches}
                        locale={{
                            emptyText: (
                                <div className="flex flex-col items-center justify-center py-10">
                                    <TbClipboardText className="text-4xl text-gray-400 mb-2" />
                                    <p className="text-gray-500">No lab branches available</p>
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

                {/* Add/Edit Lab Branch Drawer */}
                <Drawer
                    open={branchDrawer}
                    onClose={() => setBranchDrawer(false)}
                    anchor="right"
                    PaperProps={{ style: { width: "50%" } }}
                >
                    <AddLabCenterBranch
                        currentBranch={currentBranch}
                        onSuccess={handleBranchSuccess}
                        onCancel={() => setBranchDrawer(false)}
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
                                Delete Lab Branch
                            </h4>
                            <p className="text-center mb-4">
                                Are you sure you want to delete this lab branch?
                            </p>
                            {currentBranch && (
                                <div className="border rounded-lg p-3 mb-4">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium">Branch ID:</span>
                                        <span>{currentBranch.labCenterBranchId}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium">Name:</span>
                                        <span className="capitalize">
                                            {currentBranch.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium">Parent Lab:</span>
                                        <span>{currentBranch.labCenter?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Status:</span>
                                        <Tag color={statusColors[currentBranch.status]} className="capitalize">
                                            {currentBranch.status}
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
                                    onClick={deleteBranch}
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

export default LabCenterBranch;