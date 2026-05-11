import React, { useEffect, useState } from "react";
import moment from "moment";
import {
    Button,
    message,
    Modal,
    Spin,
    Switch,
    Badge,
    Tooltip,
    Row,
    Col,
    Card as AntCard,
    Input,
    Select,
    Space,
    Divider as AntDivider,
    Tag,
    Descriptions,
    Form,
    Drawer
} from "antd";
import {
    InputAdornment,
    MenuItem,
    TextField,
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    Chip,
    Divider,
    IconButton
} from "@mui/material";
import {
    PlusOutlined,
    SearchOutlined,
    LoginOutlined,
    FilterOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined,
    GlobalOutlined,
    ExperimentOutlined,
    CarOutlined,
    HomeOutlined,
    ShopOutlined,
    EditOutlined,
    ClockCircleOutlined,
    LockOutlined
} from "@ant-design/icons";
import { fetchData, postData } from "../../../api/apiService";
import { MdEdit, MdLocationOn, MdBed, MdMeetingRoom, MdDateRange } from "react-icons/md";
import { FaUserDoctor, FaHospital, FaPhone, FaEnvelope, FaIdCard } from "react-icons/fa6";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { updatingUserProfile } from "../../../redux/action";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AddLabBranch from "./AddLabbranch";

const { Search } = Input;
const { Option } = Select;
const { Password } = Input;

const LabCenterBranchesMainBranch = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [labBranches, setLabBranches] = useState([]);
    const [totalBranches, setTotalBranches] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [addBranchDrawerVisible, setAddBranchDrawerVisible] = useState(false);// 4x3 grid initially

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [homeCollectionFilter, setHomeCollectionFilter] = useState(null);
    const [labVisitFilter, setLabVisitFilter] = useState(null);
    const [maxDistance, setMaxDistance] = useState(5000);
    const [sortOption, setSortOption] = useState(0);

    // Modal states
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [loginLoading, setLoginLoading] = useState(false);

    const [form] = Form.useForm();

    const fetchLabBranches = async () => {
        setLoading(true);
        try {
            const params = {
                search: searchTerm,
                maxDistance: maxDistance,
                sort: sortOption,
                page: currentPage,
                pageSize: pageSize
            };

            if (homeCollectionFilter !== null) {
                params.homeCollectionService = homeCollectionFilter;
            }
            if (labVisitFilter !== null) {
                params.labVisitServiceAvailable = labVisitFilter;
            }
            const response = await postData("/api/labCenter/list-of-lab-center-branches-by-lab", params);
            if (response.responseCode === 200) {
                setLabBranches(response.data.labBranches);
                setTotalBranches(response.data.totalLabBranches);
            } else {
                message.error("Failed to fetch lab branches");
            }
        } catch (error) {
            console.error("Error fetching lab branches:", error);
            message.error("Error fetching lab branches");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLabBranches();
    }, [currentPage, pageSize, sortOption, homeCollectionFilter, labVisitFilter, maxDistance]);

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
        // Add debounced search or search on enter
    };

    const handleViewBranch = (branch) => {
        setSelectedBranch(branch);
        setViewModalVisible(true);
    };

    const handleLoginBranch = (branch) => {
        setSelectedBranch(branch);
        setLoginModalVisible(true);
        form.resetFields();
    };

    const handleEditBranch = (branch) => {
        console.log("Edit branch:", branch);
        message.info(`Edit functionality for ${branch.name}`);
    };

    const handleToggleStatus = (branch, checked) => {
        console.log("Toggle status for branch:", branch._id, "New status:", checked);
        message.success(`Branch ${checked ? 'activated' : 'deactivated'} successfully`);
    };
  const handleLogin = async (values) => {
  setLoginLoading(true);
  try {
    const loginData = {
      labCenterBranchId: selectedBranch._id,
      password: values.password
    };

    console.log("Login credentials:", loginData);
    const response = await postData("/api/labCenter/lab-center-branch-login-by-lab", loginData);
    if (response.responseCode === 200) {
      const token = response.data.token;
      const labCenterBranchId = response.data.labCenterBranchId;
      
      // Store authentication data
      localStorage.setItem("adminToken", token);
      localStorage.setItem("userRole", "labcenterbranch"); // This role will be used in Login.js
      localStorage.setItem("labCenterBranchId", labCenterBranchId);
      localStorage.setItem("labCenterBranchName", selectedBranch.name);

      message.success(`Successfully logged into ${selectedBranch.name}`);
      setLoginModalVisible(false);
      form.resetFields();

      // Fetch profile data immediately after login to ensure header shows correct info
      await fetchProfileAfterLogin(token);

      // Navigate to branch dashboard
      navigate("/labcenterbranchdashboard");
    } else {
      message.error(response.message || "Login failed. Please try again.");
    }
  } catch (error) {
    console.error("Login error:", error);
    message.error("Login failed. Please try again.");
  } finally {
    setLoginLoading(false);
  }
};

// Add this new function to fetch profile after login
const fetchProfileAfterLogin = async (token) => {
  try {
    // Format current date/time (same format as Login.js)
    const now = new Date();
    const date = now.getDate().toString().padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
   const formattedToday = now.toISOString().split("T")[0];

    const response = await postData("/api/labCenterBranch/lab-center-branch-profile", { 
      date: formattedToday 
    });
    
    if (response.responseCode === 200) {
      const userData = response.data?.labCenterBranch || {};
      // Add additional data from the response
      if (response.data?.tests) {
        userData.tests = response.data.tests;
      }
      if (response.data?.packages) {
        userData.packages = response.data.packages;
      }
      dispatch(updatingUserProfile(userData));
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
};

    const handleAddBranch = () => {
        setAddBranchDrawerVisible(true);
    };

    const renderBranchCard = (branch) => (
        <Col xs={24} sm={12} md={8} lg={6} key={branch._id} style={{ marginBottom: 16 }}>
            <AntCard
                hoverable
                style={{
                    height: '100%',
                    borderRadius: 16,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    border: '1px solid #f0f0f0'
                }}
                bodyStyle={{ padding: 20 }}
                actions={[
                    <Button
                        type="primary"
                        icon={<LoginOutlined />}
                        onClick={() => handleLoginBranch(branch)}
                        style={{
                            width: '90%',
                            borderRadius: 8,
                            height: 40,
                            fontWeight: 500
                        }}
                        size="large"
                    >
                        Login Branch
                    </Button>
                ]}
            >
                {/* Header Section with Branch Name, Toggle, and Edit */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 16
                }}>
                    <div style={{ flex: 1, marginRight: 12 }}>
                        <Typography variant="h6" style={{
                            fontWeight: 600,
                            marginBottom: 4,
                            color: '#1890ff',
                            fontSize: '16px',
                            lineHeight: '1.3'
                        }}>
                            {branch.name}
                        </Typography>
                        <Typography
                            variant="body2"
                            style={{
                                color: '#1890ff',
                                fontSize: '12px',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    color: '#40a9ff'
                                }
                            }}
                            onClick={() => handleViewBranch(branch)}
                        >
                            {branch.labCenter.name}
                        </Typography>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        flexShrink: 0
                    }}>
                        <Tooltip title={branch.status === 'active' ? 'Deactivate Branch' : 'Activate Branch'}>
                            <Switch
                                size="small"
                                checked={branch.status === 'active'}
                                onChange={(checked) => handleToggleStatus(branch, checked)}
                                style={{ marginRight: 4 }}
                            />
                        </Tooltip>

                        <Tooltip title="Edit Branch">
                            <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => handleEditBranch(branch)}
                                style={{
                                    padding: '4px 8px',
                                    height: 'auto',
                                    color: '#1890ff'
                                }}
                            />
                        </Tooltip>
                    </div>
                </div>

                {/* Branch Information */}
                <Space direction="vertical" size="small" style={{ width: '100%', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                        <EnvironmentOutlined style={{ marginRight: 8, color: '#52c41a', fontSize: '14px' }} />
                        <span style={{ color: '#595959', flex: 1 }}>
                            {branch.address}, {branch.city}
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                        <PhoneOutlined style={{ marginRight: 8, color: '#1890ff', fontSize: '14px' }} />
                        <span style={{ color: '#595959' }}>{branch.phone}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                        <ExperimentOutlined style={{ marginRight: 8, color: '#722ed1', fontSize: '14px' }} />
                        <span style={{ color: '#595959' }}>
                            {branch.tests.length} Tests Available
                        </span>
                    </div>
                </Space>

                <AntDivider style={{ margin: '16px 0 12px 0' }} />

                {/* Services and Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size="small" wrap>
                        {branch.homeCollectionService.isAvailable && (
                            <Tag color="green" style={{
                                fontSize: '10px',
                                margin: 0,
                                borderRadius: 12,
                                padding: '2px 8px'
                            }}>
                                <HomeOutlined style={{ fontSize: '10px', marginRight: 4 }} />
                                Home Collection
                            </Tag>
                        )}
                        {branch.labVisitServiceAvailable && (
                            <Tag color="blue" style={{
                                fontSize: '10px',
                                margin: 0,
                                borderRadius: 12,
                                padding: '2px 8px'
                            }}>
                                <ShopOutlined style={{ fontSize: '10px', marginRight: 4 }} />
                                Lab Visit
                            </Tag>
                        )}
                    </Space>

                    <Badge
                        status={branch.status === 'active' ? 'success' : 'error'}
                        text={branch.status.charAt(0).toUpperCase() + branch.status.slice(1)}
                        style={{ fontSize: '10px' }}
                    />
                </div>
            </AntCard>
        </Col>
    );

    return (
        <div>
            {/* Filter Section */}
            <div style={{
                marginBottom: 24,
                padding: 10,
            }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12} md={6}>
                        <Search
                            placeholder="Search branches..."
                            allowClear
                            onSearch={handleSearch}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%' }}
                            size="large"
                        />
                    </Col>

                    <Col xs={24} sm={12} md={4}>
                        <Select
                            placeholder="Home Collection"
                            allowClear
                            style={{ width: '100%' }}
                            onChange={setHomeCollectionFilter}
                            size="large"
                        >
                            <Option value={true}>Available</Option>
                            <Option value={false}>Not Available</Option>
                        </Select>
                    </Col>

                    <Col xs={24} sm={12} md={4}>
                        <Select
                            placeholder="Lab Visit"
                            allowClear
                            style={{ width: '100%' }}
                            onChange={setLabVisitFilter}
                            size="large"
                        >
                            <Option value={true}>Available</Option>
                            <Option value={false}>Not Available</Option>
                        </Select>
                    </Col>

                    <Col xs={24} sm={12} md={4}>
                        <Select
                            placeholder="Sort by"
                            value={sortOption}
                            style={{ width: '100%' }}
                            onChange={setSortOption}
                            size="large"
                        >
                            <Option value={0}>Newest First</Option>
                            <Option value={1}>Rating</Option>
                            <Option value={2}>Distance</Option>
                        </Select>
                    </Col>

                    <Col xs={24} sm={24} md={6}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAddBranch}
                            style={{
                                width: '100%',
                                height: 40,
                                borderRadius: 8,
                                fontWeight: 500
                            }}
                            size="large"
                        >
                            Add New Branch
                        </Button>
                    </Col>
                </Row>
            </div>

            {/* Results Summary */}
            <div style={{ marginBottom: 20 }}>
                <Typography variant="h6" style={{
                    color: '#262626',
                    fontWeight: 500,
                    fontSize: '16px'
                }}>
                    {totalBranches} Lab Branches Found
                </Typography>
            </div>

            {/* Lab Branches Grid */}
            <Spin spinning={loading}>
                <Row gutter={[20, 20]}>
                    {labBranches.map((branch) => renderBranchCard(branch))}
                </Row>
            </Spin>

            {/* Load More Button */}
            {labBranches.length < totalBranches && (
                <div style={{ textAlign: 'center', marginTop: 32 }}>
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => {
                            setPageSize(prev => prev + 12);
                        }}
                        loading={loading}
                        style={{
                            borderRadius: 8,
                            height: 44,
                            paddingLeft: 32,
                            paddingRight: 32,
                            fontWeight: 500
                        }}
                    >
                        Load More Branches
                    </Button>
                </div>
            )}
            <Modal
                title={null}
                open={viewModalVisible}
                onCancel={() => setViewModalVisible(false)}
                footer={null}
                width={800}
                className="top-5"
                styles={{
                    body: { padding: 0 },
                    content: { padding: 0, borderRadius: '12px', overflow: 'hidden' }
                }}
            >
                {selectedBranch && (
                    <div style={{ backgroundColor: '#ffffff' }}>
                        {/* Header */}
                        <div className="p-6 border-b"
                            style={{
                                backgroundColor: '#eff6ff',
                                borderColor: '#e5e7eb'
                            }}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1"
                                        style={{ color: '#111827' }}>
                                        {selectedBranch.name}
                                    </h2>
                                    <p className="text-lg mb-3"
                                        style={{ color: '#4b5563' }}>
                                        {selectedBranch.labCenter.name}
                                    </p>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <span className="flex items-center gap-1"
                                            style={{ color: '#374151' }}>
                                            <EnvironmentOutlined style={{ color: '#3b82f6' }} />
                                            {selectedBranch.city}, {selectedBranch.state}
                                        </span>
                                        <span className="flex items-center gap-1"
                                            style={{ color: '#374151' }}>
                                            <PhoneOutlined style={{ color: '#22c55e' }} />
                                            {selectedBranch.phone}
                                        </span>
                                        <span className="flex items-center gap-1"
                                            style={{ color: '#374151' }}>
                                            <ExperimentOutlined style={{ color: '#8b5cf6' }} />
                                            {selectedBranch.tests.length} Tests
                                        </span>
                                    </div>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold border"
                                    style={selectedBranch.status === 'active' ? {
                                        backgroundColor: '#dcfce7',
                                        color: '#166534',
                                        borderColor: '#bbf7d0'
                                    } : {
                                        backgroundColor: '#fee2e2',
                                        color: '#991b1b',
                                        borderColor: '#fecaca'
                                    }}>
                                    {selectedBranch.status.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Quick Info Cards */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="text-center p-4 rounded-lg border"
                                    style={{
                                        backgroundColor: '#eff6ff',
                                        borderColor: '#bfdbfe'
                                    }}>
                                    <HomeOutlined style={{
                                        fontSize: '1.5rem',
                                        color: '#3b82f6',
                                        marginBottom: '0.5rem'
                                    }} />
                                    <div className="font-semibold"
                                        style={{ color: '#111827' }}>Home Collection</div>
                                    <div className="text-sm"
                                        style={{
                                            color: selectedBranch.homeCollectionService.isAvailable
                                                ? '#166534'
                                                : '#dc2626'
                                        }}>
                                        {selectedBranch.homeCollectionService.isAvailable ? 'Available' : 'Not Available'}
                                    </div>
                                </div>
                                <div className="text-center p-4 rounded-lg border"
                                    style={{
                                        backgroundColor: '#f0fdf4',
                                        borderColor: '#bbf7d0'
                                    }}>
                                    <ShopOutlined style={{
                                        fontSize: '1.5rem',
                                        color: '#22c55e',
                                        marginBottom: '0.5rem'
                                    }} />
                                    <div className="font-semibold"
                                        style={{ color: '#111827' }}>Lab Visit</div>
                                    <div className="text-sm"
                                        style={{
                                            color: selectedBranch.labVisitServiceAvailable
                                                ? '#166534'
                                                : '#dc2626'
                                        }}>
                                        {selectedBranch.labVisitServiceAvailable ? 'Available' : 'Not Available'}
                                    </div>
                                </div>
                                <div className="text-center p-4 rounded-lg border"
                                    style={{
                                        backgroundColor: '#f5f3ff',
                                        borderColor: '#ddd6fe'
                                    }}>
                                    <ClockCircleOutlined style={{
                                        fontSize: '1.5rem',
                                        color: '#8b5cf6',
                                        marginBottom: '0.5rem'
                                    }} />
                                    <div className="font-semibold"
                                        style={{ color: '#111827' }}>Since</div>
                                    <div className="text-sm"
                                        style={{ color: '#4b5563' }}>
                                        {moment(selectedBranch.registrationDate).format('MMM YYYY')}
                                    </div>
                                </div>
                            </div>

                            {/* Main Info Grid */}
                            <div className="grid grid-cols-3 gap-6">
                                {/* Branch Information */}
                                <div className="col-span-2 border rounded-lg shadow-sm">
                                    <div className="px-4 py-3 border-b rounded-t-lg"
                                        style={{
                                            backgroundColor: '#f9fafb',
                                            borderColor: '#e5e7eb'
                                        }}>
                                        <h3 className="font-semibold flex items-center gap-2"
                                            style={{ color: '#111827' }}>
                                            <EnvironmentOutlined style={{ color: '#3b82f6' }} />
                                            Branch Information
                                        </h3>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div className="flex">
                                            <span className="w-24 text-sm font-medium"
                                                style={{ color: '#6b7280' }}>ID:</span>
                                            <code className="bg-gray-100 px-2 py-1 rounded text-xs border">
                                                {selectedBranch.labCenterBranchId}
                                            </code>
                                        </div>
                                        <div className="flex">
                                            <span className="w-24 text-sm font-medium"
                                                style={{ color: '#6b7280' }}>Email:</span>
                                            <a href={`mailto:${selectedBranch.email}`}
                                                className="hover:text-blue-800 text-sm"
                                                style={{ color: '#2563eb' }}>
                                                {selectedBranch.email}
                                            </a>
                                        </div>
                                        <div className="flex">
                                            <span className="w-24 text-sm font-medium"
                                                style={{ color: '#6b7280' }}>Website:</span>
                                            <a href={selectedBranch.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-blue-800 text-sm"
                                                style={{ color: '#2563eb' }}>
                                                {selectedBranch.website}
                                            </a>
                                        </div>
                                        <div className="flex">
                                            <span className="w-24 text-sm font-medium"
                                                style={{ color: '#6b7280' }}>Address:</span>
                                            <div className="text-sm"
                                                style={{ color: '#374151' }}>
                                                {selectedBranch.address}<br />
                                                {selectedBranch.city}, {selectedBranch.state}<br />
                                                {selectedBranch.country} - {selectedBranch.pincode}
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <span className="w-24 text-sm font-medium"
                                                style={{ color: '#6b7280' }}>Location:</span>
                                            <span className="text-xs font-mono"
                                                style={{ color: '#4b5563' }}>
                                                {selectedBranch.location.coordinates[1].toFixed(4)}°N,
                                                {selectedBranch.location.coordinates[0].toFixed(4)}°E
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Home Collection */}
                                <div className="border rounded-lg shadow-sm">
                                    <div className="px-4 py-3 border-b rounded-t-lg"
                                        style={{
                                            backgroundColor: '#fffbeb',
                                            borderColor: '#fde68a'
                                        }}>
                                        <h3 className="font-semibold flex items-center gap-2"
                                            style={{ color: '#111827' }}>
                                            <CarOutlined style={{ color: '#f97316' }} />
                                            Home Collection
                                        </h3>
                                    </div>
                                    <div className="p-4">
                                        {selectedBranch.homeCollectionService.isAvailable ? (
                                            <div className="space-y-3">
                                                <div className="text-center p-3 rounded-lg"
                                                    style={{ backgroundColor: '#ffedd5' }}>
                                                    <div className="text-2xl font-bold"
                                                        style={{ color: '#111827' }}>
                                                        {selectedBranch.homeCollectionService.serviceRadius} km
                                                    </div>
                                                    <div className="text-xs"
                                                        style={{ color: '#4b5563' }}>Service Radius</div>
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span style={{ color: '#374151' }}>Within Radius:</span>
                                                        <span className="font-semibold"
                                                            style={{ color: '#166534' }}>
                                                            ₹{selectedBranch.homeCollectionService.charges.withinRadius}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span style={{ color: '#374151' }}>Beyond Radius:</span>
                                                        <span className="font-semibold"
                                                            style={{ color: '#ea580c' }}>
                                                            ₹{selectedBranch.homeCollectionService.charges.beyondRadius}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4"
                                                style={{ color: '#6b7280' }}>
                                                <div className="font-medium">Not Available</div>
                                                <div className="text-xs">This branch doesn't offer home collection</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Tests Section */}
                            <div className="mt-6 border rounded-lg shadow-sm">
                                <div className="px-4 py-3 border-b rounded-t-lg"
                                    style={{
                                        backgroundColor: '#f5f3ff',
                                        borderColor: '#e5e7eb'
                                    }}>
                                    <h3 className="font-semibold flex items-center gap-2"
                                        style={{ color: '#111827' }}>
                                        <ExperimentOutlined style={{ color: '#8b5cf6' }} />
                                        Available Tests ({selectedBranch.tests.length})
                                    </h3>
                                </div>
                                <div className="p-4 max-h-48 overflow-y-auto">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {selectedBranch.tests.map((test) => (
                                            <div key={test._id}
                                                className="border rounded-md px-3 py-2 text-sm hover:bg-blue-50 hover:border-blue-200 transition-colors"
                                                style={{
                                                    backgroundColor: '#f9fafb',
                                                    borderColor: '#e5e7eb',
                                                    color: '#374151'
                                                }}>
                                                {test.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t flex justify-end"
                            style={{
                                backgroundColor: '#f9fafb',
                                borderColor: '#e5e7eb'
                            }}>
                            <Button
                                onClick={() => setViewModalVisible(false)}
                                className="px-6 py-2 rounded-lg font-medium transition-colors hover:bg-gray-700"
                                style={{
                                    backgroundColor: '#4b5563',
                                    color: '#ffffff'
                                }}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Login Branch Modal */}
            <Modal
                title={
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '18px',
                        fontWeight: 600
                    }}>
                        <LockOutlined style={{ marginRight: 12, color: '#1890ff' }} />
                        Branch Login
                    </div>
                }
                open={loginModalVisible}
                onCancel={() => {
                    setLoginModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={450}
                style={{ top: '10vh' }}
                styles={{
                    body: { padding: '32px' },
                    header: { padding: '20px 24px', borderBottom: '1px solid #f0f0f0' }
                }}
            >
                {selectedBranch && (
                    <div>
                        <div style={{
                            textAlign: 'center',
                            marginBottom: 32,
                            padding: 20,
                            background: '#f8f9fa',
                            borderRadius: 12
                        }}>
                            <Typography variant="h6" style={{
                                color: '#1890ff',
                                marginBottom: 8,
                                fontWeight: 600
                            }}>
                                {selectedBranch.name}
                            </Typography>
                            <Typography variant="body2" style={{
                                color: '#8c8c8c',
                                fontSize: '14px'
                            }}>
                                {selectedBranch.labCenter.name}
                            </Typography>
                        </div>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleLogin}
                        >
                            <Form.Item
                                label={<span style={{ fontWeight: 500 }}>Branch Password</span>}
                                name="password"
                                rules={[
                                    { required: true, message: 'Please enter the branch password!' },
                                    { min: 6, message: 'Password must be at least 6 characters!' }
                                ]}
                            >
                                <Password
                                    placeholder="Enter branch password"
                                    size="large"
                                    prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                                    style={{ borderRadius: 8 }}
                                />
                            </Form.Item>

                            <Form.Item style={{ marginTop: 32, textAlign: 'center' }}>
                                <Space size="middle">
                                    <Button
                                        size="large"
                                        onClick={() => {
                                            setLoginModalVisible(false);
                                            form.resetFields();
                                        }}
                                        style={{
                                            borderRadius: 8,
                                            paddingLeft: 24,
                                            paddingRight: 24
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loginLoading}
                                        icon={<LoginOutlined />}
                                        size="large"
                                        style={{
                                            borderRadius: 8,
                                            paddingLeft: 24,
                                            paddingRight: 24,
                                            fontWeight: 500
                                        }}
                                    >
                                        Login to Branch
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </div>
                )}
            </Modal>

            <Drawer
                title="Add New Lab Branch"
                placement="right"
                width={500}
                open={addBranchDrawerVisible}
                onClose={() => setAddBranchDrawerVisible(false)}
                destroyOnClose
            >
                <AddLabBranch
                    onSuccess={() => {
                        setAddBranchDrawerVisible(false);
                        fetchLabBranches();
                    }}
                    onClose={() => setAddBranchDrawerVisible(false)}
                />
            </Drawer>
        </div>
    );
};

export default LabCenterBranchesMainBranch;