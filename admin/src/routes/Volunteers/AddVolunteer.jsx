import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Space,
  message,
  Spin,
  Row,
  Col,
  InputNumber,
} from "antd";
import { useEffect, useState } from "react";
import { postData } from "../../api/apiService";
import LocationSearchMui from "../../utils/location";

const { Option } = Select;

const AddVolunteer = ({
  volunteerDrawer,
  setVolunteerDrawer,
  fetchVolunteersList,
  partyMembers = [],
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // address states
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [area, setArea] = useState("");
  const [addressObject, setAddressObject] = useState({});
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    if (Object.keys(addressObject).length > 0 && address) {
      form.setFieldsValue({
        city: addressObject?.city || "",
        state: addressObject?.state || "",
        country: addressObject?.country || "",
        pincode: addressObject?.zip || "",
        address: address || "",
      });
      setCity(addressObject?.city || "");
      setState(addressObject?.state || "");
      setCountry(addressObject?.country || "");
      setPincode(addressObject?.zip || "");
    }
  }, [addressObject, address, form]);

  // Normalize gender value to match backend requirements
  const normalizeGender = (gender) => {
    if (!gender) return "";
    const normalized =
      gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
    // Ensure it's one of the valid values
    if (["Male", "Female", "Other"].includes(normalized)) {
      return normalized;
    }
    return "";
  };

  // Handle party member selection and autopopulate form
  const handlePartyMemberChange = (partyMemberId) => {
    const selectedMember = partyMembers.find(
      (member) => member._id === partyMemberId
    );

    if (selectedMember && selectedMember.user) {
      const user = selectedMember.user;
      const normalizedGender = normalizeGender(user.gender);

      // Store the user ID for the payload (try different possible fields)
      const userId =
        user._id || user.id || user.userId || selectedMember.userId || null;
      setSelectedUserId(userId);

      form.setFieldsValue({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: normalizedGender,
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        pincode: user.pincode || "",
      });

      // Update address states
      setAddress(user.address || "");
      setCity(user.city || "");
      setState(user.state || "");
      setCountry(user.country || "");
      setPincode(user.pincode || "");

      // Set address object if available
      if (user.address) {
        setAddressObject({
          city: user.city || "",
          state: user.state || "",
          country: user.country || "",
          zip: user.pincode || "",
        });
      }
    }
  };

  const onFinish = async (values) => {
    // Ensure gender is normalized
    const normalizedGender = normalizeGender(values.gender);

    if (!normalizedGender) {
      message.error("Please select a valid gender");
      return;
    }

    if (!selectedUserId) {
      message.error("Please select a party member");
      return;
    }

    const payload = {
      name: values.name?.trim(),
      email: values.email?.trim(),
      phone: values.phone?.trim(),
      age: values.age?.toString(),
      gender: normalizedGender,
      occupation: values.occupation?.trim(),
      address: values.address?.trim(),
      areasOfInterest: values.areasOfInterest || [],
      availability: values.availability,
      preferredTimeSlot: values.preferredTimeSlot,
      hoursPerWeek: values.hoursPerWeek?.toString(),
      partyMemberId: values.partyMemberId,
      userId: selectedUserId,
    };

    try {
      setLoading(true);
      const response = await postData(
        "/api/admin/add-or-update-volunteer",
        payload
      );

      if (response?.responseCode === 200) {
        message.success(response?.message || "Volunteer added successfully!");
        setVolunteerDrawer(false);
        form.resetFields();
        resetFormStates();
        fetchVolunteersList?.();
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to save volunteer data");
    } finally {
      setLoading(false);
    }
  };

  const resetFormStates = () => {
    setAddress("");
    setCity("");
    setState("");
    setCountry("");
    setPincode("");
    setAddressObject({});
    setSelectedUserId(null);
  };

  useEffect(() => {
    if (!volunteerDrawer) {
      form.resetFields();
      resetFormStates();
    }
  }, [volunteerDrawer]);

  const handleClose = () => {
    setVolunteerDrawer(false);
    form.resetFields();
    resetFormStates();
  };

  return (
    <Drawer
      open={volunteerDrawer}
      closable={true}
      title={
        <h3 className="text-xl text-center text-black font-semibold">
          Add Volunteer
        </h3>
      }
      footer={null}
      maskClosable={true}
      placement="right"
      width={600}
      extra={
        <CloseOutlined
          onClick={handleClose}
          style={{ fontSize: "16px", cursor: "pointer" }}
        />
      }
      className="custom-drawer"
      onClose={handleClose}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Party Member Selection - First to autopopulate other fields */}
          <Form.Item
            label="Party Member"
            name="partyMemberId"
            rules={[{ required: true, message: "Please select party member" }]}
          >
            <Select
              placeholder="Select party member to autopopulate form"
              showSearch
              optionFilterProp="children"
              onChange={handlePartyMemberChange}
              size="large"
            >
              {partyMembers.map((member) => (
                <Option key={member._id} value={member._id}>
                  {member.user?.name} - {member.memberShipId}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Full Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter the name" },
                  {
                    pattern: /^[A-Za-z ]+$/,
                    message: "Only alphabets are allowed",
                  },
                ]}
              >
                <Input placeholder="Enter volunteer name" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter the email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
          </Row>

          {/* ✅ FIXED: Age and Gender in same row (no empty space) */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Age"
                name="age"
                rules={[
                  //{ required: true, message: "Please enter the age" },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.reject("Please enter the age");
                      if (value < 10 || value > 200)
                        return Promise.reject("Age must be exactly 2 digits ");
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  placeholder="Enter age"
                  maxLength={2}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: "Please select gender" }]}
              >
                <Select placeholder="Select gender">
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Occupation"
                name="occupation"
                rules={[{ required: true, message: "Please enter occupation" }]}
              >
                <Select placeholder="Select occupation">
                  <Option value="Student">Student</Option>
                  <Option value="Teacher">Teacher</Option>
                  <Option value="Doctor">Doctor</Option>
                  <Option value="Engineer">Engineer</Option>
                  <Option value="Social Worker">Social Worker</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              {/* add phone feild */}
              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  { required: true, message: "Please enter the phone" },
                  {
                    pattern: /^\d+$/,
                    message: "Phone number must contain only digits",
                  },
                  { len: 10, message: "Phone number must be 10 digits" },
                ]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
          </Row>

          {/* Address */}
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter the address" }]}
          >
            <LocationSearchMui
              value={address}
              placeholder="Enter Address"
              onChange={setAddress}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              setArea={setArea}
              setAddress={setAddress}
              setAddressObject={setAddressObject}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="City" name="city">
                <Input
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="State" name="state">
                <Input
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Country" name="country">
                <Input
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Pincode" name="pincode">
                <Input
                  placeholder="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Areas of Interest"
            name="areasOfInterest"
            rules={[
              { required: true, message: "Please select areas of interest" },
            ]}
          >
            <Select mode="multiple" placeholder="Select areas of interest">
              <Option value="Education Support">Education Support</Option>
              <Option value="Social Welfare">Social Welfare</Option>
              <Option value="Community Events">Community Events</Option>
              <Option value="Healthcare">Healthcare</Option>
              <Option value="Environment">Environment</Option>
              <Option value="Youth Development">Youth Development</Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Availability"
                name="availability"
                rules={[
                  { required: true, message: "Please select availability" },
                ]}
              >
                <Select placeholder="Select availability">
                  <Option value="Weekdays">Weekdays</Option>
                  <Option value="Weekends">Weekends</Option>
                  <Option value="Both">Both</Option>
                  <Option value="Flexible">Flexible</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Preferred Time Slot"
                name="preferredTimeSlot"
                rules={[
                  { required: true, message: "Please enter preferred time" },
                ]}
              >
                <Select placeholder="Select preferred time slot">
                  <Option value="Morning">Morning</Option>
                  <Option value="Afternoon">Afternoon</Option>
                  <Option value="Evening">Evening</Option>
                  <Option value="Night">Night</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Hours Per Week"
            name="hoursPerWeek"
            rules={[{ required: true, message: "Please enter hours per week" }]}
          >
            <InputNumber
              placeholder="Enter hours"
              min={1}
              max={40}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <div className="spacediv mt-6 text-right">
            <Form.Item>
              <Space>
                <Button
                  htmlType="button"
                  onClick={() => {
                    form.resetFields();
                    resetFormStates();
                  }}
                >
                  Reset
                </Button>

                <Button type="primary" htmlType="submit" loading={loading}>
                  Add Volunteer
                </Button>
              </Space>
            </Form.Item>
          </div>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default AddVolunteer;
