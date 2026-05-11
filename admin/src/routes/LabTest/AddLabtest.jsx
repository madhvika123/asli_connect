import React, { useState, useEffect } from 'react';
import { Button, message, Spin, Card, Space, Typography, Divider, Row, Col, Tag } from 'antd';
import { TextField, MenuItem, InputAdornment, Chip } from '@mui/material';
import { 
    MdClose, 
    MdAdd, 
    MdDelete, 
    MdSave,
    MdScience,
    MdCategory,
    MdAttachMoney,
    MdDescription,
    MdList
} from 'react-icons/md';
import { TbTestPipe } from 'react-icons/tb';
import { FaFlask } from 'react-icons/fa';
import { fetchData, postData } from '../../api/apiService';

const { Title, Text } = Typography;

const AddLabTest = ({ currentLabTest, categories, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        categoryId: '',
        description: '',
        price: '',
        preparation: ['']
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (currentLabTest) {
            setFormData({
                name: currentLabTest.name || '',
                categoryId: currentLabTest.category?._id || '',
                description: currentLabTest.description || '',
                price: currentLabTest.price || '',
                preparation: currentLabTest.preparation?.length > 0 ? currentLabTest.preparation : ['']
            });
        } else {
            setFormData({
                name: '',
                categoryId: '',
                description: '',
                price: '',
                preparation: ['']
            });
        }
        setErrors({});
    }, [currentLabTest]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handlePreparationChange = (index, value) => {
        const newPreparation = [...formData.preparation];
        newPreparation[index] = value;
        setFormData(prev => ({
            ...prev,
            preparation: newPreparation
        }));
    };

    const addPreparationStep = () => {
        setFormData(prev => ({
            ...prev,
            preparation: [...prev.preparation, '']
        }));
    };

    const removePreparationStep = (index) => {
        if (formData.preparation.length > 1) {
            const newPreparation = formData.preparation.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                preparation: newPreparation
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Test name is required';
        }

        if (!formData.categoryId) {
            newErrors.categoryId = 'Category is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.price || formData.price <= 0) {
            newErrors.price = 'Valid price is required';
        }

        // Check if at least one preparation step is filled
        const filledPreparations = formData.preparation.filter(prep => prep.trim());
        if (filledPreparations.length === 0) {
            newErrors.preparation = 'At least one preparation step is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            message.error('Please fix the validation errors');
            return;
        }

        try {
            setLoading(true);
            
            // Filter out empty preparation steps
            const filteredPreparation = formData.preparation.filter(prep => prep.trim());
            
            const payload = {
                name: formData.name.trim(),
                categoryId: formData.categoryId,
                description: formData.description.trim(),
                price: parseFloat(formData.price),
                preparation: filteredPreparation
            };

            let response;
            if (currentLabTest) {
                // Update existing test
                response = await postData(`/api/admin/update-lab-test/${currentLabTest._id}`, payload);
            } else {
                // Create new test
                response = await postData('/api/admin/create-lab-tests', payload);
            }

            if (response?.responseCode === 200) {
                message.success(
                    response?.message || 
                    (currentLabTest 
                        ? 'Lab test updated successfully' 
                        : 'Lab test created successfully')
                );
                onSuccess?.();
                onClose?.();
            } else {
                message.error(response?.message || 'Failed to save lab test');
            }
        } catch (error) {
            message.error(error?.message || 'Failed to save lab test');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            name: '',
            categoryId: '',
            description: '',
            price: '',
            preparation: ['']
        });
        setErrors({});
    };

    const selectedCategory = categories.find(cat => cat._id === formData.categoryId);

    return (
        <div className="h-full bg-gray-50">
            <Spin spinning={loading}>
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FaFlask className="text-blue-600 text-xl" />
                            </div>
                            <div>
                                <Title level={4} className="!mb-0">
                                    {currentLabTest ? 'Edit Lab Test' : 'Add New Lab Test'}
                                </Title>
                                <Text type="secondary" className="text-sm">
                                    {currentLabTest ? 'Update test information' : 'Create a new laboratory test'}
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
                        {/* Basic Information Card */}
                        <Card className="shadow-sm">
                            <div className="mb-4">
                                <Title level={5} className="!mb-1 flex items-center">
                                    <TbTestPipe className="mr-2 text-blue-600" />
                                    Basic Information
                                </Title>
                                <Text type="secondary" className="text-sm">
                                    Enter the basic details of the lab test
                                </Text>
                            </div>
                            
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <TextField
                                        fullWidth
                                        label="Test Name"
                                        variant="outlined"
                                        size="small"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        error={!!errors.name}
                                        helperText={errors.name}
                                        placeholder="Enter test name (e.g., Complete Blood Count)"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <MdScience className="text-gray-400" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Col>

                                <Col span={12}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Category"
                                        variant="outlined"
                                        size="small"
                                        value={formData.categoryId}
                                        onChange={(e) => handleInputChange('categoryId', e.target.value)}
                                        error={!!errors.categoryId}
                                        helperText={errors.categoryId}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <MdCategory className="text-gray-400" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    >
                                        <MenuItem value="">Select a category</MenuItem>
                                        {categories.map((category) => (
                                            <MenuItem key={category._id} value={category._id}>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{category.name}</span>
                                                    <span className="text-xs text-gray-500">
                                                        ID: {category.categoryId}
                                                    </span>
                                                </div>
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Col>

                                <Col span={12}>
                                    <TextField
                                        fullWidth
                                        label="Price (₹)"
                                        variant="outlined"
                                        size="small"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => handleInputChange('price', e.target.value)}
                                        error={!!errors.price}
                                        helperText={errors.price}
                                        placeholder="Enter test price"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <MdAttachMoney className="text-gray-400" />
                                                </InputAdornment>
                                            ),
                                            inputProps: { min: 0, step: 'any' }
                                        }}
                                    />
                                </Col>

                                {/* Selected Category Display */}
                                {selectedCategory && (
                                    <Col span={24}>
                                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                            <div className="flex items-start gap-2">
                                                <Chip 
                                                    label={selectedCategory.name}
                                                    color="primary"
                                                    size="small"
                                                    className="!bg-purple-100 !text-purple-800"
                                                />
                                            </div>
                                            <p className="text-sm text-purple-700 mt-2">
                                                {selectedCategory.description}
                                            </p>
                                        </div>
                                    </Col>
                                )}
                            </Row>
                        </Card>

                        {/* Description Card */}
                        <Card className="shadow-sm">
                            <div className="mb-4">
                                <Title level={5} className="!mb-1 flex items-center">
                                    <MdDescription className="mr-2 text-green-600" />
                                    Test Description
                                </Title>
                                <Text type="secondary" className="text-sm">
                                    Provide detailed information about what this test measures
                                </Text>
                            </div>
                            
                            <TextField
                                fullWidth
                                label="Test Description"
                                variant="outlined"
                                size="small"
                                multiline
                                rows={4}
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                error={!!errors.description}
                                helperText={errors.description || 'Provide a detailed description of what this test measures or diagnoses'}
                                placeholder="Enter detailed description of the test..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" className="self-start mt-2">
                                            <MdDescription className="text-gray-400" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Card>

                        {/* Preparation Steps Card */}
                        <Card className="shadow-sm">
                            <div className="mb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Title level={5} className="!mb-1 flex items-center">
                                            <MdList className="mr-2 text-orange-600" />
                                            Preparation Instructions
                                        </Title>
                                        <Text type="secondary" className="text-sm">
                                            Add step-by-step preparation instructions for patients
                                        </Text>
                                    </div>
                                    <Button
                                        type="dashed"
                                        icon={<MdAdd />}
                                        onClick={addPreparationStep}
                                        size="small"
                                        className="!text-blue-600 !border-blue-300 hover:!bg-blue-50"
                                    >
                                        Add Step
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {formData.preparation.map((step, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1 shrink-0">
                                            <span className="text-sm font-medium text-blue-600">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            multiline
                                            rows={2}
                                            value={step}
                                            onChange={(e) => handlePreparationChange(index, e.target.value)}
                                            placeholder={`Enter preparation step ${index + 1}...`}
                                        />
                                        {formData.preparation.length > 1 && (
                                            <Button
                                                type="text"
                                                danger
                                                icon={<MdDelete />}
                                                onClick={() => removePreparationStep(index)}
                                                size="small"
                                                className="mt-1"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {errors.preparation && (
                                <div className="text-red-500 text-sm mt-2">{errors.preparation}</div>
                            )}
                        </Card>

                        {/* Preview Card */}
                        {(formData.name || formData.description || formData.price) && (
                            <Card className="shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
                                <div className="mb-4">
                                    <Title level={5} className="!mb-1 flex items-center">
                                        <FaFlask className="mr-2 text-indigo-600" />
                                        Test Preview
                                    </Title>
                                    <Text type="secondary" className="text-sm">
                                        Preview how the test will appear to users
                                    </Text>
                                </div>
                                
                                <div className="bg-white rounded-lg p-4 border border-blue-200">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            {formData.name && (
                                                <h4 className="text-lg font-semibold text-gray-800 capitalize mb-2">
                                                    {formData.name}
                                                </h4>
                                            )}
                                            {selectedCategory && (
                                                <Tag color="purple" className="mb-2">
                                                    {selectedCategory.name}
                                                </Tag>
                                            )}
                                        </div>
                                        {formData.price && (
                                            <div className="text-right">
                                                <span className="text-xl font-bold text-green-600">
                                                    ₹{formData.price}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {formData.description && (
                                        <div className="mb-3">
                                            <p className="text-sm text-gray-600">
                                                {formData.description}
                                            </p>
                                        </div>
                                    )}
                                    
                                    {formData.preparation.some(step => step.trim()) && (
                                        <div>
                                            <h5 className="font-medium text-gray-700 mb-2">
                                                Preparation Instructions:
                                            </h5>
                                            <ul className="list-disc list-inside space-y-1">
                                                {formData.preparation
                                                    .filter(step => step.trim())
                                                    .map((step, index) => (
                                                    <li key={index} className="text-sm text-gray-600">
                                                        {step}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}
                    </Space>
                </div>

                {/* Footer Actions */}
                <div className="bg-white border-t border-gray-200 px-6 py-4">
                    <div className="flex justify-between items-center">
                        {/* Progress Indicator */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>
                                Fields completed: {Object.values(formData).filter(val => 
                                    val && (Array.isArray(val) ? val.some(v => v.trim()) : val.toString().trim())
                                ).length}/5
                            </span>
                            <span>
                                Preparation steps: {formData.preparation.filter(step => step.trim()).length}
                            </span>
                        </div>
                        
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
                                {currentLabTest ? "Update Test" : "Create Test"}
                            </Button>
                        </Space>
                    </div>
                </div>
            </Spin>
        </div>
    );
};

export default AddLabTest;