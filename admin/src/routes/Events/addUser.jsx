import {
  CalendarOutlined,
  CloseOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  message,
  Row,
  Space,
  Spin,
} from "antd";
import LocationSearchMui from "../../utils/location";
import { useEffect, useState } from "react";
import { handleUpload } from "../../utils/FileUpload";
import { useDropzone } from "react-dropzone";
import { fetchData, postData, putData } from "../../api/apiService";

const { Option } = Select;
const { TextArea } = Input;

const AddUser = ({
  patientDrawer,
  setPatientDrawer,
  fetchPatientsList,
  editId = null,
  setEditId,
}) => {
  const [form] = Form.useForm();
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [area, setArea] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [addressObject, setAddressObject] = useState({});
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({});
  const [selectedHospitalId, setSelectedHospitalId] = useState("");
  const [constituencies, setConstituencies] = useState([]);

  useEffect(() => {
    const fetchConstituencies = async () => {
      try {
        const response = await fetchData(
          "/api/user/list-of-constituencies-dropdown"
        );
        setConstituencies(response.data || []);
      } catch (error) {
        console.error("Error fetching constituencies:", error);
      }
    };
    fetchConstituencies();
  }, []);

  // ✅ Update form fields when address object changes (EXACTLY like your first code)
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

  const onFinish = async (values) => {
    console.log(values);
    const isEditMode = Boolean(editId);

    values.date = values.date ? values.date.format("YYYY-MM-DD") : "";
    values.time = values.time ? values.time.format("HH:mm") : "";

    console.log("Processed Form Values:", values);
    try {
      setLoading(true);

      let posterUrl = editData?.poster || ""; // keep existing poster if edit mode

      // If a new poster file is uploaded
      if (values?.poster?.file?.originFileObj) {
        const formData = new FormData();
        formData.append("file", values.poster.file.originFileObj);

        const uploadResponse = await postData(
          "/api/image/uploadImage",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (
          uploadResponse?.responseCode === 200 &&
          uploadResponse?.imagePath1
        ) {
          posterUrl = uploadResponse.imagePath1; // use the uploaded image URL
        } else {
          message.error(uploadResponse?.message || "Failed to upload poster");
          setLoading(false);
          return;
        }
      }

      const payload = {
        title: values?.title?.trim() || "",
        eventType: values?.eventType,
        description: values?.description?.trim() || "",
        date: values?.date,
        time: values?.time,
        location: values?.location?.trim() || "",
        poster: posterUrl,
      };

      if (isEditMode) {
        payload.eventId = editId;
      }

      console.log("Final Payload:", payload);

      const response = await postData("/api/mla/create-event", payload);

      if (response?.responseCode === 200) {
        message.success(response?.message);
        setPatientDrawer(false);
        fetchPatientsList();
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to submit event data");
    } finally {
      setLoading(false);
    }
  };

  const fetchSinglePatient = async () => {
    const payload = {
      patientId: editId,
    };
    try {
      setLoading(true);
      const response = await postData("/api/admin/get-single-patient", payload);
      if (response?.responseCode == 200) {
        setEditData(response?.data);
        form.setFieldsValue({
          patientName: response?.data?.name,
          gender: response?.data?.gender,
          phoneNumber: response?.data?.phone || "",
          emergencyContact: response?.data?.emergencyContact || "",
          dateOfBirth: response?.data?.dateOfBirth,
          aadharNumber: response?.data?.aadhaarNumber || "",
          pincode: response?.data?.pincode || "",
          state: response?.data?.state || "",
          country: response?.data?.country || "",
          address: response?.data?.address || "",
          city: response?.data?.city || "",
          guardianName: response?.data?.guardian?.name,
          guardianRelation: response?.data?.guardian?.relation,
        });
        // ✅ Set location states for auto-population (exactly like your first code)
        setAddress(response?.data?.address || "");
        setCity(response?.data?.city || "");
        setState(response?.data?.state || "");
        setCountry(response?.data?.country || "");
        setPincode(response?.data?.pincode || "");
        if (
          Array.isArray(response?.data?.location?.coordinates) &&
          response?.data?.location?.coordinates.length > 0
        ) {
          setLatitude(response?.data?.location?.coordinates[0]);
          setLongitude(response?.data?.location?.coordinates[1]);
        }
      } else if (response?.responseCode == 400) {
        message.error(response?.message || "Something went wrong");
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to fetch single patient");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(editId);
    if (editId !== null) {
      fetchSinglePatient();
    } else {
      console.log("Rendering this");
      form.resetFields();
      setEditData({});
      // ✅ Reset address states when not in edit mode
      setAddress("");
      setCity("");
      setState("");
      setCountry("");
      setPincode("");
      setAddressObject({});
      setLatitude("");
      setLongitude("");
      setSelectedHospitalId("");
    }
  }, [editId, patientDrawer]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles, rejectedFiles) => {
      // Allow file types for insurance details
      const validExtensions = [".png", ".jpg", ".jpeg", ,];

      acceptedFiles.forEach(async (file) => {
        const fileExtension = file.name
          .slice(file.name.lastIndexOf("."))
          .toLowerCase();

        if (!validExtensions.includes(fileExtension)) {
          message.error(
            "Unsupported file type. Please upload files in formats: PNG, JPG, JPEG"
          );
          return;
        }

        // Set preview for images, and icons for other types
        setFile(
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );

        // handleUpload(file);
        try {
          // Handle file upload and get the returned URL
          const Url = await handleUpload(file);

          setImageUrl(Url);
        } catch (error) {
          message.error("File upload failed. Please try again.");
        }
      });
    },
    maxFiles: 1, // Limit to one file at a time
  });

  const handleClose = () => {
    setEditId(null);
    setPatientDrawer(false);
    form.resetFields();
    setAddress("");
    setCity("");
    setState("");
    setCountry("");
    setPincode("");
    setAddressObject({});
    setLatitude(null);
    setLongitude(null);
    setFile(null);
    setImageUrl(null);
  };

  return (
    <Drawer
      open={patientDrawer}
      closable={true}
      title={
        <h3 className="text-xl text-center text-black font-semibold ">
          {editId ? "Update" : "Add"} Event
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
          {/* Row 1: Event Title and Event Type */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Event Title"
                name="title"
                initialValue={editData?.title || ""}
                rules={[
                  { required: true, message: "Please enter event title" },
                  {
                    pattern: /^[A-Za-z ]+$/,
                    message: "Only alphabets and spaces are allowed",
                  },
                ]}
              >
                <Input
                  placeholder="Enter Event Title"
                  onChange={(e) => {
                    const onlyText = e.target.value.replace(/[^A-Za-z ]/g, "");
                    form.setFieldsValue({ title: onlyText });
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Event Type"
                name="eventType"
                rules={[
                  { required: true, message: "Please select event type" },
                ]}
              >
                <Select placeholder="Select Event Type">
                  <Option value="conference">Conference</Option>
                  <Option value="workshop">Workshop</Option>
                  <Option value="seminar">Seminar</Option>
                  <Option value="meetup">Meetup</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Row 2: Event Date and Event Time */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Event Date"
                name="date"
                initialValue={editData?.date || ""}
                rules={[
                  { required: true, message: "Please select event date" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Select Event Date"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Event Time"
                name="time"
                initialValue={editData?.time || ""}
                rules={[
                  { required: true, message: "Please select event time" },
                ]}
              >
                <TimePicker
                  style={{ width: "100%" }}
                  placeholder="Select Event Time"
                  format="HH:mm"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Address - Full Width */}
          <Form.Item label="Address" name="address">
            <LocationSearchMui
              value={address}
              placeholder="Enter Address"
              onChange={(value) => {
                setAddress(value);
              }}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              setArea={setArea}
              setAddress={setAddress}
              setAddressObject={setAddressObject}
            />
          </Form.Item>

          {/* Row 3: City and State */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="City"
                name="city"
                initialValue={editData?.city || ""}
              >
                <Input
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="State"
                name="state"
                initialValue={editData?.state || ""}
              >
                <Input
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 4: Country and Pincode */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Country"
                name="country"
                initialValue={editData?.country || ""}
              >
                <Input
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Pincode"
                name="pincode"
                initialValue={editData?.pincode || ""}
              >
                <Input
                  placeholder="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Location - Full Width */}
          <Form.Item
            label="Location"
            name="location"
            initialValue={editData?.location || ""}
            rules={[{ required: true, message: "Please enter event location" }]}
          >
            <Input placeholder="Enter Event Location" />
          </Form.Item>

          {/* Description - Full Width */}
          <Form.Item
            label="Description"
            name="description"
            initialValue={editData?.description || ""}
            rules={[
              {
                required: true,
                message: "Please enter event description",
              },
            ]}
          >
            <TextArea rows={4} placeholder="Enter Event Description" />
          </Form.Item>

          {/* Poster Upload - Full Width */}
          <Form.Item
            label="Poster"
            name="poster"
            initialValue={editData?.poster || ""}
            rules={[{ required: true, message: "Please upload event poster" }]}
          >
            <Input type="file" accept="image/*" />
          </Form.Item>

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
                    setCountry("");
                    setPincode("");
                    setAddressObject({});
                    setLatitude(null);
                    setLongitude(null);
                    setFile(null);
                    setImageUrl(null);
                  }}
                >
                  Reset
                </Button>

                <Button type="primary" htmlType="submit" loading={loading}>
                  {editId ? "Update" : "Add"}
                </Button>
              </Space>
            </Form.Item>
          </div>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default AddUser;
