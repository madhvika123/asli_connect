import React, { useEffect, useState } from "react";
import moment from "moment";
import {
    Button,
    message,
} from "antd";
import {
    TextField,
    Chip,
    Box,
    Typography,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    CircularProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import { MdExpandMore } from "react-icons/md";
import { fetchData, postData } from "../../../api/apiService";

const AddLabPackage = ({ currentLabPackage, onSuccess, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [availableTests, setAvailableTests] = useState([]);
    const [testsLoading, setTestsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        tests: [],
        discount: 0,
        expiryDate: "",
    });
    const [errors, setErrors] = useState({});
    const [calculatedPricing, setCalculatedPricing] = useState({
        originalPrice: 0,
        finalAmount: 0,
        savings: 0,
    });

    // Fetch available tests
    const fetchAvailableTests = async () => {
        try {
            setTestsLoading(true);
            const response = await fetchData("/api/labCenterBranch/list-of-lab-test-dropdown-by-lab-center-branch");
            
            if (response?.responseCode === 200) {
                setAvailableTests(response?.data || []);
            } else {
                message.error(response?.message || "Failed to fetch available tests");
                setAvailableTests([]);
            }
        } catch (error) {
            message.error(error?.message || "Failed to fetch available tests");
            setAvailableTests([]);
        } finally {
            setTestsLoading(false);
        }
    };

    // Calculate pricing when tests or discount changes
    useEffect(() => {
        const selectedTestObjects = availableTests.filter(test => 
            formData.tests.includes(test._id)
        );
        
        const originalPrice = selectedTestObjects.reduce((sum, test) => sum + test.price, 0);
        const discountAmount = (originalPrice * formData.discount) / 100;
        const finalAmount = originalPrice - discountAmount;
        
        setCalculatedPricing({
            originalPrice,
            finalAmount,
            savings: discountAmount,
        });
    }, [formData.tests, formData.discount, availableTests]);

    // Initialize form data for editing
    useEffect(() => {
        if (currentLabPackage) {
            setFormData({
                name: currentLabPackage.name || "",
                description: currentLabPackage.description || "",
                tests: currentLabPackage.tests?.map(test => test._id || test) || [],
                discount: currentLabPackage.discount || 0,
                expiryDate: currentLabPackage.expiryDate ? moment(currentLabPackage.expiryDate).format('YYYY-MM-DD') : "",
            });
        }
    }, [currentLabPackage]);

    // Fetch tests on component mount
    useEffect(() => {
        fetchAvailableTests();
    }, []);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing/selecting
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Package name is required";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        }

        if (formData.tests.length === 0) {
            newErrors.tests = "At least one test must be selected";
        }

        if (formData.discount < 0 || formData.discount > 100) {
            newErrors.discount = "Discount must be between 0 and 100";
        }

        if (!formData.expiryDate) {
            newErrors.expiryDate = "Expiry date is required";
        } else if (moment(formData.expiryDate).isBefore(moment(), 'day')) {
            newErrors.expiryDate = "Expiry date must be in the future";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            message.error("Please fill all required fields");
            return;
        }

        try {
            setSubmitLoading(true);

            const payload = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                tests: formData.tests,
                discount: formData.discount,
                expiryDate: formData.expiryDate,
            };

            const apiEndpoint = currentLabPackage 
                ? "/api/labCenterBranch/update-lab-test-package-by-lab-center-branch"
                : "/api/labCenterBranch/create-lab-test-package-by-lab-center-branch";

            if (currentLabPackage) {
                payload.packageId = currentLabPackage._id;
            }

            const response = await postData(apiEndpoint, payload);

            if (response?.responseCode === 200) {
                message.success(
                    currentLabPackage 
                        ? "Lab package updated successfully!" 
                        : "Lab package created successfully!"
                );
                
                if (onSuccess) onSuccess();
                if (onClose) onClose();
            } else {
                message.error(response?.message || "Failed to save lab package");
            }
        } catch (error) {
            message.error(error?.message || "Failed to save lab package");
        } finally {
            setSubmitLoading(false);
        }
    };

    const getSelectedTestsInfo = () => {
        return availableTests.filter(test => formData.tests.includes(test._id));
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-6">
                {currentLabPackage ? "Edit Lab Package" : "Create New Lab Package"}
            </h2>

            <div className="space-y-4">
                {/* Package Name */}
                <FormControl fullWidth>
                    <TextField
                        label="Package Name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        placeholder="Enter package name (e.g., Basic Health Checkup)"
                        required
                    />
                </FormControl>

                {/* Description */}
                <FormControl fullWidth>
                    <TextField
                        label="Description"
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        error={!!errors.description}
                        helperText={errors.description}
                        placeholder="Describe what this package includes and its benefits..."
                        required
                    />
                </FormControl>

                {/* Test Selection */}
                <FormControl fullWidth>
                    {testsLoading ? (
                        <div className="flex justify-center py-4">
                            <CircularProgress size={24} />
                            <span className="ml-2">Loading available tests...</span>
                        </div>
                    ) : (
                        <>
                            <InputLabel>Select Tests ({formData.tests.length} selected) *</InputLabel>
                            <Select
                                multiple
                                value={formData.tests}
                                onChange={(e) => handleChange("tests", e.target.value)}
                                label={`Select Tests (${formData.tests.length} selected) *`}
                                required
                                error={!!errors.tests}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((testId) => {
                                            const test = availableTests.find(t => t._id === testId);
                                            return (
                                                <Chip 
                                                    key={testId} 
                                                    label={test?.name || testId} 
                                                    size="small"
                                                />
                                            );
                                        })}
                                    </Box>
                                )}
                            >
                                {availableTests.map(test => (
                                    <MenuItem key={test._id} value={test._id}>
                                        <div className="flex justify-between items-center w-full">
                                            <div>
                                                <span className="font-medium">{test.name}</span>
                                                <span className="text-gray-500 ml-2">({test.category?.name})</span>
                                            </div>
                                            <span className="text-green-600 font-semibold">₹{test.price}</span>
                                        </div>
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.tests && (
                                <Typography variant="caption" color="error" className="mt-1 ml-3">
                                    {errors.tests}
                                </Typography>
                            )}
                        </>
                    )}
                </FormControl>

                {/* Selected Tests Preview */}
                {formData.tests.length > 0 && (
                    <div className="mt-4">
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<MdExpandMore />}
                                className="bg-blue-50"
                            >
                                <Typography className="font-medium text-blue-700">
                                    Selected Tests ({formData.tests.length}) - Click to view details
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className="space-y-3">
                                    {getSelectedTestsInfo().map(test => (
                                        <div 
                                            key={test._id} 
                                            className="flex justify-between items-center p-3 border border-gray-200 rounded"
                                        >
                                            <div className="flex-1">
                                                <Typography variant="subtitle2" className="font-medium">
                                                    {test.name}
                                                </Typography>
                                                <Typography variant="caption" className="text-gray-600 block">
                                                    Category: {test.category?.name}
                                                </Typography>
                                                {test.description && (
                                                    <Typography variant="caption" className="text-gray-500 block">
                                                        {test.description}
                                                    </Typography>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <Typography variant="subtitle2" className="font-semibold text-green-600">
                                                    ₹{test.price}
                                                </Typography>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                )}

                {/* Discount */}
                <FormControl fullWidth>
                    <TextField
                        label="Discount Percentage"
                        type="number"
                        value={formData.discount}
                        onChange={(e) => handleChange("discount", Number(e.target.value) || 0)}
                        error={!!errors.discount}
                        helperText={errors.discount}
                        placeholder="Enter discount percentage (0-100)"
                        inputProps={{
                            min: 0,
                            max: 100
                        }}
                        required
                    />
                </FormControl>

                {/* Expiry Date */}
                <FormControl fullWidth>
                    <TextField
                        label="Package Expiry Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formData.expiryDate}
                        onChange={(e) => handleChange("expiryDate", e.target.value)}
                        error={!!errors.expiryDate}
                        helperText={errors.expiryDate}
                        required
                        inputProps={{
                            min: moment().format("YYYY-MM-DD") // Prevent past dates
                        }}
                    />
                </FormControl>

                {/* Pricing Summary */}
                {formData.tests.length > 0 && (
                    <div className="p-4 border border-blue-300 rounded bg-blue-50">
                        <Typography variant="h6" className="mb-3 font-semibold text-gray-800">
                            💰 Pricing Summary
                        </Typography>
                        
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Original Price:</span>
                                <span className="font-semibold">₹{calculatedPricing.originalPrice}</span>
                            </div>
                            
                            <div className="flex justify-between">
                                <span>Discount ({formData.discount}%):</span>
                                <span className="font-semibold text-red-500">-₹{calculatedPricing.savings}</span>
                            </div>
                            
                            <hr className="my-2" />
                            
                            <div className="flex justify-between text-lg">
                                <span className="font-bold">Final Amount:</span>
                                <span className="font-bold text-green-600">₹{calculatedPricing.finalAmount}</span>
                            </div>
                            
                            {calculatedPricing.savings > 0 && (
                                <div className="text-center mt-2">
                                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                        🎉 You save ₹{calculatedPricing.savings}!
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3 mt-8">
                <Button
                    onClick={onClose}
                    disabled={submitLoading}
                >
                    Cancel
                </Button>
                <Button
                    type='primary'
                    onClick={handleSubmit}
                    disabled={submitLoading}
                    className='text-white h-[36px]'
                >
                    {submitLoading ? <CircularProgress size={16} color="inherit" /> : 
                     (currentLabPackage ? "Update Package" : "Create Package")}
                </Button>
            </div>
        </div>
    );
};

export default AddLabPackage;