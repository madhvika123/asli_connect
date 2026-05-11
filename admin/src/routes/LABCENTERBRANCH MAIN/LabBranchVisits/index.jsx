import React, { useEffect, useState } from "react";
import moment from "moment";
import {
    Button,
    message,
    Modal,
    Spin,
    Switch,
    Table,
    Tag,
    Select,
    Card,
    Space,
    Typography,
    Divider,
    Row,
    Col,
    Avatar,
    Tooltip,
    Badge,
    Drawer,
    Form,
    Input,
    DatePicker,
    TimePicker,
    InputNumber,
    Empty
} from "antd";
import {
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    HomeOutlined,
    ExperimentOutlined,
    UserOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    ReloadOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,
    EyeOutlined,
    ClearOutlined
} from "@ant-design/icons";
import { fetchData, postData } from "../../../api/apiService";
import { MdEdit, MdOutlineCancel } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { TbClipboardText } from "react-icons/tb";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const LabBranchVisitsMain = () => {
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [sortOrder, setSortOrder] = useState(-1);
    const [searchValue, setSearchValue] = useState("");
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [form] = Form.useForm();
    const [createLoading, setCreateLoading] = useState(false);

    // Fetch visits data
    const fetchVisits = async (page = 1, pageSize = 10, sort = -1, search = "") => {
        setLoading(true);
        try {
            const params = {
                sort: sort,
                page: page,
                pageSize: pageSize,
                Search: search, // Note: Capital 'S' as per your API requirement
            };

            const response = await postData("/api/labCenterBranch/list-of-visits-by-lab-center-branch", params);

            if (response.responseCode === 200) {
                setVisits(response.data.visits);
                setPagination({
                    current: response.data.page,
                    pageSize: response.data.pageSize,
                    total: response.data.totalVisit,
                });
            } else {
                message.error("Failed to fetch visits");
            }
        } catch (error) {
            console.error("Error fetching visits:", error);
            message.error("Error fetching visits");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisits();
    }, []);

    // Handle table pagination and sorting
    const handleTableChange = (paginationInfo, filters, sorter) => {
        const newSort = sorter.order === 'ascend' ? 1 : -1;
        setSortOrder(newSort);
        fetchVisits(paginationInfo.current, paginationInfo.pageSize, newSort, searchValue);
    };

    // Handle search
    const handleSearch = (value) => {
        setSearchValue(value);
        setPagination(prev => ({ ...prev, current: 1 })); // Reset to first page
        fetchVisits(1, pagination.pageSize, sortOrder, value);
    };

    // Handle search clear
    const handleSearchClear = () => {
        setSearchValue("");
        setPagination(prev => ({ ...prev, current: 1 }));
        fetchVisits(1, pagination.pageSize, sortOrder, "");
    };

    // Handle refresh
    const handleRefresh = () => {
        fetchVisits(pagination.current, pagination.pageSize, sortOrder, searchValue);
    };

    // Handle create visit
    const handleCreateVisit = async (values) => {
        setCreateLoading(true);
        try {
            // Format the data according to your API requirements
            const visitData = {
                patientId: values.patientId,
                visitType: values.visitType,
                visitDateTime: values.visitDateTime.toISOString(),
                complaints: values.complaints,
                vitals: {
                    bp: values.bp,
                    temp: values.temp,
                    pulse: values.pulse,
                    weight: values.weight,
                    height: values.height,
                },
                remark: values.remark || "",
                suggestion: values.suggestion || "",
            };

            // Replace with your actual create visit API endpoint
            const response = await postData("/api/labCenterBranch/create-visit", visitData);

            if (response.responseCode === 200) {
                message.success("Visit created successfully");
                setDrawerVisible(false);
                form.resetFields();
                fetchVisits(pagination.current, pagination.pageSize, sortOrder, searchValue); // Refresh with current filters
            } else {
                message.error("Failed to create visit");
            }
        } catch (error) {
            console.error("Error creating visit:", error);
            message.error("Error creating visit");
        } finally {
            setCreateLoading(false);
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'orange';
            case 'completed':
                return 'green';
            case 'cancelled':
                return 'red';
            default:
                return 'default';
        }
    };

    // Calculate age from date of birth
    const calculateAge = (dateOfBirth) => {
        return moment().diff(moment(dateOfBirth), 'years');
    };

    // Table columns
    const columns = [
        {
            title: 'Visit ID',
            dataIndex: 'visitId',
            key: 'visitId',
            render: (text) => <Text code>{text}</Text>,
        },
        {
            title: 'Patient',
            key: 'patient',
            render: (_, record) => (
                <Space>
                    <Avatar
                        size="small"
                        icon={<UserOutlined />}
                        src={record.patient.avatar}
                    />
                    <div>
                        <div>{record.patient.name}</div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {record.patient.patientId} • Age: {calculateAge(record.patient.dateOfBirth)}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Contact',
            key: 'contact',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Text><PhoneOutlined /> {record.patient.phone}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        <EnvironmentOutlined /> {record.patient.address}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Visit Details',
            key: 'visitDetails',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Space>
                        <Tag color="blue">{record.visitType}</Tag>
                        {record.appointment && (
                            <Tag color="green" icon={<CalendarOutlined />}>
                                Scheduled
                            </Tag>
                        )}
                    </Space>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        <ClockCircleOutlined /> {moment(record.visitDateTime).format('DD MMM YYYY, hh:mm A')}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Vitals',
            key: 'vitals',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Text style={{ fontSize: '12px' }}>BP: {record.vitals.bp}</Text>
                    <Text style={{ fontSize: '12px' }}>Pulse: {record.vitals.pulse}</Text>
                    <Text style={{ fontSize: '12px' }}>Temp: {record.vitals.temp}°F</Text>
                </Space>
            ),
        },
        {
            title: 'Complaints',
            dataIndex: 'complaints',
            key: 'complaints',
            render: (text) => (
                <Tooltip title={text}>
                    <Text ellipsis style={{ maxWidth: 150 }}>
                        {text}
                    </Text>
                </Tooltip>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            render: (status) => (
                <Tag color={getStatusColor(status)} icon={
                    status === 'pending' ? <ClockCircleOutlined /> :
                        status === 'completed' ? <CheckCircleOutlined /> :
                            <ExclamationCircleOutlined />
                }>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Payment',
            dataIndex: 'paid',
            key: 'paid',
            render: (paid) => (
                <Badge
                    status={paid ? 'success' : 'error'}
                    text={paid ? 'Paid' : 'Unpaid'}
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => {/* Handle edit */ }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Input.Search
                    placeholder="Search visits, patients, visit ID..."
                    allowClear
                    enterButton={<SearchOutlined />}
                    size="default"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onSearch={handleSearch}
                    onClear={handleSearchClear}
                    style={{ width: 300 }}
                />

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setDrawerVisible(true)}
                >
                    Add Visit
                </Button>
            </div>

            <Divider />

            {/* Search Results Info */}
            {searchValue && (
                <Card size="small" style={{ marginBottom: '16px' }}>
                    <Space>
                        <Text type="secondary">
                            Search results for: <Text strong>"{searchValue}"</Text>
                        </Text>
                        <Text type="secondary">
                            ({pagination.total} result{pagination.total !== 1 ? 's' : ''} found)
                        </Text>
                        <Button
                            type="link"
                            size="small"
                            icon={<ClearOutlined />}
                            onClick={handleSearchClear}
                        >
                            Clear search
                        </Button>
                    </Space>
                </Card>
            )}

            {/* Statistics Cards */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col span={6}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={2} style={{ color: '#1890ff', margin: 0 }}>
                                {pagination.total}
                            </Title>
                            <Text type="secondary">
                                {searchValue ? 'Found Visits' : 'Total Visits'}
                            </Text>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={2} style={{ color: '#52c41a', margin: 0 }}>
                                {visits.filter(v => v.status === 'completed').length}
                            </Title>
                            <Text type="secondary">Completed</Text>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={2} style={{ color: '#faad14', margin: 0 }}>
                                {visits.filter(v => v.status === 'pending').length}
                            </Title>
                            <Text type="secondary">Pending</Text>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={2} style={{ color: '#f5222d', margin: 0 }}>
                                {visits.filter(v => !v.paid).length}
                            </Title>
                            <Text type="secondary">Unpaid</Text>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Main Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={visits}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} visits`,
                        pageSizeOptions: ['10', '20', '50', '100'],
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 1200 }}
                    locale={{
                        emptyText: searchValue ? (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <Space direction="vertical">
                                        <Text>No visits found for "{searchValue}"</Text>
                                        <Button type="link" onClick={handleSearchClear}>
                                            Clear search and show all visits
                                        </Button>
                                    </Space>
                                }
                            />
                        ) : (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="No visits found"
                            />
                        ),
                    }}
                />
            </Card>

            {/* Create Visit Drawer */}
            <Drawer
                title={
                    <Space>
                        Create New Visit
                    </Space>
                }
                width={600}
                onClose={() => {
                    setDrawerVisible(false);
                    form.resetFields();
                }}
                open={drawerVisible}
            >
            </Drawer>
        </div>
    );
};

export default LabBranchVisitsMain;