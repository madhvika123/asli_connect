import React, { useState, useEffect } from "react";
import { Button, message, Spin, Card, Space, Typography, Row, Col, Switch } from "antd";
import { TextField, InputAdornment, MenuItem, Checkbox, FormControlLabel } from "@mui/material";
import { 
    MdLocationOn, 
    MdEmail, 
    MdPhone, 
    MdWeb, 
    MdBusiness,
    MdSave,
    MdClose,
    MdPerson,
    MdLock,
    MdScience,
    MdHome,
    MdLocalHospital
} from "react-icons/md";
import { postData, fetchData } from "../../api/apiService";
import LocationSearchMui from "../../utils/location";

const { Title, Text } = Typography;

const AddLabCenterBranch = ({ currentBranch, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    
    // Lab Centers and Tests dropdown data
    const [labCenters, setLabCenters] = useState([]);
    const [availableTests, setAvailableTests] = useState([]);
    
    // Lab Branch Data
    const [labBranchData, setLabBranchData] = useState({
        labcenterId: "",
        name: "",
        email: "",
        phone: "",
        website: "",
        address: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
        latitude: "",
        longitude: "",
        tests: [],
        homeCollectionService: {
            isAvailable: false,
            serviceRadius: 10,
            charges: {
                withinRadius: 0,
                beyondRadius: 50
            }
        },
        labVisitServiceAvailable: true
    });

    // Lab Branch User Data
    const [labBranchUserData, setLabBranchUserData] = useState({
        userName: "",
        userPhone: "",
        userEmail: "",
        password: "",
        userLatitude: "",
        userLongitude: ""
    });

    const [errors, setErrors] = useState({});
    const [addressObject, setAddressObject] = useState({});

    // Fetch dropdown data on component mount
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                setInitialLoading(true);
                
                // Fetch lab centers
                const labCentersResponse = await fetchData("/api/admin/list-of-lab-center-dropdown");
                if (labCentersResponse?.responseCode === 200) {
                    setLabCenters(labCentersResponse.data || []);
                }

                // Fetch available tests
                const testsResponse = await fetchData("/api/admin/list-of-lab-test-dropdown");
                if (testsResponse?.responseCode === 200) {
                    setAvailableTests(testsResponse.data || []);
                }
            } catch (error) {
                message.error("Failed to fetch dropdown data");
            } finally {
                setInitialLoading(false);
            }
        };

        fetchDropdownData();
    }, []);

    // Populate form data when editing
    useEffect(() => {
        if (currentBranch) {
            setLabBranchData({
                labcenterId: currentBranch.labCenter?._id || currentBranch.labCenter || "",
                name: currentBranch.name || "",
                email: currentBranch.email || "",
                phone: currentBranch.phone || "",
                website: currentBranch.website || "",
                address: currentBranch.address || "",
                city: currentBranch.city || "",
                state: currentBranch.state || "",
                country: currentBranch.country || "India",
                pincode: currentBranch.pincode || "",
                latitude: currentBranch.location?.coordinates?.[1] || "",
                longitude: currentBranch.location?.coordinates?.[0] || "",
                tests: currentBranch.tests?.map(test => test._id || test) || [],
                homeCollectionService: {
                    isAvailable: currentBranch.homeCollectionService?.isAvailable || false,
                    serviceRadius: currentBranch.homeCollectionService?.serviceRadius || 10,
                    charges: {
                        withinRadius: currentBranch.homeCollectionService?.charges?.withinRadius || 0,
                        beyondRadius: currentBranch.homeCollectionService?.charges?.beyondRadius || 50
                    }
                },
                labVisitServiceAvailable: currentBranch.labVisitServiceAvailable || true
            });

            // Don't populate user data for editing (security)
            if (!currentBranch._id) {
                setLabBranchUserData({
                    userName: "",
                    userPhone: "",
                    userEmail: "",
                    password: "",
                    userLatitude: "",
                    userLongitude: ""
                });
            }
        }
    }, [currentBranch]);

    const handleBranchInputChange = (field) => (event) => {
        const value = event.target.value;
        setLabBranchData(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    const handleUserInputChange = (field) => (event) => {
        const value = event.target.value;
        setLabBranchUserData(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    const handleHomeCollectionToggle = (checked) => {
        setLabBranchData(prev => ({
            ...prev,
            homeCollectionService: {
                ...prev.homeCollectionService,
                isAvailable: checked
            }
        }));
    };

    const handleHomeCollectionInputChange = (field) => (event) => {
        const value = field === 'serviceRadius' ? Number(event.target.value) : event.target.value;
        
        if (field === 'withinRadius' || field === 'beyondRadius') {
            setLabBranchData(prev => ({
                ...prev,
                homeCollectionService: {
                    ...prev.homeCollectionService,
                    charges: {
                        ...prev.homeCollectionService.charges,
                        [field]: Number(value)
                    }
                }
            }));
        } else {
            setLabBranchData(prev => ({
                ...prev,
                homeCollectionService: {
                    ...prev.homeCollectionService,
                    [field]: value
                }
            }));
        }
    };

    const handleTestSelection = (testId) => {
        setLabBranchData(prev => ({
            ...prev,
            tests: prev.tests.includes(testId)
                ? prev.tests.filter(id => id !== testId)
                : [...prev.tests, testId]
        }));
    };

    // Location handlers
    const setLatitude = (lat) => {
        setLabBranchData(prev => ({ ...prev, latitude: lat }));
        setLabBranchUserData(prev => ({ ...prev, userLatitude: lat }));
    };

    const setLongitude = (lng) => {
        setLabBranchData(prev => ({ ...prev, longitude: lng }));
        setLabBranchUserData(prev => ({ ...prev, userLongitude: lng }));
    };

    const setArea = (area) => {
        console.log("Area set:", area);
    };

    const setAddress = (address) => {
        setLabBranchData(prev => ({ ...prev, address: address }));
        setErrors(prev => ({
            ...prev,
            address: "",
            city: "",
            state: "",
            pincode: ""
        }));
    };

    const setAddressObjectHandler = (addressObj) => {
        setAddressObject(addressObj);
        setLabBranchData(prev => ({
            ...prev,
            city: addressObj.city || prev.city,
            state: addressObj.state || prev.state,
            country: addressObj.country || prev.country,
            pincode: addressObj.zip || prev.pincode
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Lab Branch validation
        if (!labBranchData.labcenterId) newErrors.labcenterId = "Please select a lab center";
        if (!labBranchData.name.trim()) newErrors.name = "Branch name is required";
        if (!labBranchData.email.trim()) newErrors.email = "Branch email is required";
        else if (!/\S+@\S+\.\S+/.test(labBranchData.email)) newErrors.email = "Invalid email format";
        if (!labBranchData.phone.trim()) newErrors.phone = "Branch phone number is required";
        else if (!/^\d{10}$/.test(labBranchData.phone)) newErrors.phone = "Phone number must be 10 digits";
        if (!labBranchData.address.trim()) newErrors.address = "Address is required";
        if (!labBranchData.city.trim()) newErrors.city = "City is required";
        if (!labBranchData.state.trim()) newErrors.state = "State is required";
        if (!labBranchData.pincode.trim()) newErrors.pincode = "Pincode is required";
        else if (!/^\d{6}$/.test(labBranchData.pincode)) newErrors.pincode = "Pincode must be 6 digits";
        if (labBranchData.tests.length === 0) newErrors.tests = "Please select at least one test";

        // Home collection validation
        if (labBranchData.homeCollectionService.isAvailable) {
            if (!labBranchData.homeCollectionService.serviceRadius || labBranchData.homeCollectionService.serviceRadius <= 0) {
                newErrors.serviceRadius = "Service radius is required and must be greater than 0";
            }
        }

        // User validation (only for new branches)
        if (!currentBranch) {
            if (!labBranchUserData.userName.trim()) newErrors.userName = "User name is required";
            if (!labBranchUserData.userPhone.trim()) newErrors.userPhone = "User phone number is required";
            else if (!/^\d{10}$/.test(labBranchUserData.userPhone)) newErrors.userPhone = "User phone number must be 10 digits";
            if (!labBranchUserData.userEmail.trim()) newErrors.userEmail = "User email is required";
            else if (!/\S+@\S+\.\S+/.test(labBranchUserData.userEmail)) newErrors.userEmail = "Invalid user email format";
            if (!labBranchUserData.password.trim()) newErrors.password = "Password is required";
            else if (labBranchUserData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            message.error("Please fix the validation errors");
            return;
        }

        try {
            setLoading(true);
            
            const payload = {
                labCenterBranchData: {
                    labcenterId: labBranchData.labcenterId,
                    name: labBranchData.name,
                    phone: labBranchData.phone,
                    email: labBranchData.email,
                    tests: labBranchData.tests,
                    homeCollectionService: labBranchData.homeCollectionService,
                    labVisitServiceAvailable: labBranchData.labVisitServiceAvailable,
                    logo: "",
                    image: [],
                    website: labBranchData.website || "",
                    address: labBranchData.address,
                    city: labBranchData.city,
                    state: labBranchData.state,
                    country: labBranchData.country,
                    pincode: labBranchData.pincode,
                    ...(labBranchData.latitude && labBranchData.longitude && {
                        location: {
                            type: "Point",
                            coordinates: [parseFloat(labBranchData.longitude), parseFloat(labBranchData.latitude)]
                        }
                    })
                }
            };

            // Add user data only for new branches
            if (!currentBranch) {
                payload.labCenterBranchUserData = {
                    userEmail: labBranchUserData.userEmail,
                    userPhone: labBranchUserData.userPhone,
                    password: labBranchUserData.password,
                    userName: labBranchUserData.userName,
                    ...(labBranchUserData.userLatitude && labBranchUserData.userLongitude && {
                        userLocation: {
                            type: "Point",
                            coordinates: [parseFloat(labBranchUserData.userLongitude), parseFloat(labBranchUserData.userLatitude)]
                        }
                    })
                };
            }

            // Add ID for update (if editing)
            if (currentBranch?._id) {
                payload.labCenterBranchData.branchId = currentBranch._id;
            }

            const endpoint = currentBranch 
                ? "/api/admin/update-lab-center-branch" 
                : "/api/admin/create-lab-center-branch";
            
            const response = await postData(endpoint, payload);
            
            if (response?.responseCode === 200) {
                message.success(response?.message || `Lab branch ${currentBranch ? 'updated' : 'created'} successfully`);
                onSuccess();
                onClose?.();
            } else {
                message.error(response?.message || `Failed to ${currentBranch ? 'update' : 'create'} lab branch`);
            }
        } catch (error) {
            message.error(error?.message || `Failed to ${currentBranch ? 'update' : 'create'} lab branch`);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="h-full bg-gray-50">
            <Spin spinning={loading}>
                <style>
                    {`
                        .pac-container {
                            z-index: 2000 !important;
                        }
                    `}
                </style>
                
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <MdLocalHospital className="text-blue-600 text-xl" />
                            </div>
                            <div>
                                <Title level={4} className="!mb-0">
                                    {currentBranch ? "Edit Lab Branch" : "Add New Lab Branch"}
                                </Title>
                                <Text type="secondary" className="text-sm">
                                    {currentBranch ? "Update lab branch information" : "Create a new lab branch entry"}
                                </Text>
                            </div>
                        </div>
                        <Button
                            type="text"
                            icon={<MdClose />}
                            onClick={onClose}
                            className="!text-gray-500 hover:!text-gray-700"
                        />
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-6 max-h-[calc(100vh-140px)] overflow-y-auto">
                    <Space direction="vertical" size="large" className="w-full">
                        {/* Lab Branch Information Card */}
                        <Card className="shadow-sm">
                            <div className="mb-4">
                                <Title level={5} className="!mb-1 flex items-center">
                                    <MdLocalHospital className="mr-2 text-blue-600" />
                                    Lab Branch Information
                                </Title>
                                <Text type="secondary" className="text-sm">
                                    Enter the basic details of the lab branch
                                </Text>
                            </div>
                            
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Select Lab Center"
                                        variant="outlined"
                                        size="small"
                                        value={labBranchData.labcenterId}
                                        onChange={handleBranchInputChange('labcenterId')}
                                        error={!!errors.labcenterId}
                                        helperText={errors.labcenterId}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <MdBusiness className="text-gray-400" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em>Select a Lab Center</em>
                                        </MenuItem>
                                        {labCenters.map((center) => (
                                            <MenuItem key={center._id} value={center._id}>
                                                {center.name} ({center.labId})
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Col>
                                
                                <Col span={24}>
                                    <TextField
                                        fullWidth
                                        label="Branch Name"
                                        variant="outlined"
                                        size="small"
                                        value={labBranchData.name}
                                        onChange={handleBranchInputChange('name')}
                                        error={!!errors.name}
                                        helperText={errors.name}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <MdLocalHospital className="text-gray-400" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Col>
                                
                                <Col span={12}>
                                    <TextField
                                        fullWidth
                                        label="Branch Email"
                                        variant="outlined"
                                        size="small"
                                        type="email"
                                        value={labBranchData.email}
                                        onChange={handleBranchInputChange('email')}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <MdEmail className="text-gray-400" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Col>
                                
                                <Col span={12}>
                                    <TextField
                                        fullWidth
                                        label="Branch Phone"
                                        variant="outlined"
                                        size="small"
                                        inputProps={{ maxLength: 10 }}
                                        value={labBranchData.phone}
                                        onChange={handleBranchInputChange('phone')}
                                        error={!!errors.phone}
                                        helperText={errors.phone}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <MdPhone className="text-gray-400" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Col>
                                
                                <Col span={24}>
                                    <TextField
                                        fullWidth
                                        label="Website URL"
                                        variant="outlined"
                                        size="small"
                                        value={labBranchData.website}
                                        onChange={handleBranchInputChange('website')}
                                        placeholder="https://www.example.com"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <MdWeb className="text-gray-400" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Card>

                        {/* Location Information Card */}
                        <Card className="shadow-sm">
                            <div className="mb-4">
                                <Title level={5} className="!mb-1 flex items-center">
                                    <MdLocationOn className="mr-2 text-red-600" />
                                    Location Information
                                </Title>
                                <Text type="secondary" className="text-sm">
                                    Enter the complete address details
                                </Text>
                            </div>
                            
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <LocationSearchMui
                                        setLatitude={setLatitude}
                                        setLongitude={setLongitude}
                                        setArea={setArea}
                                        setAddress={setAddress}
                                        setAddressObject={setAddressObjectHandler}
                                        initialValue={labBranchData.address}
                                        onChange={(value) => setAddress(value)}
                                        disabledStatus={false}
                                    />
                                    {errors.address && (
                                        <div style={{ color: '#f5222d', fontSize: '12px', marginTop: '4px' }}>
                                            {errors.address}
                                        </div>
                                    )}
                                </Col>
                                
                                <Col span={24}>
                                    <TextField
                                        fullWidth
                                        label="Complete Address"
                                        variant="outlined"
                                        size="small"
                                        multiline
                                        rows={2}
                                        value={labBranchData.address}
                                        onChange={handleBranchInputChange('address')}
                                        error={!!errors.address}
                                        helperText={errors.address}
                                        placeholder="Complete address will be auto-filled when you search above"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" className="self-start mt-2">
                                                    <MdLocationOn className="text-gray-400" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Col>
                                
                                <Col span={12}>
                                    <TextField
                                        fullWidth
                                        label="City"
                                        variant="outlined"
                                        size="small"
                                        value={labBranchData.city}
                                        onChange={handleBranchInputChange('city')}
                                        error={!!errors.city}
                                        helperText={errors.city}
                                    />
                                </Col>
                                
                                <Col span={12}>
                                    <TextField
                                        fullWidth
                                        label="State"
                                        variant="outlined"
                                        size="small"
                                        value={labBranchData.state}
                                        onChange={handleBranchInputChange('state')}
                                        error={!!errors.state}
                                        helperText={errors.state}
                                    />
                                </Col>
                                
                                <Col span={12}>
                                    <TextField
                                        fullWidth
                                        label="Country"
                                        variant="outlined"
                                        size="small"
                                        value={labBranchData.country}
                                        onChange={handleBranchInputChange('country')}
                                    />
                                </Col>
                                
                                <Col span={12}>
                                    <TextField
                                        fullWidth
                                        label="Pincode"
                                        variant="outlined"
                                        size="small"
                                        value={labBranchData.pincode}
                                        onChange={handleBranchInputChange('pincode')}
                                        error={!!errors.pincode}
                                        helperText={errors.pincode}
                                    />
                                </Col>
                            </Row>
                        </Card>

                        {/* Available Tests Card */}
                        <Card className="shadow-sm">
                            <div className="mb-4">
                                <Title level={5} className="!mb-1 flex items-center">
                                    <MdScience className="mr-2 text-green-600" />
                                    Available Tests
                                </Title>
                                <Text type="secondary" className="text-sm">
                                    Select the tests available at this branch
                                </Text>
                            </div>
                            
                            {errors.tests && (
                                <div style={{ color: '#f5222d', fontSize: '12px', marginBottom: '8px' }}>
                                    {errors.tests}
                                </div>
                            )}
                            
                            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                                <Row gutter={[8, 8]}>
                                    {availableTests.map((test) => (
                                        <Col span={12} key={test._id}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={labBranchData.tests.includes(test._id)}
                                                        onChange={() => handleTestSelection(test._id)}
                                                        size="small"
                                                    />
                                                }
                                                label={
                                                    <div className="text-sm">
                                                        <div className="font-medium">{test.name}</div>
                                                        <div className="text-gray-500">₹{test.price} | {test.category?.name}</div>
                                                    </div>
                                                }
                                                className="w-full"
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                            
                            <div className="mt-3 text-sm text-gray-600">
                                Selected: {labBranchData.tests.length} test(s)
                            </div>
                        </Card>

                        {/* Services Configuration Card */}
                        <Card className="shadow-sm">
                            <div className="mb-4">
                                <Title level={5} className="!mb-1 flex items-center">
                                    <MdHome className="mr-2 text-purple-600" />
                                    Services Configuration
                                </Title>
                                <Text type="secondary" className="text-sm">
                                    Configure available services
                                </Text>
                            </div>
                            
                            <Row gutter={[16, 16]}>
                                {/* Lab Visit Service */}
                                <Col span={24}>
                                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                        <div>
                                            <div className="font-medium">Lab Visit Service</div>
                                            <div className="text-sm text-gray-500">Allow patients to visit the lab</div>
                                        </div>
                                        <Switch
                                            checked={labBranchData.labVisitServiceAvailable}
                                            onChange={(checked) => setLabBranchData(prev => ({
                                                ...prev,
                                                labVisitServiceAvailable: checked
                                            }))}
                                        />
                                    </div>
                                </Col>
                                
                                {/* Home Collection Service */}
                                <Col span={24}>
                                    <div className="border border-gray-200 rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <div className="font-medium">Home Collection Service</div>
                                                <div className="text-sm text-gray-500">Collect samples from patient's home</div>
                                            </div>
                                            <Switch
                                                checked={labBranchData.homeCollectionService.isAvailable}
                                                onChange={handleHomeCollectionToggle}
                                            />
                                        </div>
                                        
                                        {labBranchData.homeCollectionService.isAvailable && (
                                            <Row gutter={[12, 12]} className="mt-3">
                                                <Col span={24}>
                                                    <TextField
                                                        fullWidth
                                                        label="Service Radius (km)"
                                                        variant="outlined"
                                                        size="small"
                                                        type="number"
                                                        value={labBranchData.homeCollectionService.serviceRadius}
                                                        onChange={handleHomeCollectionInputChange('serviceRadius')}
                                                        error={!!errors.serviceRadius}
                                                        helperText={errors.serviceRadius}
                                                        inputProps={{ min: 1, max: 100 }}
                                                    />
                                                </Col>
                                                
                                                <Col span={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Charges Within Radius (₹)"
                                                        variant="outlined"
                                                        size="small"
                                                        type="number"
                                                        value={labBranchData.homeCollectionService.charges.withinRadius}
                                                        onChange={handleHomeCollectionInputChange('withinRadius')}
                                                        inputProps={{ min: 0 }}
                                                    />
                                                </Col>
                                                
                                                <Col span={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Charges Beyond Radius (₹)"
                                                        variant="outlined"
                                                        size="small"
                                                        type="number"
                                                        value={labBranchData.homeCollectionService.charges.beyondRadius}
                                                        onChange={handleHomeCollectionInputChange('beyondRadius')}
                                                        inputProps={{ min: 0 }}
                                                    />
                                                </Col>
                                            </Row>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </Card>

                        {/* User Information Card - Only show for new branches */}
                        {!currentBranch && (
                            <Card className="shadow-sm">
                                <div className="mb-4">
                                    <Title level={5} className="!mb-1 flex items-center">
                                        <MdPerson className="mr-2 text-orange-600" />
                                        Branch Administrator Information
                                    </Title>
                                    <Text type="secondary" className="text-sm">
                                        Enter the administrator details for this branch
                                    </Text>
                                </div>
                                
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <TextField
                                            fullWidth
                                            label="Administrator Name"
                                            variant="outlined"
                                            size="small"
                                            value={labBranchUserData.userName}
                                            onChange={handleUserInputChange('userName')}
                                            error={!!errors.userName}
                                            helperText={errors.userName}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MdPerson className="text-gray-400" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Col>
                                    
                                    <Col span={12}>
                                        <TextField
                                            fullWidth
                                            label="Administrator Phone"
                                            variant="outlined"
                                            size="small"
                                            inputProps={{ maxLength: 10 }}
                                            value={labBranchUserData.userPhone}
                                            onChange={handleUserInputChange('userPhone')}
                                            error={!!errors.userPhone}
                                            helperText={errors.userPhone}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MdPhone className="text-gray-400" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Col>
                                    
                                    <Col span={12}>
                                        <TextField
                                            fullWidth
                                            label="Administrator Email"
                                            variant="outlined"
                                            size="small"
                                            type="email"
                                            value={labBranchUserData.userEmail}
                                            onChange={handleUserInputChange('userEmail')}
                                            error={!!errors.userEmail}
                                            helperText={errors.userEmail}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MdEmail className="text-gray-400" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Col>
                                    
                                    <Col span={12}>
                                        <TextField
                                            fullWidth
                                            label="Password"
                                            variant="outlined"
                                            size="small"
                                            type="password"
                                            value={labBranchUserData.password}
                                            onChange={handleUserInputChange('password')}
                                            error={!!errors.password}
                                            helperText={errors.password}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MdLock className="text-gray-400" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        )}
                    </Space>
                </div>

                {/* Footer Actions */}
                <div className="bg-white border-t border-gray-200 px-6 py-4">
                    <div className="flex justify-end items-center">
                        <Space>
                            <Button
                                type="default"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                icon={<MdSave />}
                                onClick={handleSubmit}
                                loading={loading}
                                className="flex items-center"
                            >
                                {currentBranch ? "Update Lab Branch" : "Create Lab Branch"}
                            </Button>
                        </Space>
                    </div>
                </div>
            </Spin>
        </div>
    );
};

export default AddLabCenterBranch;