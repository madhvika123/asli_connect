import {
  CalendarOutlined,
  CloseOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { MenuItem, TextField } from "@mui/material";
import { Button, Col, Drawer, Form, message, Row, Space, Spin } from "antd";
import { IoPersonCircle } from "react-icons/io5";
import { CgWebsite } from "react-icons/cg";
import LocationSearchMui from "../../../utils/location";
import { useEffect, useState } from "react";
import { BiSolidTrash } from "react-icons/bi";
import { handleUpload } from "../../../utils/FileUpload";
import { useDropzone } from "react-dropzone";
import { IoMdCloudUpload } from "react-icons/io";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { RiLockPasswordLine } from "react-icons/ri";
import { fetchData, postData, putData } from "../../../api/apiService";
import { autocompleteStyles, CustomPaper } from "../../../utils/autoCompleteCss";
import { TbMapPinCode } from "react-icons/tb";
import { FaLocationDot, FaTransgender, FaWheelchair } from "react-icons/fa6";
import { HiOutlineIdentification } from "react-icons/hi2";

const AddBranchPatient = ({
  branchPatientModal,
  setBranchPatientModal,
  fetchPatientsList,
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

  const onFinish = async (values) => {
    console.log(values);
    const payload = {
      name: values?.patientName?.trim() || "",
      gender: values?.gender,
      phone: values?.phoneNumber?.trim() || "",
      emergencyContact: values?.emergencyContact?.trim() || "",
      dateOfBirth: values?.dateOfBirth,
      address: address || "",
      city: city?.trim() || "",
      state: state?.trim() || "",
      country: country?.trim() || "",
      aadhaarNumber: values?.aadharNumber?.trim() || "",
      avatar: "",
      pincode: pincode?.trim() || "",
      guardian: {
        name: values?.guardianName,
        relation: values?.guardianRelation,
      },
    };
    console.log(payload);

    console.log(payload);
    try {
      setLoading(true);
      const response = await postData(
        "/api/branch/create-patient-for-branch",
        payload
      );
      if (response?.responseCode === 200) {
        message.success(response?.message);
        setBranchPatientModal(false);
        fetchPatientsList();
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to submit patient data");
    } finally {
      setLoading(false);
    }
  };

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

        // Check if the file exceeds the size limit (5MB)
        // if (file.size > 5242880) {
        //   message.error("File size exceeds the maximum limit of 5MB.");
        //   return;
        // }

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

  useEffect(() => {
    console.log(addressObject);
    if (Object?.keys(addressObject)?.length > 0 && address) {
      form?.setFieldsValue({
        city: addressObject?.city || "",
        state: addressObject?.state || "",
        country: addressObject?.country || "",
        pincode: addressObject?.zip || "",
      });
      setCity(addressObject?.city || "");
      setState(addressObject?.state || "");
      setCountry(addressObject?.country || "");
      setPincode(addressObject?.zip || "");
    }
    //  else {
    //   // Clear form values
    //   form?.setFieldsValue({
    //     city: "",
    //     state: "",
    //     country: "",
    //     pincode: "",
    //   });
    //   // Clear local state values
    //   setCity("");
    //   setState("");
    //   setCountry("");
    //   setPincode("");
    // }
  }, [addressObject, address]);

  return (
    <Spin spinning={loading}>
      <Form
        layout='vertical'
        form={form}
        onFinish={onFinish}
        className='client-details-form custom-form-ant'>
        <Spin spinning={loading}>
          <div className='min-h-[52dvh] max-h-[52dvh] overflow-y-auto overflow-x-hidden pr-1 pt-2 custom-scrollbard'>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='patientName'
                  initialValue={editData?.patientName || ""}
                  rules={[
                    {
                      required: true,
                      message: "Please enter Patient Name",
                    },
                    {
                      pattern: /^[a-zA-Z0-9 ]*$/,
                      message: "Only alphabets and numbers are allowed",
                    },
                  ]}>
                  <TextField
                    label={
                      <div className='flex items-center'>
                        <FaWheelchair
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                        <div>Patient Name *</div>
                      </div>
                    }
                    variant='outlined'
                    fullWidth
                    size='small'
                    type='text'
                    placeholder='Enter Patient Name'
                    InputProps={{
                      style: { height: 40 },
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='phoneNumber'
                  initialValue={editData?.phone || ""}
                  rules={[
                    {
                      required: true,
                      message: "Please enter patient phone number",
                    },
                    {
                      pattern: /^\d+$/,
                      message: "Phone number must contain only digits",
                    },
                    {
                      len: 10,
                      message: "Phone number must be 10 digits",
                    },
                  ]}>
                  <TextField
                    variant='outlined'
                    fullWidth
                    label={
                      <div className='flex items-center'>
                        <PhoneOutlined
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                        <div>Phone Number *</div>
                      </div>
                    }
                    size='small'
                    placeholder='Enter Patient Phone Number'
                    InputProps={{
                      style: { height: 40 },
                      classes: { input: "no-arrows" },
                    }}
                    inputProps={{
                      maxLength: 10,
                    }}
                    onChange={(e) => {
                      if (
                        !/^\d+$/.test(e.target.value) &&
                        e.target.value !== ""
                      )
                        return;
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='emergencyContact'
                  initialValue={editData?.phone || ""}
                  rules={[
                    {
                      required: true,
                      message: "Please enter emergency contact",
                    },
                    {
                      pattern: /^\d+$/,
                      message: "Phone number must contain only digits",
                    },
                    {
                      len: 10,
                      message: "Phone number must be 10 digits",
                    },
                  ]}>
                  <TextField
                    variant='outlined'
                    fullWidth
                    label={
                      <div className='flex items-center'>
                        <PhoneOutlined
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                        <div>Emergency Contact Number *</div>
                      </div>
                    }
                    size='small'
                    placeholder='Enter Emergency contact Number'
                    InputProps={{
                      style: { height: 40 },
                      classes: { input: "no-arrows" },
                    }}
                    inputProps={{
                      maxLength: 10,
                    }}
                    onChange={(e) => {
                      if (
                        !/^\d+$/.test(e.target.value) &&
                        e.target.value !== ""
                      )
                        return;
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='aadharNumber'
                  initialValue={editData?.aadharNumber || ""}
                  rules={[
                    {
                      required: false,
                      message: "Please enter aadhar number",
                    },
                    {
                      pattern: /^\d+$/,
                      message: "aadhar number must contain only digits",
                    },
                    {
                      len: 12,
                      message: "Aadhar number must be 12 digits",
                    },
                  ]}>
                  <TextField
                    variant='outlined'
                    fullWidth
                    label={
                      <div className='flex items-center'>
                        <HiOutlineIdentification
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                        <div>Aadhar Number</div>
                      </div>
                    }
                    size='small'
                    placeholder='Enter aadhar number'
                    InputProps={{
                      style: { height: 40 },
                      classes: { input: "no-arrows" },
                    }}
                    inputProps={{
                      maxLength: 12,
                    }}
                    onChange={(e) => {
                      if (
                        !/^\d+$/.test(e.target.value) &&
                        e.target.value !== ""
                      )
                        return;
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='gender'
                  initialValue={editData?.gender || ""}
                  rules={[
                    {
                      required: true,
                      message: "Please select gender",
                    },
                  ]}>
                  <TextField
                    select
                    fullWidth
                    size='small'
                    label={
                      <div className='flex items-center'>
                        <FaTransgender
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                        <div>Gender *</div>
                      </div>
                    }
                    placeholder='Select Gender'>
                    <MenuItem value='male'>Male</MenuItem>
                    <MenuItem value='female'>Female</MenuItem>
                    <MenuItem value='other'>Others</MenuItem>
                  </TextField>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='dateOfBirth'
                  rules={[
                    {
                      required: false,
                      message: "Please select date of birth",
                    },
                  ]}
                  initialValue={editData?.dateOfBirth}>
                  <TextField
                    type='date'
                    onClick={(e) => e.target.showPicker()}
                    fullWidth
                    label={
                      <div className='flex items-center'>
                        <CalendarOutlined
                          style={{ marginRight: 8, fontSize: 20 }}
                        />{" "}
                        <div>Date of Birth</div>
                      </div>
                    }
                    size='small'
                    variant='outlined'
                    InputLabelProps={{ shrink: true }}
                    onKeyDown={(e) => e.preventDefault()}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='guardianName'
                  initialValue={editData?.guardian?.name || ""}
                  rules={[
                    {
                      required: true,
                      message: "Please enter Guardian Name",
                    },
                    {
                      pattern: /^[a-zA-Z0-9 ]*$/,
                      message: "Only alphabets and numbers are allowed",
                    },
                  ]}>
                  <TextField
                    label={
                      <div className='flex items-center'>
                        <IoPersonCircle
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                        <div>Guardian Name *</div>
                      </div>
                    }
                    variant='outlined'
                    fullWidth
                    size='small'
                    type='text'
                    placeholder='Enter Guardian Name'
                    InputProps={{
                      style: { height: 40 },
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='guardianRelation'
                  initialValue={editData?.guardian?.relation || ""}
                  rules={[
                    {
                      required: true,
                      message: "Please enter Guardian Relation",
                    },
                  ]}>
                  <TextField
                    label={
                      <div className='flex items-center'>
                        <IoPersonCircle
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                        <div>Guardian Relation *</div>
                      </div>
                    }
                    variant='outlined'
                    fullWidth
                    size='small'
                    type='text'
                    placeholder='Enter Guardian Relation'
                    InputProps={{
                      style: { height: 40 },
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name='address'
                  rules={[
                    {
                      required: false,
                      message: "Address is required",
                    },
                  ]}>
                  <LocationSearchMui
                    value={address}
                    onChange={(value) => {
                      setAddress(value);
                    }}
                    initialValue={address}
                    setLatitude={setLatitude}
                    setLongitude={setLongitude}
                    setArea={setArea}
                    setAddress={setAddress}
                    setAddressObject={setAddressObject}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='city'
                  initialValue={editData?.city || ""}
                  rules={[
                    {
                      required: false,
                      message: "Please enter the city",
                    },
                    {
                      pattern: /^[a-zA-Z0-9 ]*$/,
                      message: "Only alphabets and numbers are allowed",
                    },
                  ]}>
                  <TextField
                    label={
                      <div className='flex items-center'>
                        <FaLocationDot
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                        <div>City</div>
                      </div>
                    }
                    variant='outlined'
                    fullWidth
                    size='small'
                    type='text'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    // placeholder='Enter the city'
                    InputLabelProps={{ shrink: city }}
                    InputProps={{
                      style: { height: 40 },
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='state'
                  initialValue={editData?.state || ""}
                  rules={[
                    {
                      required: false,
                      message: "Please enter the state",
                    },
                    {
                      pattern: /^[a-zA-Z0-9 ]*$/,
                      message: "Only alphabets and numbers are allowed",
                    },
                  ]}>
                  <TextField
                    label={
                      <div className='flex items-center'>
                        <FaLocationDot
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                        <div>State</div>
                      </div>
                    }
                    variant='outlined'
                    fullWidth
                    size='small'
                    type='text'
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    InputLabelProps={{ shrink: state }}
                    // placeholder='Enter the State'
                    InputProps={{
                      style: { height: 40 },
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='country'
                  initialValue={editData?.country || ""}
                  rules={[
                    {
                      required: false,
                      message: "Please enter the country",
                    },
                  ]}>
                  <TextField
                    label={
                      <div className='flex items-center'>
                        <FaLocationDot
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                        <div>Country</div>
                      </div>
                    }
                    variant='outlined'
                    fullWidth
                    size='small'
                    type='text'
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    // placeholder='Enter the country'
                    InputLabelProps={{ shrink: country }}
                    InputProps={{
                      style: { height: 40 },
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='pincode'
                  initialValue={editData?.pincode || ""}
                  rules={[
                    {
                      required: false,
                      message: "Please enter the pincode",
                    },
                    {
                      pattern: /^[0-9]*$/,
                      message: "Only numbers are allowed",
                    },
                  ]}>
                  <TextField
                    label={
                      <div className='flex items-center'>
                        <IoPersonCircle
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                        <div>Pincode</div>
                      </div>
                    }
                    variant='outlined'
                    fullWidth
                    size='small'
                    type='number'
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    // placeholder='Enter the Pincode'
                    InputLabelProps={{ shrink: pincode }}
                    InputProps={{
                      classes: { input: "no-arrows" },
                      min: 0,
                      onWheel: (e) => e.target.blur(),
                      style: { height: 40 },
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <footer className='flex justify-end items-center py-2 space-x-4'>
            <Button
              type='default'
              onClick={() => {
                form.resetFields();
                setBranchPatientModal(false);
              }}
              className='min-w-[100px]'>
              Back
            </Button>
            <Button type='primary' htmlType='submit' className='min-w-[100px]'>
              Add
            </Button>
          </footer>
        </Spin>
      </Form>
    </Spin>
  );
};

export default AddBranchPatient;
