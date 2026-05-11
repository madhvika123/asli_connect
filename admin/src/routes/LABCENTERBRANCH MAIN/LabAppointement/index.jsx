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
  Badge
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
  ExclamationCircleOutlined
} from "@ant-design/icons";
import { fetchData, postData } from "../../../api/apiService";
import { MdEdit, MdOutlineCancel } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { TbClipboardText } from "react-icons/tb";

const { Title, Text } = Typography;
const { Option } = Select;

const LabBranchAppointementMain = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    status: "",
    page: 1,
    pageSize: 10
  });
  
  // Modal state
  const [statusModal, setStatusModal] = useState({
    visible: false,
    appointment: null,
    newStatus: ""
  });

  // Status options and colors
  const statusOptions = [
    { value: "", label: "All Appointments", color: "default" },
    { value: "Scheduled", label: "Scheduled", color: "blue" },
    { value: "Sample-collected", label: "Sample Collected", color: "orange" },
    { value: "Completed", label: "Completed", color: "green" },
    { value: "Cancelled", label: "Cancelled", color: "red" }
  ];

  const getStatusColor = (status) => {
    const statusMap = {
      "Scheduled": "blue",
      "Sample-collected": "orange", 
      "Completed": "green",
      "Cancelled": "red"
    };
    return statusMap[status] || "default";
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      "Scheduled": <CalendarOutlined />,
      "Sample-collected": <ExperimentOutlined />,
      "Completed": <CheckCircleOutlined />,
      "Cancelled": <ExclamationCircleOutlined />
    };
    return iconMap[status] || <CalendarOutlined />;
  };

  // Fetch appointments
  const fetchAppointments = async (params = filters) => {
    try {
      setLoading(true);
      const response = await postData("/api/labCenterBranch/list-of-appointments-by-lab-center-branch", params);
      
      if (response.responseCode === 200) {
        setAppointments(response.data.appointments);
        setPagination(prev => ({
          ...prev,
          total: response.data.totalAppointments,
          current: response.data.page
        }));
      }
    } catch (error) {
      message.error("Failed to fetch appointments");
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update appointment status
  const updateAppointmentStatus = async () => {
    try {
      setUpdateLoading(true);
      const params = {
        appointmentId: statusModal.appointment._id,
        status: statusModal.newStatus,
        cancelReason: statusModal.newStatus === "Cancelled" ? "Cancelled by lab" : ""
      };

      const response = await postData("/api/labCenterBranch/update-appoitment-status-by-lab-center-branch", params);
      
      if (response.responseCode === 200) {
        message.success(`Appointment status changed to ${statusModal.newStatus}`);
        setStatusModal({ visible: false, appointment: null, newStatus: "" });
        fetchAppointments(); // Refresh the list
      }
    } catch (error) {
      message.error("Failed to update appointment status");
      console.error("Error updating status:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle status filter change
  const handleStatusFilter = (value) => {
    const newFilters = { ...filters, status: value, page: 1 };
    setFilters(newFilters);
    fetchAppointments(newFilters);
  };

  // Handle pagination change
  const handleTableChange = (paginationInfo) => {
    const newFilters = {
      ...filters,
      page: paginationInfo.current,
      pageSize: paginationInfo.pageSize
    };
    setFilters(newFilters);
    setPagination(paginationInfo);
    fetchAppointments(newFilters);
  };

  // Open status update modal
  const openStatusModal = (appointment, newStatus) => {
    setStatusModal({
      visible: true,
      appointment,
      newStatus
    });
  };

  // Table columns
  const columns = [
    {
      title: "Appointment ID",
      dataIndex: "appointmentId",
      key: "appointmentId",
      width: 130,
      render: (text) => (
        <Text strong style={{ color: "#1890ff" }}>
          {text}
        </Text>
      )
    },
    {
      title: "Patient Details",
      key: "patient",
      width: 200,
      render: (record) => (
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
            <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8 }} />
            <Text strong>{record.patient.name}</Text>
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            <PhoneOutlined style={{ marginRight: 4 }} />
            {record.patient.phone}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            ID: {record.patient.patientId}
          </div>
        </div>
      )
    },
    {
      title: "Date & Time",
      key: "datetime",
      width: 140,
      render: (record) => (
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
            <CalendarOutlined style={{ marginRight: 4, color: "#1890ff" }} />
            <Text>{moment(record.appointmentDate).format("DD MMM YYYY")}</Text>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <ClockCircleOutlined style={{ marginRight: 4, color: "#52c41a" }} />
            <Text>{record.timeSlot}</Text>
          </div>
        </div>
      )
    },
    {
      title: "Consultation Type",
      dataIndex: "consultationType",
      key: "consultationType",
      width: 130,
      render: (type) => (
        <Tag 
          icon={type === "home-collection" ? <HomeOutlined /> : <ExperimentOutlined />}
          color={type === "home-collection" ? "volcano" : "geekblue"}
        >
          {type === "home-collection" ? "Home Collection" : "Lab Visit"}
        </Tag>
      )
    },
    {
      title: "Tests & Packages",
      key: "testsPackages",
      width: 200,
      render: (record) => (
        <div>
          {record.tests.length > 0 && (
            <div style={{ marginBottom: 4 }}>
              <Text strong style={{ fontSize: "12px", color: "#1890ff" }}>
                Tests ({record.tests.length}):
              </Text>
              {record.tests.slice(0, 2).map((test, idx) => (
                <div key={idx} style={{ fontSize: "11px", color: "#666" }}>
                  • {test.name}
                </div>
              ))}
              {record.tests.length > 2 && (
                <Text style={{ fontSize: "11px", color: "#1890ff" }}>
                  +{record.tests.length - 2} more
                </Text>
              )}
            </div>
          )}
          {record.packages.length > 0 && (
            <div>
              <Text strong style={{ fontSize: "12px", color: "#52c41a" }}>
                Packages ({record.packages.length}):
              </Text>
              {record.packages.map((pkg, idx) => (
                <div key={idx} style={{ fontSize: "11px", color: "#666" }}>
                  • {pkg.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      title: "Fee",
      dataIndex: "consultationFee",
      key: "consultationFee",
      width: 80,
      render: (fee) => (
        <Text strong style={{ color: "#52c41a" }}>
          ₹{fee}
        </Text>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag 
          icon={getStatusIcon(status)}
          color={getStatusColor(status)}
          style={{ fontWeight: "bold" }}
        >
          {status}
        </Tag>
      )
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (record) => (
        <Space>
          {record.status !== "Completed" && record.status !== "Cancelled" && (
            <Select
              placeholder="Update Status"
              style={{ width: 140 }}
              onChange={(value) => openStatusModal(record, value)}
              size="small"
            >
              {statusOptions
                .filter(option => option.value !== "" && option.value !== record.status)
                .map(option => (
                  <Option key={option.value} value={option.value}>
                    <Tag color={option.color} style={{ margin: 0 }}>
                      {option.label}
                    </Tag>
                  </Option>
                ))
              }
            </Select>
          )}
        </Space>
      )
    }
  ];

  // Load appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div >
      <Card>
      
        {/* Filters */}
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter by Status"
              style={{ width: "100%" }}
              value={filters.status}
              onChange={handleStatusFilter}
              allowClear
            >
              {statusOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  <Tag color={option.color} style={{ margin: 0 }}>
                    {option.label}
                  </Tag>
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        {/* Summary Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={12} sm={6}>
            <Card size="small" style={{ textAlign: "center", background: "#e6f7ff" }}>
              <Text strong style={{ color: "#1890ff" }}>Total</Text>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#1890ff" }}>
                {pagination.total}
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small" style={{ textAlign: "center", background: "#f6ffed" }}>
              <Text strong style={{ color: "#52c41a" }}>Completed</Text>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#52c41a" }}>
                {appointments.filter(apt => apt.status === "Completed").length}
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small" style={{ textAlign: "center", background: "#fff7e6" }}>
              <Text strong style={{ color: "#fa8c16" }}>Pending</Text>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fa8c16" }}>
                {appointments.filter(apt => apt.status === "Scheduled" || apt.status === "Sample-collected").length}
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small" style={{ textAlign: "center", background: "#fff2f0" }}>
              <Text strong style={{ color: "#ff4d4f" }}>Cancelled</Text>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ff4d4f" }}>
                {appointments.filter(apt => apt.status === "Cancelled").length}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Appointments Table */}
        <Table
          columns={columns}
          dataSource={appointments}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} appointments`
          }}
          onChange={handleTableChange}
          rowKey="_id"
          scroll={{ x: 1200 }}
          size="small"
        />

        {/* Status Update Modal */}
        <Modal
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <ExclamationCircleOutlined 
                style={{ color: "#faad14", marginRight: "12px", fontSize: "20px" }} 
              />
              <span>Confirm Status Update</span>
            </div>
          }
          open={statusModal.visible}
          onOk={updateAppointmentStatus}
          onCancel={() => setStatusModal({ visible: false, appointment: null, newStatus: "" })}
          confirmLoading={updateLoading}
          okText="Yes, Update Status"
          cancelText="Cancel"
          width={500}
          centered
        >
          {statusModal.appointment && (
            <div style={{ padding: "16px 0" }}>
              <Card size="small" style={{ marginBottom: "16px", background: "#fafafa" }}>
                <Row gutter={[16, 8]}>
                  <Col span={24}>
                    <Text strong>Appointment Details:</Text>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">ID:</Text> {statusModal.appointment.appointmentId}
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">Patient:</Text> {statusModal.appointment.patient.name}
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">Current Status:</Text>{" "}
                    <Tag color={getStatusColor(statusModal.appointment.status)}>
                      {statusModal.appointment.status}
                    </Tag>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">Date:</Text>{" "}
                    {moment(statusModal.appointment.appointmentDate).format("DD MMM YYYY")}
                  </Col>
                </Row>
              </Card>

              <div style={{ textAlign: "center", padding: "16px" }}>
                <Text style={{ fontSize: "16px" }}>
                  Are you sure you want to change the status from{" "}
                  <Tag color={getStatusColor(statusModal.appointment.status)}>
                    {statusModal.appointment.status}
                  </Tag>
                  {" "}to{" "}
                  <Tag color={getStatusColor(statusModal.newStatus)}>
                    {statusModal.newStatus}
                  </Tag>
                  ?
                </Text>
              </div>

              {statusModal.newStatus === "Cancelled" && (
                <div style={{ 
                  background: "#fff2f0", 
                  padding: "12px", 
                  borderRadius: "6px",
                  border: "1px solid #ffccc7"
                }}>
                  <Text type="danger">
                    <ExclamationCircleOutlined style={{ marginRight: "8px" }} />
                    This action will cancel the appointment and cannot be undone.
                  </Text>
                </div>
              )}
            </div>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default LabBranchAppointementMain;