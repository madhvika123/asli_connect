import React, { useState, useEffect } from "react";
import { Button, message, Spin, Card, Space, Typography, Divider, Row, Col, Switch } from "antd";
import { TextField, InputAdornment } from "@mui/material";
import { 
    MdLocationOn, 
    MdEmail, 
    MdPhone, 
    MdWeb, 
    MdBusiness,
    MdSave,
    MdClose,
    MdPerson,
    MdLock
} from "react-icons/md";
import { postData, fetchData } from "../../api/apiService";
import LocationSearchMui from "../../utils/location";

const { Title, Text } = Typography;

const AddLabCenter = ({ currentLabCenter, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    
    // Lab Center Data
    const [labCenterData, setLabCenterData] = useState({
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
        longitude: ""
    });

    // Lab Center User Data
    const [labCenterUserData, setLabCenterUserData] = useState({
        userName: "",
        userPhone: "",
        userEmail: "",
        password: "",
        userLatitude: "",
        userLongitude: ""
    });

    const [errors, setErrors] = useState({});
    // Add state for address object
    const [addressObject, setAddressObject] = useState({});

    useEffect(() => {
        if (currentLabCenter) {
            // Populate lab center data
            setLabCenterData({
                name: currentLabCenter.name || "",
                email: currentLabCenter.email || "",
                phone: currentLabCenter.phone || "",
                website: currentLabCenter.website || "",
                address: currentLabCenter.address || "",
                city: currentLabCenter.city || "",
                state: currentLabCenter.state || "",
                country: currentLabCenter.country || "India",
                pincode: currentLabCenter.pincode || "",
                latitude: currentLabCenter.location?.coordinates?.[1] || "",
                longitude: currentLabCenter.location?.coordinates?.[0] || ""
            });

            // If editing, populate user data if available
            if (currentLabCenter.userDetails) {
                setLabCenterUserData({
                    userName: currentLabCenter.userDetails.userName || "",
                    userPhone: currentLabCenter.userDetails.userPhone || "",
                    userEmail: currentLabCenter.userDetails.userEmail || "",
                    password: "", // Never pre-fill password for security
                    userLatitude: currentLabCenter.userDetails.userLocation?.coordinates?.[1] || "",
                    userLongitude: currentLabCenter.userDetails.userLocation?.coordinates?.[0] || ""
                });
            }
        }
    }, [currentLabCenter]);

    const handleLabCenterInputChange = (field) => (event) => {
        const value = event.target.value;
        setLabCenterData(prev => ({
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
        setLabCenterUserData(prev => ({
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

    // Modified location handlers to work with LocationSearchMui
    const setLatitude = (lat) => {
        setLabCenterData(prev => ({ ...prev, latitude: lat }));
        setLabCenterUserData(prev => ({ ...prev, userLatitude: lat }));
    };

    const setLongitude = (lng) => {
        setLabCenterData(prev => ({ ...prev, longitude: lng }));
        setLabCenterUserData(prev => ({ ...prev, userLongitude: lng }));
    };

    const setArea = (area) => {
        // You can use this if needed for specific area handling
        console.log("Area set:", area);
    };

    const setAddress = (address) => {
        setLabCenterData(prev => ({ ...prev, address: address }));
        // Clear address related errors
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
        // Update form data based on address object
        setLabCenterData(prev => ({
            ...prev,
            city: addressObj.city || prev.city,
            state: addressObj.state || prev.state,
            country: addressObj.country || prev.country,
            pincode: addressObj.zip || prev.pincode
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Lab Center validation
        if (!labCenterData.name.trim()) newErrors.name = "Lab center name is required";
        if (!labCenterData.email.trim()) newErrors.email = "Lab center email is required";
        else if (!/\S+@\S+\.\S+/.test(labCenterData.email)) newErrors.email = "Invalid email format";
        if (!labCenterData.phone.trim()) newErrors.phone = "Lab center phone number is required";
        else if (!/^\d{10}$/.test(labCenterData.phone)) newErrors.phone = "Phone number must be 10 digits";
        if (!labCenterData.address.trim()) newErrors.address = "Address is required";
        if (!labCenterData.city.trim()) newErrors.city = "City is required";
        if (!labCenterData.state.trim()) newErrors.state = "State is required";
        if (!labCenterData.pincode.trim()) newErrors.pincode = "Pincode is required";
        else if (!/^\d{6}$/.test(labCenterData.pincode)) newErrors.pincode = "Pincode must be 6 digits";

        // User validation (only for new lab centers)
        if (!currentLabCenter) {
            if (!labCenterUserData.userName.trim()) newErrors.userName = "User name is required";
            if (!labCenterUserData.userPhone.trim()) newErrors.userPhone = "User phone number is required";
            else if (!/^\d{10}$/.test(labCenterUserData.userPhone)) newErrors.userPhone = "User phone number must be 10 digits";
            if (!labCenterUserData.userEmail.trim()) newErrors.userEmail = "User email is required";
            else if (!/\S+@\S+\.\S+/.test(labCenterUserData.userEmail)) newErrors.userEmail = "Invalid user email format";
            if (!labCenterUserData.password.trim()) newErrors.password = "Password is required";
            else if (labCenterUserData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
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
                labCenterData: {
                    name: labCenterData.name,
                    email: labCenterData.email,
                    phone: labCenterData.phone,
                    logo: "", // As requested, ignoring for now
                    images: [], // As requested, ignoring for now
                    website: labCenterData.website || "",
                    address: labCenterData.address,
                    city: labCenterData.city,
                    state: labCenterData.state,
                    country: labCenterData.country,
                    pincode: labCenterData.pincode,
                    ...(labCenterData.latitude && labCenterData.longitude && {
                        location: {
                            type: "Point",
                            coordinates: [parseFloat(labCenterData.longitude), parseFloat(labCenterData.latitude)]
                        }
                    })
                }
            };

            // Add user data only for new lab centers
            if (!currentLabCenter) {
                payload.labCenterUserData = {
                    userName: labCenterUserData.userName,
                    userPhone: labCenterUserData.userPhone,
                    userEmail: labCenterUserData.userEmail,
                    password: labCenterUserData.password,
                    ...(labCenterUserData.userLatitude && labCenterUserData.userLongitude && {
                        userLocation: {
                            type: "Point",
                            coordinates: [parseFloat(labCenterUserData.userLongitude), parseFloat(labCenterUserData.userLatitude)]
                        }
                    })
                };
            }

            // Add ID for update
            if (currentLabCenter) {
                payload.labCenterData.labCenterId = currentLabCenter._id;
            }

            const endpoint = currentLabCenter 
                ? "/api/admin/update-lab-center" 
                : "/api/admin/create-lab-center";
            
            const response = await postData(endpoint, payload);
            
            if (response?.responseCode === 200) {
                message.success(response?.message || `Lab center ${currentLabCenter ? 'updated' : 'created'} successfully`);
                onSuccess?.();
                onClose?.();
            } else {
                message.error(response?.message || `Failed to ${currentLabCenter ? 'update' : 'create'} lab center`);
            }
        } catch (error) {
            message.error(error?.message || `Failed to ${currentLabCenter ? 'update' : 'create'} lab center`);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setLabCenterData({
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
            longitude: ""
        });
        
        setLabCenterUserData({
            userName: "",
            userPhone: "",
            userEmail: "",
            password: "",
            userLatitude: "",
            userLongitude: ""
        });
        
        setErrors({});
        setAddressObject({});
    };

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
                                <MdBusiness className="text-blue-600 text-xl" />
                            </div>
                            <div>
                                <Title level={4} className="!mb-0">
                                    {currentLabCenter ? "Edit Lab Center" : "Add New Lab Center"}
                                </Title>
                                <Text type="secondary" className="text-sm">
                                    {currentLabCenter ? "Update lab center information" : "Create a new lab center entry"}
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
                        {/* Lab Center Information Card */}
                        <Card className="shadow-sm">
                            <div className="mb-4">
                                <Title level={5} className="!mb-1 flex items-center">
                                    <MdBusiness className="mr-2 text-blue-600" />
                                    Lab Center Information
                                </Title>
                                <Text type="secondary" className="text-sm">
                                    Enter the basic details of the lab center
                                </Text>
                            </div>
                            
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <TextField
                                        fullWidth
                                        label="Lab Center Name"
                                        variant="outlined"
                                        size="small"
                                        value={labCenterData.name}
                                        onChange={handleLabCenterInputChange('name')}
                                        error={!!errors.name}
                                        helperText={errors.name}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <MdBusiness className="text-gray-400" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Col>
                                
                                <Col span={12}>
                                    <TextField
                                        fullWidth
                                        label="Lab Center Email"
                                        variant="outlined"
                                        size="small"
                                        type="email"
                                        value={labCenterData.email}
                                        onChange={handleLabCenterInputChange('email')}
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
                                        label="Lab Center Phone"
                                        variant="outlined"
                                        size="small"
                                        value={labCenterData.phone}
                                        onChange={handleLabCenterInputChange('phone')}
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
                                        value={labCenterData.website}
                                        onChange={handleLabCenterInputChange('website')}
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
                                        initialValue={labCenterData.address}
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
                                        value={labCenterData.address}
                                        onChange={handleLabCenterInputChange('address')}
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
                                        value={labCenterData.city}
                                        onChange={handleLabCenterInputChange('city')}
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
                                        value={labCenterData.state}
                                        onChange={handleLabCenterInputChange('state')}
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
                                        value={labCenterData.country}
                                        onChange={handleLabCenterInputChange('country')}
                                    />
                                </Col>
                                
                                <Col span={12}>
                                    <TextField
                                        fullWidth
                                        label="Pincode"
                                        variant="outlined"
                                        size="small"
                                        value={labCenterData.pincode}
                                        onChange={handleLabCenterInputChange('pincode')}
                                        error={!!errors.pincode}
                                        helperText={errors.pincode}
                                    />
                                </Col>
                            </Row>
                        </Card>

                        {/* User Information Card - Only show for new lab centers */}
                        {!currentLabCenter && (
                            <Card className="shadow-sm">
                                <div className="mb-4">
                                    <Title level={5} className="!mb-1 flex items-center">
                                        <MdPerson className="mr-2 text-green-600" />
                                        Lab Center User Information
                                    </Title>
                                    <Text type="secondary" className="text-sm">
                                        Enter the user details for lab center admin
                                    </Text>
                                </div>
                                
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <TextField
                                            fullWidth
                                            label="User Name"
                                            variant="outlined"
                                            size="small"
                                            value={labCenterUserData.userName}
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
                                            label="User Phone"
                                            variant="outlined"
                                            inputProps={{
                                                maxLength: 10
                                            }}
                                            size="small"
                                            value={labCenterUserData.userPhone}
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
                                            label="User Email"
                                            variant="outlined"
                                            size="small"
                                            type="email"
                                            value={labCenterUserData.userEmail}
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
                                            
                                            value={labCenterUserData.password}
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
                    <div className="flex justify-between items-center">
                        
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
                                {currentLabCenter ? "Update Lab Center" : "Create Lab Center"}
                            </Button>
                        </Space>
                    </div>
                </div>
            </Spin>
        </div>
    );
};

export default AddLabCenter;