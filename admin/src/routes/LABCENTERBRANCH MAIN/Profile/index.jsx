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
  Card, 
  Row, 
  Col, 
  Divider,
  Form,
  Input,
  Select,
  TimePicker,
  DatePicker,
  Space,
  Typography,
  Badge,
  Tooltip
} from "antd";
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  HomeOutlined,
  DollarOutlined
} from "@ant-design/icons";
import { fetchData, postData } from "../../../api/apiService";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = TimePicker;

const ProfileLabBranchMain = () => {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [timeSlotModalVisible, setTimeSlotModalVisible] = useState(false);
  const [holidayModalVisible, setHolidayModalVisible] = useState(false);
  const [timeSlotForm] = Form.useForm();
  const [holidayForm] = Form.useForm();
  const [submittingTimeSlot, setSubmittingTimeSlot] = useState(false);
  const [submittingHoliday, setSubmittingHoliday] = useState(false);

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  const slotDurations = [
    { label: "15 minutes", value: 15 },
    { label: "30 minutes", value: 30 },
    { label: "45 minutes", value: 45 },
    { label: "60 minutes", value: 60 }
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await postData("/api/labCenterBranch/lab-center-branch-profile", {
        date: moment().format("YYYY-MM-DD")
      });
      
      if (response.responseCode === 200) {
        setProfileData(response.data);
      } else {
        message.error("Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      message.error("Error fetching profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTimeSlot = async (values) => {
    setSubmittingTimeSlot(true);
    try {
      const timeSlots = values.timeSlots.map(slot => ({
        startTime: slot[0].format("HH:mm"),
        endTime: slot[1].format("HH:mm")
      }));

      const payload = {
        days: values.days,
        timeSlots: timeSlots,
        slotDuration: values.slotDuration
      };

      const response = await postData("/api/labCenterBranch/create-time-slot-by-lab-center-branch", payload);
      
      if (response.responseCode === 200) {
        message.success("Time slots created successfully!");
        setTimeSlotModalVisible(false);
        timeSlotForm.resetFields();
        fetchProfile(); // Refresh the profile data
      } else {
        message.error("Failed to create time slots");
      }
    } catch (error) {
      console.error("Error creating time slots:", error);
      message.error("Error creating time slots");
    } finally {
      setSubmittingTimeSlot(false);
    }
  };

  const handleCreateHoliday = async (values) => {
    setSubmittingHoliday(true);
    try {
      const payload = {
        date: values.date.format("YYYY-MM-DD"),
        reason: values.reason,
        description: values.description
      };

      const response = await postData("/api/labCenterBranch/create-holiday-by-lab-center-branch", payload);
      
      if (response.responseCode === 200) {
        message.success(`Holiday created on ${values.date.format("YYYY-MM-DD")}!`);
        setHolidayModalVisible(false);
        holidayForm.resetFields();
        fetchProfile(); // Refresh the profile data
      } else {
        message.error("Failed to create holiday");
      }
    } catch (error) {
      console.error("Error creating holiday:", error);
      message.error("Error creating holiday");
    } finally {
      setSubmittingHoliday(false);
    }
  };

  const renderLabInfo = () => {
    if (!profileData?.labCenterBranch) return null;

    const { labCenterBranch } = profileData;

    return (
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HomeOutlined style={{ color: '#1890ff' }} />
            <span>Lab Center Information</span>
          </div>
        }
        className="lab-info-card"
        style={{ marginBottom: 24 }}
      >
        <Row gutter={[24, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <div className="info-item">
              <Text strong>Lab Name:</Text>
              <br />
              <Title level={4} style={{ margin: '4px 0', color: '#1890ff' }}>
                {labCenterBranch.name}
              </Title>
              <Text type="secondary">{labCenterBranch.labCenter?.name}</Text>
            </div>
          </Col>
          
          <Col xs={24} sm={12} lg={8}>
            <div className="info-item">
              <Text strong><PhoneOutlined /> Contact:</Text>
              <br />
              <Text>{labCenterBranch.phone}</Text>
              <br />
              <Text><MailOutlined /> {labCenterBranch.email}</Text>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <div className="info-item">
              <Text strong><GlobalOutlined /> Website:</Text>
              <br />
              <a href={labCenterBranch.website} target="_blank" rel="noopener noreferrer">
                {labCenterBranch.website}
              </a>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <div className="info-item">
              <Text strong><EnvironmentOutlined /> Address:</Text>
              <br />
              <Text>{labCenterBranch.address}</Text>
              <br />
              <Text type="secondary">
                {labCenterBranch.city}, {labCenterBranch.state} - {labCenterBranch.pincode}
              </Text>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <div className="info-item">
              <Text strong>Services:</Text>
              <br />
              <Tag color="green" icon={<HomeOutlined />}>
                Lab Visit Available
              </Tag>
              {labCenterBranch.homeCollectionService?.isAvailable && (
                <Tag color="blue" icon={<HomeOutlined />}>
                  Home Collection
                </Tag>
              )}
            </div>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <div className="info-item">
              <Text strong>Status:</Text>
              <br />
              <Badge 
                status={labCenterBranch.status === 'active' ? 'success' : 'error'} 
                text={labCenterBranch.status.toUpperCase()} 
              />
            </div>
          </Col>
        </Row>

        {labCenterBranch.homeCollectionService?.isAvailable && (
          <Divider />
        )}

        {labCenterBranch.homeCollectionService?.isAvailable && (
          <Row gutter={[24, 16]}>
            <Col span={24}>
              <Title level={5} style={{ color: '#1890ff' }}>
                <HomeOutlined /> Home Collection Service
              </Title>
            </Col>
            <Col xs={24} sm={8}>
              <Text><DollarOutlined /> Within {labCenterBranch.homeCollectionService.serviceRadius}km: </Text>
              <Text strong>₹{labCenterBranch.homeCollectionService.charges.withinRadius}</Text>
            </Col>
            <Col xs={24} sm={8}>
              <Text><DollarOutlined /> Beyond {labCenterBranch.homeCollectionService.serviceRadius}km: </Text>
              <Text strong>₹{labCenterBranch.homeCollectionService.charges.beyondRadius}</Text>
            </Col>
          </Row>
        )}
      </Card>
    );
  };

  const renderTimeSlots = () => {
    if (!profileData?.timeSlots) return null;

    const { timeSlots } = profileData;
    const hasSlots = timeSlots.morning.length > 0 || timeSlots.afternoon.length > 0 || timeSlots.evening.length > 0;

    return (
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ClockCircleOutlined style={{ color: '#52c41a' }} />
            <span>Available Time Slots</span>
          </div>
        }
        style={{ marginBottom: 24 }}
      >
        {hasSlots ? (
          <Row gutter={[16, 16]}>
            {timeSlots.morning.length > 0 && (
              <Col xs={24} sm={8}>
                <Title level={5} style={{ color: '#faad14' }}>Morning</Title>
                <Space wrap>
                  {timeSlots.morning.map((slot, index) => (
                    <Tag 
                      key={index} 
                      color={slot.isAvailable ? 'green' : 'red'}
                      style={{ marginBottom: 4 }}
                    >
                      {slot.startTime} - {slot.endTime}
                    </Tag>
                  ))}
                </Space>
              </Col>
            )}
            
            {timeSlots.afternoon.length > 0 && (
              <Col xs={24} sm={8}>
                <Title level={5} style={{ color: '#fa8c16' }}>Afternoon</Title>
                <Space wrap>
                  {timeSlots.afternoon.map((slot, index) => (
                    <Tag 
                      key={index} 
                      color={slot.isAvailable ? 'green' : 'red'}
                      style={{ marginBottom: 4 }}
                    >
                      {slot.startTime} - {slot.endTime}
                    </Tag>
                  ))}
                </Space>
              </Col>
            )}
            
            {timeSlots.evening.length > 0 && (
              <Col xs={24} sm={8}>
                <Title level={5} style={{ color: '#722ed1' }}>Evening</Title>
                <Space wrap>
                  {timeSlots.evening.map((slot, index) => (
                    <Tag 
                      key={index} 
                      color={slot.isAvailable ? 'green' : 'red'}
                      style={{ marginBottom: 4 }}
                    >
                      {slot.startTime} - {slot.endTime}
                    </Tag>
                  ))}
                </Space>
              </Col>
            )}
          </Row>
        ) : (
          <Text type="secondary">No time slots available</Text>
        )}
      </Card>
    );
  };

  const renderTestsAndPackages = () => {
    if (!profileData?.tests && !profileData?.packages) return null;

    return (
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {profileData.tests && profileData.tests.length > 0 && (
          <Col xs={24} lg={12}>
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <SearchOutlined style={{ color: '#eb2f96' }} />
                  <span>Available Tests ({profileData.tests.length})</span>
                </div>
              }
            >
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {profileData.tests.map((test) => (
                  <Card.Meta
                    key={test._id}
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{test.name}</span>
                        <Tag color="blue">₹{test.price}</Tag>
                      </div>
                    }
                    description={
                      <div>
                        <Text type="secondary">{test.description}</Text>
                        <br />
                        <Tag color="green" size="small">{test.category.name}</Tag>
                      </div>
                    }
                    style={{ marginBottom: 16, padding: '8px 0' }}
                  />
                ))}
              </div>
            </Card>
          </Col>
        )}

        {profileData.packages && profileData.packages.length > 0 && (
          <Col xs={24} lg={12}>
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <PlusOutlined style={{ color: '#13c2c2' }} />
                  <span>Available Packages ({profileData.packages.length})</span>
                </div>
              }
            >
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {profileData.packages.map((pkg) => (
                  <Card.Meta
                    key={pkg._id}
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{pkg.name}</span>
                        <div>
                          <Text delete style={{ marginRight: 8 }}>₹{pkg.originalPrice}</Text>
                          <Tag color="red">₹{pkg.finalAmount}</Tag>
                        </div>
                      </div>
                    }
                    description={
                      <div>
                        <Text type="secondary">{pkg.description}</Text>
                        <br />
                        <Tag color="orange" size="small">{pkg.discount}% OFF</Tag>
                        <Tag color="purple" size="small">
                          Expires: {moment(pkg.expiryDate).format('MMM DD, YYYY')}
                        </Tag>
                      </div>
                    }
                    style={{ marginBottom: 16, padding: '8px 0' }}
                  />
                ))}
              </div>
            </Card>
          </Col>
        )}
      </Row>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Loading profile data...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header with Action Buttons */}
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <Title level={2} style={{ margin: 0 }}>
            Lab Branch Profile
          </Title>
          <Space wrap>
            <Button
              type="primary"
              icon={<ClockCircleOutlined />}
              onClick={() => setTimeSlotModalVisible(true)}
              size="large"
              style={{ 
                background: 'linear-gradient(45deg, #1890ff, #36cfc9)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
              }}
            >
              Create Time Slots
            </Button>
            <Button
              type="primary"
              icon={<CalendarOutlined />}
              onClick={() => setHolidayModalVisible(true)}
              size="large"
              style={{ 
                background: 'linear-gradient(45deg, #fa541c, #faad14)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(250, 84, 28, 0.3)'
              }}
            >
              Create Holiday
            </Button>
          </Space>
        </div>

        {/* Profile Content */}
        {profileData ? (
          <>
            {renderLabInfo()}
            {renderTimeSlots()}
            {renderTestsAndPackages()}
          </>
        ) : (
          <Card>
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Text type="secondary">No profile data available</Text>
            </div>
          </Card>
        )}

        {/* Time Slot Creation Modal */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ClockCircleOutlined style={{ color: '#1890ff' }} />
              <span>Create Time Slots</span>
            </div>
          }
          open={timeSlotModalVisible}
          onCancel={() => {
            setTimeSlotModalVisible(false);
            timeSlotForm.resetFields();
          }}
          footer={null}
          width={600}
          style={{ top: 20 }}
        >
          <Form
            form={timeSlotForm}
            layout="vertical"
            onFinish={handleCreateTimeSlot}
            style={{ marginTop: 16 }}
          >
            <Form.Item
              name="days"
              label="Select Days"
              rules={[{ required: true, message: 'Please select at least one day' }]}
            >
              <Select
                mode="multiple"
                placeholder="Choose days of the week"
                style={{ width: '100%' }}
              >
                {daysOfWeek.map(day => (
                  <Option key={day} value={day}>{day}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="slotDuration"
              label="Slot Duration"
              rules={[{ required: true, message: 'Please select slot duration' }]}
            >
              <Select placeholder="Select slot duration">
                {slotDurations.map(duration => (
                  <Option key={duration.value} value={duration.value}>
                    {duration.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.List
              name="timeSlots"
              rules={[
                {
                  validator: async (_, timeSlots) => {
                    if (!timeSlots || timeSlots.length < 1) {
                      return Promise.reject(new Error('At least one time slot is required'));
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Form.Item
                      label={`Time Slot ${name + 1}`}
                      key={key}
                      style={{ marginBottom: 16 }}
                    >
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Form.Item
                          name={name}
                          rules={[{ required: true, message: 'Please select time range' }]}
                          style={{ flex: 1, marginBottom: 0 }}
                        >
                          <RangePicker
                            format="HH:mm"
                            placeholder={['Start Time', 'End Time']}
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                        />
                      </div>
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      style={{ borderColor: '#1890ff', color: '#1890ff' }}
                    >
                      Add Time Slot
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={() => {
                  setTimeSlotModalVisible(false);
                  timeSlotForm.resetFields();
                }}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submittingTimeSlot}
                  style={{ 
                    background: 'linear-gradient(45deg, #1890ff, #36cfc9)',
                    border: 'none'
                  }}
                >
                  Create Time Slots
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Holiday Creation Modal */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalendarOutlined style={{ color: '#fa541c' }} />
              <span>Create Holiday</span>
            </div>
          }
          open={holidayModalVisible}
          onCancel={() => {
            setHolidayModalVisible(false);
            holidayForm.resetFields();
          }}
          footer={null}
          width={500}
          style={{ top: 20 }}
        >
          <Form
            form={holidayForm}
            layout="vertical"
            onFinish={handleCreateHoliday}
            style={{ marginTop: 16 }}
          >
            <Form.Item
              name="date"
              label="Holiday Date"
              rules={[{ required: true, message: 'Please select a date' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder="Select holiday date"
                disabledDate={(current) => current && current < moment().startOf('day')}
              />
            </Form.Item>

            <Form.Item
              name="reason"
              label="Reason"
              rules={[{ required: true, message: 'Please enter a reason' }]}
            >
              <Input placeholder="Enter reason for holiday" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter a description' }]}
            >
              <TextArea
                rows={3}
                placeholder="Enter detailed description"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={() => {
                  setHolidayModalVisible(false);
                  holidayForm.resetFields();
                }}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submittingHoliday}
                  style={{ 
                    background: 'linear-gradient(45deg, #fa541c, #faad14)',
                    border: 'none'
                  }}
                >
                  Create Holiday
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>

      <style jsx>{`
        .lab-info-card .ant-card-body {
          padding: 24px;
        }
        
        .info-item {
          height: 100%;
          padding: 16px;
          background: #fafafa;
          border-radius: 8px;
          border-left: 4px solid #1890ff;
        }
        
        .ant-tag {
          margin-bottom: 4px;
        }
        
        .ant-card {
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        
        .ant-modal-content {
          border-radius: 12px;
        }
        
        .ant-btn-primary {
          border-radius: 6px;
        }
        
        .ant-form-item-label > label {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default ProfileLabBranchMain;