import React, { useState, useEffect } from "react";
import { Button, message, Spin, Card, Space, Typography, Row, Col } from "antd";
import { TextField, InputAdornment } from "@mui/material";
import { 
    MdCategory,
    MdDescription,
    MdSave,
    MdClose,
    MdNumbers
} from "react-icons/md";
import { postData, putData } from "../../api/apiService";

const { Title, Text } = Typography;

const AddCategory = ({ currentCategory, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (currentCategory) {
            setFormData({
                name: currentCategory.name || "",
                description: currentCategory.description || ""
            });
        } else {
            setFormData({
                name: "",
                description: ""
            });
        }
        setErrors({});
    }, [currentCategory]);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = "Category name is required";
        }
        
        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field) => (event) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            message.error("Please fix the validation errors");
            return;
        }

        try {
            setLoading(true);
            
            const payload = {
                name: formData.name.trim(),
                description: formData.description.trim()
            };

            let response;
            if (currentCategory) {
                // Edit mode - assuming there's an update endpoint
                response = await putData(`/api/admin/update-lab-test-category/${currentCategory._id}`, payload);
            } else {
                // Add mode
                response = await postData("/api/admin/create-lab-test-category", payload);
            }

            if (response?.responseCode === 200) {
                message.success(response?.message || 
                    `Lab category ${currentCategory ? 'updated' : 'created'} successfully`
                );
                onSuccess?.();
                onClose?.();
            } else {
                message.error(response?.message || `Failed to ${currentCategory ? 'update' : 'create'} category`);
            }
        } catch (error) {
            message.error(error?.message || `Failed to ${currentCategory ? 'update' : 'create'} category`);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        if (currentCategory) {
            setFormData({
                name: currentCategory.name || "",
                description: currentCategory.description || ""
            });
        } else {
            setFormData({
                name: "",
                description: ""
            });
        }
        setErrors({});
    };

    return (
        <div className="h-full bg-gray-50">
            <Spin spinning={loading}>
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <MdCategory className="text-purple-600 text-xl" />
                            </div>
                            <div>
                                <Title level={4} className="!mb-0">
                                    {currentCategory ? "Edit Lab Category" : "Add New Lab Category"}
                                </Title>
                                <Text type="secondary" className="text-sm">
                                    {currentCategory ? "Update category information" : "Create a new lab test category"}
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
                        {/* Category Information Card */}
                        <Card className="shadow-sm">
                            <div className="mb-4">
                                <Title level={5} className="!mb-1 flex items-center">
                                    <MdCategory className="mr-2 text-purple-600" />
                                    Category Information
                                </Title>
                                <Text type="secondary" className="text-sm">
                                    Enter the basic details of the lab test category
                                </Text>
                            </div>
                            
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <TextField
                                        fullWidth
                                        label="Category Name"
                                        variant="outlined"
                                        size="small"
                                        value={formData.name}
                                        onChange={handleInputChange('name')}
                                        error={!!errors.name}
                                        helperText={errors.name}
                                        placeholder="Enter category name"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <MdCategory className="text-gray-400" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Col>
                                
                                <Col span={24}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        variant="outlined"
                                        size="small"
                                        multiline
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleInputChange('description')}
                                        error={!!errors.description}
                                        helperText={errors.description}
                                        placeholder="Enter category description"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" className="self-start mt-2">
                                                    <MdDescription className="text-gray-400" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Col>

                                {/* Display Category ID for edit mode */}
                                {currentCategory && (
                                    <Col span={24}>
                                        <TextField
                                            fullWidth
                                            label="Category ID"
                                            variant="outlined"
                                            size="small"
                                            value={currentCategory.categoryId || currentCategory._id || ""}
                                            disabled
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MdNumbers className="text-gray-400" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Col>
                                )}
                            </Row>
                        </Card>
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
                                {currentCategory ? "Update Category" : "Create Category"}
                            </Button>
                        </Space>
                    </div>
                </div>
            </Spin>
        </div>
    );
};

export default AddCategory;