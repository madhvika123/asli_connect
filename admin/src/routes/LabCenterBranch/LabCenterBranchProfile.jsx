import React, { useEffect, useState } from 'react';
import { 
    Button, Card, Tag, Spin, message, Divider, Row, Col, Typography, Modal, 
    Form, Select, Input, InputNumber, DatePicker, TimePicker, Space, Checkbox 
} from 'antd';
import { 
    ArrowLeftOutlined, PhoneOutlined, MailOutlined, GlobalOutlined, 
    EnvironmentOutlined, PlusOutlined, ClockCircleOutlined, 
    CalendarOutlined, MedicineBoxOutlined 
} from '@ant-design/icons';
import { postData,  fetchData } from '../../api/apiService';
import moment from 'moment';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const LabCenterBranchProfile = () => {
    const [loading, setLoading] = useState(false);
    const [branchData, setBranchData] = useState(null);
    const [timeSlots, setTimeSlots] = useState(null);
    const [availableTests, setAvailableTests] = useState([]);
    
    // Modal states
    const [timeSlotsModal, setTimeSlotsModal] = useState(false);
    const [holidayModal, setHolidayModal] = useState(false);
    const [packageModal, setPackageModal] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Forms
    const [timeSlotsForm] = Form.useForm();
    const [holidayForm] = Form.useForm();
    const [packageForm] = Form.useForm();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const branchId = queryParams.get('branchId');

    const navigate = useNavigate();
    const onBack = () => navigate(-1);

    const fetchBranchProfile = async () => {
        try {
            setLoading(true);
            const payload = {
                labCenterBranchId: branchId,
                date: moment().format('YYYY-MM-DD')
            };

            const response = await postData('/api/admin/get-single-lab-center-branch', payload);

            if (response?.responseCode === 200) {
                setBranchData(response.data.labCenterBranch);
                setTimeSlots(response.data.timeSlots);
            } else {
                message.error(response?.message || 'Failed to fetch branch profile');
            }
        } catch (error) {
            message.error(error?.message || 'Failed to fetch branch profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableTests = async () => {
        try {
            const response = await fetchData('/api/admin/list-of-lab-test-dropdown');
            if (response?.responseCode === 200) {
                setAvailableTests(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch tests:', error);
        }
    };

    useEffect(() => {
        if (branchId) {
            fetchBranchProfile();
            fetchAvailableTests();
        }
    }, [branchId]);

    const handleCreateTimeSlots = async (values) => {
        try {
            setSubmitLoading(true);
            const payload = {
                labCenterBranchId: branchId,
                days: values.days,
                timeSlots: values.timeSlots.map(slot => ({
                    startTime: slot.startTime.format('HH:mm'),
                    endTime: slot.endTime.format('HH:mm')
                })),
                slotDuration: values.slotDuration
            };

            const response = await postData('/api/admin/create-lab-center-timeslots', payload);
            
            if (response?.responseCode === 200) {
                message.success('Time slots created successfully');
                setTimeSlotsModal(false);
                timeSlotsForm.resetFields();
                fetchBranchProfile(); // Refresh data
            } else {
                message.error(response?.message || 'Failed to create time slots');
            }
        } catch (error) {
            message.error(error?.message || 'Failed to create time slots');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleCreateHoliday = async (values) => {
        try {
            setSubmitLoading(true);
            const payload = {
                labCenterBranchId: branchId,
                date: values.date.format('YYYY-MM-DD'),
                reason: values.reason,
                description: values.description
            };

            const response = await postData('/api/admin/create-lab-center-branch-holiday', payload);
            
            if (response?.responseCode === 200) {
                message.success('Holiday created successfully');
                setHolidayModal(false);
                holidayForm.resetFields();
            } else {
                message.error(response?.message || 'Failed to create holiday');
            }
        } catch (error) {
            message.error(error?.message || 'Failed to create holiday');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleCreatePackage = async (values) => {
        try {
            setSubmitLoading(true);
            const payload = {
                labCenterBranchId: branchId,
                name: values.name,
                description: values.description,
                tests: values.tests,
                discount: values.discount,
                expiryDate: values.expiryDate.format('YYYY-MM-DD')
            };

            const response = await postData('/api/admin/create-lab-test-package', payload);
            
            if (response?.responseCode === 200) {
                message.success('Test package created successfully');
                setPackageModal(false);
                packageForm.resetFields();
            } else {
                message.error(response?.message || 'Failed to create test package');
            }
        } catch (error) {
            message.error(error?.message || 'Failed to create test package');
        } finally {
            setSubmitLoading(false);
        }
    };

    const renderTimeSlots = (slots, title) => {
        if (!slots || slots.length === 0) return null;

        return (
            <div className="mb-4">
                <Text strong className="text-gray-700 mb-2 block">{title}</Text>
                <div className="flex flex-wrap gap-2">
                    {slots.map((slot, index) => (
                        <Tag
                            key={index}
                            color={slot.isAvailable ? 'green' : 'red'}
                            className="px-3 py-1 rounded-md"
                        >
                            {slot.startTime} - {slot.endTime}
                        </Tag>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Spin size="large" />
            </div>
        );
    }

    if (!branchData) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <Text className="text-gray-500 text-lg mb-4">No branch data available</Text>
                <Button type="primary" onClick={onBack} className="shadow-sm">
                    <ArrowLeftOutlined /> Go Back
                </Button>
            </div>
        );
    }

    const addressString = `${branchData.address || ''}, ${branchData.city || ''}, ${branchData.state || ''}, ${branchData.pincode || ''}, ${branchData.country || ''}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressString)}`;

    return (
        <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={onBack}
                    className="mb-4 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-4 py-2 rounded-lg"
                >
                    Back to Lab Branches
                </Button>
                
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <Title level={1} className="mb-3 text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                {branchData.name}
                            </Title>
                            <Text className="text-gray-600 text-lg block mb-2">
                                Branch ID: <span className="font-semibold text-blue-600">{branchData.labCenterBranchId}</span>
                            </Text>
                            <div className="mt-3">
                                <Tag 
                                    color={branchData.status === 'active' ? 'green' : 'red'} 
                                    className="text-sm px-4 py-2 rounded-full font-medium"
                                >
                                    {branchData.status?.toUpperCase()}
                                </Tag>
                            </div>
                        </div>
                        <div className="text-right bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                            <Text className="text-gray-500 block mb-2">Parent Lab Center</Text>
                            <Text strong className="text-blue-600 text-xl block mb-1">
                                {branchData.labCenter?.name}
                            </Text>
                            <Text className="text-gray-500">
                                Lab ID: {branchData.labCenter?.labId}
                            </Text>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-100">
                        <Button
                            type="primary"
                            icon={<ClockCircleOutlined />}
                            onClick={() => setTimeSlotsModal(true)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 border-0 shadow-md hover:shadow-lg transition-all duration-200 px-6 py-2 h-auto rounded-xl"
                        >
                            Add Time Slots
                        </Button>
                        <Button
                            type="primary"
                            icon={<CalendarOutlined />}
                            onClick={() => setHolidayModal(true)}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 border-0 shadow-md hover:shadow-lg transition-all duration-200 px-6 py-2 h-auto rounded-xl"
                        >
                            Create Branch Holiday
                        </Button>
                        <Button
                            type="primary"
                            icon={<MedicineBoxOutlined />}
                            onClick={() => setPackageModal(true)}
                            className="bg-gradient-to-r from-green-500 to-green-600 border-0 shadow-md hover:shadow-lg transition-all duration-200 px-6 py-2 h-auto rounded-xl"
                        >
                            Create Lab Test Package
                        </Button>
                    </div>
                </div>
            </div>

            <Row gutter={[24, 24]}>
                {/* Contact Information */}
                <Col xs={24} lg={12}>
                    <Card 
                        title={<span className="text-lg font-semibold text-gray-800">Contact Information</span>}
                        className="h-full shadow-lg border-0 rounded-2xl"
                        headStyle={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '16px 16px 0 0' }}
                    >
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                                <PhoneOutlined className="text-blue-500 text-xl" />
                                <div>
                                    <Text className="text-gray-600 block text-sm">Phone</Text>
                                    <Text strong className="text-lg">{branchData.phone || 'N/A'}</Text>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                                <MailOutlined className="text-green-500 text-xl" />
                                <div>
                                    <Text className="text-gray-600 block text-sm">Email</Text>
                                    <Text strong className="text-lg">{branchData.email || 'N/A'}</Text>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                                <GlobalOutlined className="text-purple-500 text-xl" />
                                <div>
                                    <Text className="text-gray-600 block text-sm">Website</Text>
                                    {branchData.website ? (
                                        <a
                                            href={branchData.website.startsWith('http') ? branchData.website : `https://${branchData.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-purple-600 hover:underline font-medium text-lg"
                                        >
                                            {branchData.website}
                                        </a>
                                    ) : (
                                        <Text className="text-lg">N/A</Text>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl">
                                <EnvironmentOutlined className="text-orange-500 text-xl mt-1" />
                                <div>
                                    <Text className="text-gray-600 block text-sm mb-2">Address</Text>
                                    <a
                                        href={mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-orange-600 hover:underline block"
                                    >
                                        <Text strong className="block text-base">{branchData.address}</Text>
                                        <Text className="text-gray-500">
                                            {branchData.city}, {branchData.state} - {branchData.pincode}
                                        </Text>
                                        <Text className="text-gray-400">{branchData.country}</Text>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Services */}
                <Col xs={24} lg={12}>
                    <Card 
                        title={<span className="text-lg font-semibold text-white">Services Available</span>}
                        className="h-full shadow-lg border-0 rounded-2xl"
                        headStyle={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: '16px 16px 0 0' }}
                    >
                        <div className="space-y-6">
                            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                                <Text strong className="block mb-3 text-lg text-gray-800">Home Collection Service</Text>
                                <Tag
                                    color={branchData.homeCollectionService?.isAvailable ? 'green' : 'red'}
                                    className="text-sm px-4 py-2 rounded-full font-medium mb-4"
                                >
                                    {branchData.homeCollectionService?.isAvailable ? 'Available' : 'Not Available'}
                                </Tag>
                                {branchData.homeCollectionService?.isAvailable && (
                                    <div className="bg-white p-4 rounded-lg mt-3 shadow-sm">
                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                <Text className="text-gray-600">Service Radius:</Text>
                                                <Text strong className="text-blue-600">{branchData.homeCollectionService.serviceRadius} km</Text>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                <Text className="text-gray-600">Within Radius:</Text>
                                                <Text strong className="text-green-600">₹{branchData.homeCollectionService.charges?.withinRadius || 0}</Text>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                <Text className="text-gray-600">Beyond Radius:</Text>
                                                <Text strong className="text-orange-600">₹{branchData.homeCollectionService.charges?.beyondRadius || 0}</Text>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <Divider />
                            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                <Text strong className="block mb-3 text-lg text-gray-800">Lab Visit Service</Text>
                                <Tag
                                    color={branchData.labVisitServiceAvailable ? 'green' : 'red'}
                                    className="text-sm px-4 py-2 rounded-full font-medium"
                                >
                                    {branchData.labVisitServiceAvailable ? 'Available' : 'Not Available'}
                                </Tag>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Available Tests */}
                <Col xs={24}>
                    <Card 
                        title={<span className="text-lg font-semibold text-white">Available Tests ({branchData.tests?.length || 0})</span>}
                        className="shadow-lg border-0 rounded-2xl"
                        headStyle={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', borderRadius: '16px 16px 0 0' }}
                    >
                        {branchData.tests && branchData.tests.length > 0 ? (
                            <Row gutter={[16, 16]}>
                                {branchData.tests.map((test) => (
                                    <Col xs={24} sm={12} lg={8} key={test._id}>
                                        <Card 
                                            size="small" 
                                            className="h-full shadow-md hover:shadow-lg transition-all duration-200 border-0 rounded-xl"
                                            bodyStyle={{ padding: '16px' }}
                                        >
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <Text strong className="text-blue-600 text-base">{test.name}</Text>
                                                    <Tag color="green" className="font-medium">₹{test.price}</Tag>
                                                </div>
                                                <Text className="text-gray-600 text-sm block bg-gray-50 px-2 py-1 rounded">
                                                    Test ID: {test.testId}
                                                </Text>
                                                <Text className="text-gray-500 text-sm leading-relaxed">
                                                    {test.description}
                                                </Text>
                                                {test.preparation && test.preparation.length > 0 && (
                                                    <div className="bg-blue-50 p-3 rounded-lg">
                                                        <Text strong className="text-xs text-blue-700 block mb-2">
                                                            Preparation:
                                                        </Text>
                                                        <ul className="text-xs text-blue-600 ml-4 space-y-1">
                                                            {test.preparation.map((prep, index) => (
                                                                <li key={index} className="leading-relaxed">{prep}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🔬</div>
                                <Text className="text-gray-500 text-lg">No tests available</Text>
                            </div>
                        )}
                    </Card>
                </Col>

                {/* Time Slots */}
                {timeSlots && (
                    <Col xs={24}>
                        <Card 
                            title={<span className="text-lg font-semibold text-white">Available Time Slots - {moment().format('MMMM DD, YYYY')}</span>}
                            className="shadow-lg border-0 rounded-2xl"
                            headStyle={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', borderRadius: '16px 16px 0 0' }}
                        >
                            <Row gutter={[24, 16]}>
                                <Col xs={24} md={8}>
                                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl">
                                        {renderTimeSlots(timeSlots.morning, '🌅 Morning Slots')}
                                    </div>
                                </Col>
                                <Col xs={24} md={8}>
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl">
                                        {renderTimeSlots(timeSlots.afternoon, '☀️ Afternoon Slots')}
                                    </div>
                                </Col>
                                <Col xs={24} md={8}>
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
                                        {renderTimeSlots(timeSlots.evening, '🌆 Evening Slots')}
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                )}

                {/* Additional Information */}
                <Col xs={24}>
                    <Card 
                        title={<span className="text-lg font-semibold text-white">Additional Information</span>}
                        className="shadow-lg border-0 rounded-2xl"
                        headStyle={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: '#333', borderRadius: '16px 16px 0 0' }}
                    >
                        <Row gutter={[24, 16]}>
                            <Col xs={24} sm={12}>
                                <div className="space-y-2 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                                    <Text className="text-gray-600 block font-medium">📅 Registration Date</Text>
                                    <Text strong className="text-lg text-green-700">
                                        {branchData.registrationDate ?
                                            moment(branchData.registrationDate).format('MMMM DD, YYYY') :
                                            'N/A'
                                        }
                                    </Text>
                                </div>
                            </Col>
                            <Col xs={24} sm={12}>
                                <div className="space-y-2 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                                    <Text className="text-gray-600 block font-medium">🔄 Last Updated</Text>
                                    <Text strong className="text-lg text-blue-700">
                                        {branchData.updatedAt ?
                                            moment(branchData.updatedAt).format('MMMM DD, YYYY HH:mm') :
                                            'N/A'
                                        }
                                    </Text>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            {/* Time Slots Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2 text-lg">
                        <ClockCircleOutlined className="text-blue-500" />
                        Add Time Slots
                    </div>
                }
                open={timeSlotsModal}
                onCancel={() => {
                    setTimeSlotsModal(false);
                    timeSlotsForm.resetFields();
                }}
                footer={null}
                width={600}
                className="rounded-2xl"
            >
                <Form
                    form={timeSlotsForm}
                    layout="vertical"
                    onFinish={handleCreateTimeSlots}
                    className="mt-4"
                >
                    <Form.Item
                        label="Select Days"
                        name="days"
                        rules={[{ required: true, message: 'Please select at least one day!' }]}
                    >
                        <Checkbox.Group className="w-full">
                            <Row gutter={[8, 8]}>
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                    <Col span={8} key={day}>
                                        <Checkbox value={day} className="text-sm">{day}</Checkbox>
                                    </Col>
                                ))}
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>

                    <Form.Item
                        label="Slot Duration (minutes)"
                        name="slotDuration"
                        rules={[{ required: true, message: 'Please enter slot duration!' }]}
                    >
                        <InputNumber
                            placeholder="e.g., 30"
                            min={15}
                            max={120}
                            step={15}
                            className="w-full"
                        />
                    </Form.Item>

                    <Form.List name="timeSlots">
                        {(fields, { add, remove }) => (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <Text strong>Time Slots</Text>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        icon={<PlusOutlined />}
                                        className="rounded-lg"
                                    >
                                        Add Time Slot
                                    </Button>
                                </div>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div key={key} className="flex gap-4 items-end mb-4 p-4 bg-gray-50 rounded-lg">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'startTime']}
                                            label="Start Time"
                                            rules={[{ required: true, message: 'Please select start time!' }]}
                                            className="mb-0"
                                        >
                                            <TimePicker format="HH:mm" className="w-full" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'endTime']}
                                            label="End Time"
                                            rules={[{ required: true, message: 'Please select end time!' }]}
                                            className="mb-0"
                                        >
                                            <TimePicker format="HH:mm" className="w-full" />
                                        </Form.Item>
                                        <Button
                                            type="text"
                                            danger
                                            onClick={() => remove(name)}
                                            className="mb-0"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </>
                        )}
                    </Form.List>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            onClick={() => {
                                setTimeSlotsModal(false);
                                timeSlotsForm.resetFields();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={submitLoading}
                            className="bg-blue-500 border-0"
                        >
                            Create Time Slots
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Holiday Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2 text-lg">
                        <CalendarOutlined className="text-orange-500" />
                        Create Branch Holiday
                    </div>
                }
                open={holidayModal}
                onCancel={() => {
                    setHolidayModal(false);
                    holidayForm.resetFields();
                }}
                footer={null}
                width={500}
            >
                <Form
                    form={holidayForm}
                    layout="vertical"
                    onFinish={handleCreateHoliday}
                    className="mt-4"
                >
                    <Form.Item
                        label="Holiday Date"
                        name="date"
                        rules={[{ required: true, message: 'Please select holiday date!' }]}
                    >
                        <DatePicker className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="Reason"
                        name="reason"
                        rules={[{ required: true, message: 'Please enter reason!' }]}
                    >
                        <Input placeholder="e.g., National Holiday, Staff Leave" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please enter description!' }]}
                    >
                        <TextArea
                            rows={3}
                            placeholder="Additional details about the holiday..."
                        />
                    </Form.Item>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            onClick={() => {
                                setHolidayModal(false);
                                holidayForm.resetFields();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={submitLoading}
                            className="bg-orange-500 border-0"
                        >
                            Create Holiday
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Test Package Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2 text-lg">
                        <MedicineBoxOutlined className="text-green-500" />
                        Create Lab Test Package
                    </div>
                }
                open={packageModal}
                onCancel={() => {
                    setPackageModal(false);
                    packageForm.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form
                    form={packageForm}
                    layout="vertical"
                    onFinish={handleCreatePackage}
                    className="mt-4"
                >
                    <Form.Item
                        label="Package Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter package name!' }]}
                    >
                        <Input placeholder="e.g., Basic Health Checkup Package" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please enter description!' }]}
                    >
                        <TextArea
                            rows={3}
                            placeholder="Describe what this package includes..."
                        />
                    </Form.Item>

                    <Form.Item
                        label="Select Tests"
                        name="tests"
                        rules={[{ required: true, message: 'Please select at least one test!' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Select tests to include in package"
                            showSearch
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            className="w-full"
                        >
                            {availableTests.map(test => (
                                <Option key={test._id} value={test._id}>
                                    {test.name} - ₹{test.price}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Discount (%)"
                                name="discount"
                                rules={[
                                    { required: true, message: 'Please enter discount!' },
                                    { type: 'number', min: 0, max: 100, message: 'Discount must be between 0-100%' }
                                ]}
                            >
                                <InputNumber
                                    placeholder="e.g., 15"
                                    min={0}
                                    max={100}
                                    className="w-full"
                                    formatter={value => `${value}%`}
                                    parser={value => value.replace('%', '')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Expiry Date"
                                name="expiryDate"
                                rules={[{ required: true, message: 'Please select expiry date!' }]}
                            >
                                <DatePicker 
                                    className="w-full" 
                                    disabledDate={(current) => current && current < moment().endOf('day')}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            onClick={() => {
                                setPackageModal(false);
                                packageForm.resetFields();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={submitLoading}
                            className="bg-green-500 border-0"
                        >
                            Create Package
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default LabCenterBranchProfile;