import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, message, Modal, Spin, Switch, Badge, Tooltip } from "antd";
import { InputAdornment, MenuItem, TextField, Card, CardContent, Typography, Box, Grid, Chip, Divider ,  IconButton } from "@mui/material";
import { PlusOutlined, SearchOutlined, LoginOutlined, FilterOutlined } from "@ant-design/icons";
import { fetchData, postData } from "../../../api/apiService";
import { MdEdit, MdLocationOn, MdBed, MdMeetingRoom, MdDateRange } from "react-icons/md";
import AddBranch from "./AddBranch";
import { FaUserDoctor, FaHospital, FaPhone, FaEnvelope, FaIdCard } from "react-icons/fa6";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { updatingUserProfile } from "../../../redux/action";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const HospitalMainBranches = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [total, setTotal] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [branchDrawer, setBranchDrawer] = useState(false);
    const [loading, setLoading] = useState(false);
    const [branchData, setBranchData] = useState({});
    const [branchRecord, setBranchRecord] = useState(null);
    const [warningModal, setWarningModal] = useState(false);
    const [loginModal, setLoginModal] = useState(false);
    const [modalLoad, setModalLoad] = useState(false);
    const [editId, setEditId] = useState(null);
    const [branches, setBranches] = useState([]);
    const [hospitalData, setHospitalData] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("0");
    const [selectedHospital, setSelectedHospital] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [showFullAddress, setShowFullAddress] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const [loginCredentials, setLoginCredentials] = useState({
        branchName: "",
        password: ""
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const fetchBranchesList = async () => {
        const payload = {
            page: currentPage,
            pageSize: pageSize,
            search: searchQuery,
            hospitalId: selectedHospital,
            sort: selectedFilter,
        };
        try {
            setLoading(true);
            const response = await postData(
                "/api/hospital/list-of-branch-by-hospital",
                payload
            );
            if (response?.responseCode == 200) {
                setBranchData(response?.data || {});
                setBranches(response?.data?.branches || []);
                setTotal(response?.data?.length || 1);
            } else if (response?.responseCode == 400) {
                message.error(response?.message || "Something went wrong");
            } else {
                message.error(response?.message || "Something went wrong");
            }
        } catch (error) {
            message.error(error?.message || "Failed to fetch branches List");
        } finally {
            setLoading(false);
        }
    };

    const branchChangeStatus = async () => {
        try {
            const payload = {
                branchId: branchRecord?._id,
            };
            setModalLoad(true);
            const response = await postData("/api/admin/toggle-branch", payload);
            if (response?.responseCode == 200) {
                setWarningModal(false);
                fetchBranchesList();
                message.success("Branch status updated successfully");
            } else if (response?.responseCode == 400) {
                message.error(response?.message || "Something went wrong");
            } else {
                message.error(response?.message || "Something went wrong");
            }
        } catch (error) {
            message.error(error?.message || "Failed to change the status");
        } finally {
            setModalLoad(false);
        }
    };

    const handleLogin = async () => {
        if (!loginCredentials.password) {
            message.error("Please enter password");
            return;
        }
        try {
            setModalLoad(true);
            const payload = {
                branchId: selectedBranch?._id,
                password: loginCredentials.password
            };
            const loginResponse = await postData(
                "/api/hospital/branch-login-by-hospital",
                payload
            );
            if (loginResponse?.responseCode === 200) {
                message.success(loginResponse?.data?.message || "Successfully signed in");
                const token = loginResponse?.data?.token;
                const branchData = loginResponse?.data?.branch;
                localStorage.setItem("adminToken", token);
                localStorage.setItem("userRole", "branch");
                localStorage.setItem("branchId", branchData?._id);
                const loginTime = new Date();
                const date = loginTime.getDate().toString().padStart(2, "0");
                const month = months[loginTime.getMonth()];
                const year = loginTime.getFullYear();
                const hours = loginTime.getHours().toString().padStart(2, "0");
                const minutes = loginTime.getMinutes().toString().padStart(2, "0");
                const ampm = hours >= 12 ? "pm" : "am";
                const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
                const formattedLoginTime = `${date},${month} ${year}-${formattedHours}:${minutes} ${ampm}`;
                const userData = {
                    ...branchData,
                    loginTime: formattedLoginTime
                };
                dispatch(updatingUserProfile(userData));
                message.success("Branch login successful!");
                setLoginModal(false);
                setLoginCredentials({ branchName: "", password: "" });
                setSelectedBranch(null);
                navigate("/dashboard");
            } else {
                message.error(loginResponse?.message || "Login failed");
            }
        } catch (error) {
            message.error(error?.message || "Login failed");
        } finally {
            setModalLoad(false);
        }
    };

    const openLoginModal = (branch) => {
        setSelectedBranch(branch);
        setLoginCredentials({
            branchName: branch.branchName || "",
            password: ""
        });
        setLoginModal(true);
    };

    const handleAddBranch = () => {
        setEditId(null);
        setBranchDrawer(true);
    };

    const toggleAddressView = (branchId) => {
        setShowFullAddress(prev => ({
            ...prev,
            [branchId]: !prev[branchId]
        }));
    };

    const openLocationInMaps = (branch) => {
        const latitude = branch.location?.coordinates?.[0];
        const longitude = branch.location?.coordinates?.[1];
        if (latitude && longitude) {
            const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
            window.open(url, "_blank");
        } else {
            message.warning("Location coordinates not available");
        }
    };

    useEffect(() => {
        fetchBranchesList();
    }, [selectedFilter, currentPage, pageSize, selectedHospital, searchQuery]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setSearchQuery(searchInput);
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [searchInput]);

    const BranchCard = ({ branch }) => (
        <Card
            sx={{
                height: '100%',
                minHeight: '480px',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #e8e8e8',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                opacity: branch.status === 'inactive' ? 0.7 : 1,
                filter: branch.status === 'inactive' ? 'grayscale(0.3)' : 'none'
            }}
        >
            <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
                {/* Header with Status and Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Badge
                        status={branch.status === 'active' ? 'success' : 'error'}
                        text={
                            <Typography variant="caption" sx={{
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                {branch.status === 'active' ? 'Active' : 'Inactive'}
                            </Typography>
                        }
                    />
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Tooltip title="Edit Branch">
                            <Button
                                type="text"
                                icon={<MdEdit size={16} />}
                                size="small"
                                disabled={branch?.status === "inactive"}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditId(branch?._id);
                                    setBranchDrawer(true);
                                }}
                                style={{
                                    color: branch?.status === "inactive" ? '#ccc' : '#1890ff',
                                    borderRadius: '8px'
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={`${branch.status === 'active' ? 'Deactivate' : 'Activate'} Branch`}>
                            <Switch
                                size="small"
                                checked={branch.status === "active"}
                                onChange={(checked, e) => {
                                    e.stopPropagation();
                                    setBranchRecord(branch);
                                    setWarningModal(true);
                                }}
                            />
                        </Tooltip>
                    </Box>
                </Box>

                {/* Branch Name and Code */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h5" component="h3" sx={{
                        fontWeight: 'bold',
                        color: '#1890ff',
                        textTransform: 'capitalize',
                        lineHeight: 1.3
                    }}>
                        {branch.branchName || "N/A"}
                    </Typography>
                    <Chip
                        icon={<FaIdCard size={12} />}
                        label={`Code: ${branch.branchCode || "N/A"}`}
                        variant="outlined"
                        size="small"
                        sx={{
                            backgroundColor: '#f0f8ff',
                            borderColor: '#1890ff',
                            color: '#1890ff',
                            fontWeight: 'medium',
                            borderRadius: 2,
                        }}
                    />
                </Box>

                {/* Facilities Grid */}
                <Grid container spacing={1} sx={{ mb: 1 }}>
                    <Grid item xs={6}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 1.5,
                            backgroundColor: '#f6ffed',
                            borderRadius: '8px',
                            border: '1px solid #b7eb8f'
                        }}>
                            <MdMeetingRoom size={18} color="#52c41a" />
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#52c41a', lineHeight: 1 }}>
                                    {branch.noOfRooms || 0}
                                </Typography>
                                <Typography variant="caption" color="#666">
                                    Rooms
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 1.5,
                            backgroundColor: '#fff2e8',
                            borderRadius: '8px',
                            border: '1px solid #ffd591'
                        }}>
                            <MdBed size={18} color="#fa8c16" />
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fa8c16', lineHeight: 1 }}>
                                    {branch.noOfBeds || 0}
                                </Typography>
                                <Typography variant="caption" color="#666">
                                    Beds
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 1.5,
                            backgroundColor: '#e6f4ff',
                            borderRadius: '8px',
                            border: '1px solid #91caff'
                        }}>
                            <FaUserDoctor size={18} color="#1890ff" />
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1890ff', lineHeight: 1 }}>
                                    {branch.doctors?.length || 0}
                                </Typography>
                                <Typography variant="caption" color="#666">
                                    Doctors
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                {/* Hospital Information */}
                <Box sx={{ mb: 0 }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                        p: 1,
                        backgroundColor: '#f9f9f9',
                        borderRadius: '6px'
                    }}>
                        <FaHospital size={14} color="#722ed1" />
                        <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#333' }}>
                            {branch.hospitalId?.name || "N/A"}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pl: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FaEnvelope size={11} color="#666" />
                            <Typography variant="caption" color="#666">
                                {branch.hospitalId?.email || "N/A"}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FaPhone size={11} color="#666" />
                            <Typography variant="caption" color="#666">
                                {branch.hospitalId?.phone || "N/A"}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Address Section */}
                <Box sx={{ mb: 2 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            cursor: 'pointer',
                            '&:hover': {
                                opacity: 0.8
                            }
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            // Open Google Maps with the branch address
                            const encodedAddress = encodeURIComponent(branch.address || '');
                            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
                            window.open(mapsUrl, '_blank');
                        }}
                    >
                        <MdLocationOn size={16} color="#ff7875" />
                        <Typography
                            variant="body2"
                            color="#1890ff"
                            sx={{
                                textDecoration: 'underline',
                                '&:hover': {
                                    textDecoration: 'none'
                                }
                            }}
                        >
                            Location
                        </Typography>
                    </Box>
                </Box>

                {/* Registration Information */}
                <Box sx={{ mb: 2 }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                        p: 1,
                        backgroundColor: '#fafafa',
                        borderRadius: '6px'
                    }}>
                        <MdDateRange size={14} color="#666" />
                        <Typography variant="caption" color="#666" sx={{ fontWeight: 'medium' }}>
                            Reg. No: {branch.registrationNumber || "N/A"}
                        </Typography>
                    </Box>
                    <Typography variant="caption" color="#666" sx={{ pl: 1 }}>
                        Registered: {branch.registrationDate ? moment(branch.registrationDate).format("DD MMM, YYYY") : "N/A"}
                    </Typography>
                </Box>

                {/* GSTIN */}
                {branch.branchGSTIN && (
                    <Chip
                        label={`GSTIN: ${branch.branchGSTIN}`}
                        variant="outlined"
                        size="small"
                        sx={{
                            mb: 2,
                            backgroundColor: '#f0f0f0',
                            display: 'block',
                            width: 'fit-content',
                            borderRadius: 2
                        }}
                    />
                )}
                {/* Login Button */}
                <Box sx={{ marginTop: 'auto' }}>
                    <Button
                        type="primary"
                        icon={<LoginOutlined />}
                        block
                        disabled={branch?.status === "inactive"}
                        onClick={(e) => {
                            e.stopPropagation();
                            openLoginModal(branch);
                        }}
                        style={{
                            height: '44px',
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '14px',
                            background: branch?.status === "inactive"
                                ? '#f5f5f5'
                                : 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                            border: 'none',
                            boxShadow: branch?.status === "inactive"
                                ? 'none'
                                : '0 4px 12px rgba(24,144,255,0.3)'
                        }}
                    >
                        Login to Branch
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <div>
            <Spin spinning={loading}>
                <div className='flex flex-col gap-6'>
                    <div className='flex items-center justify-between gap-4 flex-wrap p-2'>
                        <div className='flex items-center gap-3 flex-1 min-w-[300px]'>
                            <TextField
                                id='outlined-basic'
                                label='Search Branches'
                                variant='outlined'
                                size='small'
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                type='search'
                                sx={{
                                    minWidth: '320px',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px'
                                    }
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <SearchOutlined style={{ color: '#1890ff' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>

                        <div className='flex items-center gap-3'>
                            <TextField
                                select
                                size='small'
                                label='Sort by Date'
                                placeholder='Select sorting order'
                                sx={{
                                    minWidth: '180px',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px'
                                    }
                                }}
                                value={selectedFilter}
                                onChange={(e) => setSelectedFilter(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FilterOutlined style={{ color: '#666' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            >
                                <MenuItem value='0'>Newest First</MenuItem>
                                <MenuItem value='1'>Oldest First</MenuItem>
                            </TextField>

                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAddBranch}
                            >
                                Add Branch
                            </Button>
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className='max-h-[70vh] pr-2'>
                        {branches.length > 0 ? (
                            <Grid container spacing={3}>
                                {branches.map((branch) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={branch._id}>
                                        <BranchCard branch={branch} />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Box sx={{
                                textAlign: 'center',
                                py: 8,
                                background: 'white',
                                borderRadius: '16px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                            }}>
                                <FaHospital size={64} color="#d9d9d9" style={{ marginBottom: '16px' }} />
                                <Typography variant="h5" sx={{ mb: 2, color: '#666' }}>
                                    No branches found
                                </Typography>
                                <Typography variant="body1" color="#999" sx={{ mb: 3 }}>
                                    Try adjusting your search criteria or add a new branch
                                </Typography>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={handleAddBranch}
                                    size="large"
                                    style={{
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                                        border: 'none',
                                        boxShadow: '0 4px 12px rgba(82,196,26,0.3)'
                                    }}
                                >
                                    Add Your First Branch
                                </Button>
                            </Box>
                        )}
                    </div>

                    {/* Pagination */}
                    {branches.length > 0 && Math.ceil(total / pageSize) > 1 && (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 2,
                            background: 'white',
                            borderRadius: '16px',
                            p: 3,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            border: '1px solid #f0f0f0'
                        }}>
                            <Button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                style={{ borderRadius: '10px', height: '40px', minWidth: '100px' }}
                            >
                                Previous
                            </Button>

                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                px: 3,
                                py: 1,
                                backgroundColor: '#f8fafc',
                                borderRadius: '10px',
                                border: '1px solid #e8e8e8'
                            }}>
                                <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#333' }}>
                                    Page {currentPage} of {Math.ceil(total / pageSize)}
                                </Typography>
                            </Box>

                            <Button
                                disabled={currentPage >= Math.ceil(total / pageSize)}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                style={{ borderRadius: '10px', height: '40px', minWidth: '100px' }}
                            >
                                Next
                            </Button>
                        </Box>
                    )}

                    {/* Status Toggle Modal */}
                    <Modal
                        visible={warningModal}
                        footer={null}
                        centered
                        closeIcon={false}
                        width={420}
                        style={{ borderRadius: '16px' }}
                    >
                        <Spin spinning={modalLoad}>
                            <Box sx={{ textAlign: 'center', p: 2 }}>
                                <Box sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    backgroundColor: branchRecord?.status === "active" ? '#fff2f0' : '#f6ffed',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px',
                                    border: `3px solid ${branchRecord?.status === "active" ? '#ff7875' : '#52c41a'}`
                                }}>
                                    <Typography variant="h4">
                                        {branchRecord?.status === "active" ? '⚠️' : '✅'}
                                    </Typography>
                                </Box>

                                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
                                    {branchRecord?.status === "active" ? "Deactivate" : "Activate"} Branch
                                </Typography>

                                <Typography variant="body1" color="#666" sx={{ mb: 3, lineHeight: 1.6 }}>
                                    Are you sure you want to{" "}
                                    <strong style={{ color: branchRecord?.status === "active" ? '#ff4d4f' : '#52c41a' }}>
                                        {branchRecord?.status === "active" ? "deactivate" : "activate"}
                                    </strong>
                                    {" "}the branch <strong>"{branchRecord?.branchName}"</strong>?
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                    <Button
                                        onClick={() => {
                                            setBranchRecord(null);
                                            setWarningModal(false);
                                        }}
                                        style={{ minWidth: '100px', height: '40px', borderRadius: '10px' }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type='primary'
                                        onClick={branchChangeStatus}
                                        style={{
                                            minWidth: '100px',
                                            height: '40px',
                                            borderRadius: '10px',
                                            background: branchRecord?.status === "active"
                                                ? 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)'
                                                : 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                                            border: 'none'
                                        }}
                                    >
                                        {branchRecord?.status === "active" ? "Deactivate" : "Activate"}
                                    </Button>
                                </Box>
                            </Box>
                        </Spin>
                    </Modal>

                    {/* Login Modal */}
                    <Modal
                        title={null}
                        visible={loginModal}
                        footer={null}
                        centered
                        closeIcon={true}
                        onCancel={() => {
                            setLoginModal(false);
                            setLoginCredentials({ branchName: "", password: "" });
                            setSelectedBranch(null);
                        }}
                        width={450}
                        style={{ borderRadius: '16px' }}
                    >
                        <Spin spinning={modalLoad}>
                            <Box sx={{ p: 0 }}>
                                <Box sx={{ textAlign: 'center', mb: 2 }}>
                                    <Box sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        backgroundColor: '#e6f7ff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 16px',
                                        border: '3px solid #1890ff'
                                    }}>
                                        <LoginOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
                                    </Box>

                                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>
                                        Branch Login
                                    </Typography>
                                    <Typography variant="body2" color="#666">
                                        Login to <strong>{selectedBranch?.branchName}</strong>
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 1 }}>
                                    <TextField
                                        fullWidth
                                        label="Branch Name"
                                        variant="outlined"
                                        value={loginCredentials.branchName}
                                        onChange={(e) => setLoginCredentials({
                                            ...loginCredentials,
                                            branchName: e.target.value
                                        })}
                                        margin="normal"
                                        disabled
                                        sx={{
                                            mb: 0,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px'
                                            }
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Password"
                                        type={showPassword ? "text" : "password"}
                                        variant="outlined"
                                        value={loginCredentials.password}
                                        onChange={(e) => setLoginCredentials({
                                            ...loginCredentials,
                                            password: e.target.value
                                        })}
                                        margin="normal"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleLogin();
                                            }
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px'
                                            }
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                        aria-label="toggle password visibility"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                    <Button
                                        onClick={() => {
                                            setLoginModal(false);
                                            setLoginCredentials({ branchName: "", password: "" });
                                            setSelectedBranch(null);
                                        }}
                                        style={{ minWidth: '120px', height: '44px', borderRadius: '12px' }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="primary"
                                        onClick={handleLogin}
                                        icon={<LoginOutlined />}
                                        style={{
                                            minWidth: '120px',
                                            height: '44px',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                                            border: 'none',
                                            boxShadow: '0 4px 12px rgba(24,144,255,0.3)'
                                        }}
                                    >
                                        Login
                                    </Button>
                                </Box>
                            </Box>
                        </Spin>
                    </Modal>

                    <AddBranch
                        branchDrawer={branchDrawer}
                        setBranchDrawer={setBranchDrawer}
                        fetchBranchesList={fetchBranchesList}
                        editId={editId}
                        setEditId={setEditId}
                    />
                </div>
            </Spin>
        </div>
    );
};

export default HospitalMainBranches;