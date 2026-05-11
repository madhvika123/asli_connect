import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  message,
  Row,
  Spin,
  Select,
  Space,
} from "antd";
import LocationSearchMui from "../../utils/location";
import { useEffect, useState } from "react";
import { fetchData, postData } from "../../api/apiService";

const { Option } = Select;

const AddMLAUSER = ({ patientDrawer, setPatientDrawer, fetchPatientsList }) => {
  const [form] = Form.useForm();
  const [address, setAddress] = useState("");
  const [addressObject, setAddressObject] = useState({});
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [constituencies, setConstituencies] = useState([]);
  const [parties, setParties] = useState([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // Fetch constituencies
        const constituenciesResponse = await fetchData(
          "/api/user/list-of-constituencies-dropdown"
        );
        setConstituencies(constituenciesResponse.data || []);

        // Fetch parties
        const partiesResponse = await postData("/api/admin/list-of-parties", {
          page: 1,
          pageSize: 1000,
          isPartyMember: false,
          search: "",
          sortBy: "-1",
        });
        if (partiesResponse?.responseCode === 200) {
          setParties(
            (partiesResponse?.data?.data || []).filter((p) => p.isActive)
          );
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
    fetchDropdownData();
  }, []);

  // Update form fields when address object changes
  useEffect(() => {
    if (Object.keys(addressObject).length > 0 && address) {
      form.setFieldsValue({
        city: addressObject?.city || "",
        state: addressObject?.state || "",
        pincode: addressObject?.zip || "",
        address: address || "",
      });
      setCity(addressObject?.city || "");
      setState(addressObject?.state || "");
      setPincode(addressObject?.zip || "");
    }
  }, [addressObject, address, form]);

  const onFinish = async (values) => {
    const payload = {
      name: values?.name?.trim() || "",
      phone: values?.phone?.trim() || "",
      password: values?.password?.trim() || "",
      constituencyId: values?.constituencyId || "",
      email: values?.email?.trim() || undefined,
      partyId: values?.partyId || undefined,
      address: address?.trim() || undefined,
      state: state?.trim() || undefined,
      city: city?.trim() || undefined,
      district: values?.district?.trim() || undefined,
      pincode: pincode?.trim() || undefined,
      gender: values?.gender || undefined,
      isAdminCreated: true,
    };

    // Remove undefined fields
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    try {
      setLoading(true);
      const response = await postData("/api/admin/create-mla", payload);
      if (response?.responseCode === 200) {
        message.success(response?.message || "MLA created successfully");
        setPatientDrawer(false);
        form.resetFields();
        setAddress("");
        setCity("");
        setState("");
        setPincode("");
        setAddressObject({});
        fetchPatientsList();
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to create MLA");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!patientDrawer) {
      form.resetFields();
      setAddress("");
      setCity("");
      setState("");
      setPincode("");
      setAddressObject({});
    }
  }, [patientDrawer, form]);

  const handleClose = () => {
    setPatientDrawer(false);
    form.resetFields();
    setAddress("");
    setCity("");
    setState("");
    setPincode("");
    setAddressObject({});
  };

  return (
    <Drawer
      open={patientDrawer}
      closable={true}
      title={
        <h3 className="text-xl text-center text-black font-semibold ">
          Add MLA
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
          {/* Row 1: MLA Name and Phone */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="MLA Name"
                name="name"
                rules={[{ required: true, message: "Please enter MLA Name" }]}
              >
                <Input placeholder="Enter MLA Name" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  { required: true, message: "Please enter phone number" },
                  {
                    pattern: /^\d+$/,
                    message: "Phone must contain only digits",
                  },
                  { len: 10, message: "Phone number must be 10 digits" },
                ]}
              >
                <Input placeholder="Enter Phone Number" maxLength={10} />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 2: Password and Email */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter password" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password placeholder="Enter Password" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ type: "email", message: "Please enter valid email" }]}
              >
                <Input placeholder="Enter Email (Optional)" />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 3: Constituency and Party */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Constituency"
                name="constituencyId"
                rules={[
                  { required: true, message: "Please select constituency" },
                ]}
              >
                <Select
                  placeholder="Select Constituency"
                  showSearch
                  optionFilterProp="children"
                >
                  {constituencies.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Party" name="partyId">
                <Select
                  placeholder="Select Party (Optional)"
                  showSearch
                  optionFilterProp="children"
                >
                  {parties.map((p) => (
                    <Option key={p._id} value={p._id}>
                      {p.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Row 4: Gender and District */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Gender" name="gender">
                <Select placeholder="Select Gender (Optional)">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Others</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="District" name="district">
                <Input placeholder="Enter District (Optional)" />
              </Form.Item>
            </Col>
          </Row>

          {/* Address - Full Width */}
          <Form.Item label="Address" name="address">
            <LocationSearchMui
              value={address}
              placeholder="Enter Address (Optional)"
              onChange={(value) => {
                setAddress(value);
              }}
              setAddress={setAddress}
              setAddressObject={setAddressObject}
            />
          </Form.Item>

          {/* Row 5: City and State */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="City" name="city">
                <Input
                  placeholder="City (Optional)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="State" name="state">
                <Input
                  placeholder="State (Optional)"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 6: Pincode */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Pincode" name="pincode">
                <Input
                  placeholder="Pincode (Optional)"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Buttons - Exactly like your volunteer form */}
          <div className="spacediv mt-6 text-right">
            <Form.Item>
              <Space>
                <Button
                  htmlType="button"
                  onClick={() => {
                    form.resetFields();
                    setAddress("");
                    setCity("");
                    setState("");
                    setPincode("");
                    setAddressObject({});
                  }}
                >
                  Reset
                </Button>

                <Button type="primary" htmlType="submit" loading={loading}>
                  Add
                </Button>
              </Space>
            </Form.Item>
          </div>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default AddMLAUSER;
