import {
  CalendarOutlined,
  CloseOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import {
  MenuItem, Autocomplete,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Button, Col, Drawer, Form, message, Row, Space, Spin } from "antd";
import { IoPersonCircle } from "react-icons/io5";
import { CgWebsite } from "react-icons/cg";
import LocationSearchMui from "../../utils/location";
import { useEffect, useState } from "react";
import { BiSolidTrash } from "react-icons/bi";
import { handleUpload } from "../../utils/FileUpload";
import { useDropzone } from "react-dropzone";
import { IoMdCloudUpload } from "react-icons/io";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { RiLockPasswordLine } from "react-icons/ri";
import { fetchData, postData, putData } from "../../api/apiService";
import { autocompleteStyles, CustomPaper } from "../../utils/autoCompleteCss";
import { TbMapPinCode } from "react-icons/tb";
import { FaLocationDot, FaTransgender, FaWheelchair } from "react-icons/fa6";
import { HiOutlineIdentification } from "react-icons/hi2";

const AddPatient = ({
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

  console.log(editId);

  const onFinish = async (values) => {
    console.log(values);
    const isEditMode = Boolean(editId);
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
      password: values.password
    };
    console.log(payload);
    // if (isEditMode) {
    //   payload.patientId = editId;
    // }

    console.log(payload);
    try {
      setLoading(true);
      const response = await postData("/api/admin/create-patient", payload);
      if (response?.responseCode === 200) {
        message.success(response?.message);
        setPatientDrawer(false);
        fetchPatientsList();
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to submit hospital data");
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
        setAddress(response?.data?.address || "");
        setCity(response?.data?.city || "");
        setCountry(response?.data?.country || "");
        setState(response?.data?.state || "");
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
      setAddress("");
      setCity("");
      setCountry("");
      setState("");
      setPincode("");
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
    <Drawer
      visible={patientDrawer}
      closable={true}
      title={
        <h3 className='text-xl text-center text-black'>
          {editId ? "Update" : "Add"} Patient
        </h3>
      }
      footer={null}
      maskClosable={true}
      placement='right'
      size='large'
      extra={
        <CloseOutlined
          onClick={() => {
            setEditId(null);
            setPatientDrawer(false);
          }}
          style={{ fontSize: "16px", cursor: "pointer" }}
        />
      }
      className='custom-drawer preview-drawer'
      onClose={() => {
        setEditId(null);
        setPatientDrawer(false);
      }}>
      <Form
        layout='vertical'
        form={form}
        onFinish={onFinish}
        className='client-details-form custom-form-ant'>
        <Spin spinning={loading}>
          <div className='min-h-[82dvh] max-h-[82dvh] overflow-y-auto overflow-x-hidden pr-1 pt-2 custom-scrollbard'>
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
                    disabled={editId}
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
            {/* <Form.Item
              name='password'
              rules={[
                { required: true, message: "Please enter the Password" },
              ]}>
              <TextField
                label={
                  <div className='flex items-center'>
                    <RiLockPasswordLine
                      style={{ marginRight: 8, fontSize: 20 }}
                    />
                    <div>Password *</div>
                  </div>
                }
                fullWidth
                variant='outlined'
                placeholder='Enter the Password'
                size='small'
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge='end'>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Form.Item> */}
          </div>
          <footer className='flex justify-end items-center py-2 space-x-4'>
            <Button
              type='default'
              onClick={() => {
                form.resetFields();
                setPatientDrawer(false);
              }}
              className='min-w-[100px]'>
              Back
            </Button>
            <Button type='primary' htmlType='submit' className='min-w-[100px]'>
              {editId ? "Update" : "Add"}
            </Button>
          </footer>
        </Spin>
      </Form>
    </Drawer>
  );
};

export default AddPatient;

// import {
//   CalendarOutlined,
//   MailOutlined,
//   PhoneOutlined,
// } from "@ant-design/icons";
// import { IconButton, InputAdornment, MenuItem, TextField } from "@mui/material";
// import { Button, Col, Form, message, Row, Spin } from "antd";
// import { MdOutlineLocalHospital } from "react-icons/md";
// import { IoPersonCircle } from "react-icons/io5";
// import { FaLocationDot, FaTransgender, FaWheelchair } from "react-icons/fa6";
// import { CgWebsite } from "react-icons/cg";
// import LocationSearchMui from "../../utils/location";
// import { useEffect, useState } from "react";
// import { BiSolidTrash } from "react-icons/bi";
// import { handleUpload } from "../../utils/FileUpload";
// import { useDropzone } from "react-dropzone";
// import { IoMdCloudUpload } from "react-icons/io";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { RiLockPasswordLine } from "react-icons/ri";
// import { postData, putData } from "../../api/apiService";
// import { HiOutlineIdentification } from "react-icons/hi2";

// const AddPatient = ({ setHospitalModal, fetchPatientsList, editId = null }) => {
//   const [form] = Form.useForm();
//   const [address, setAddress] = useState("");
//   const [latitude, setLatitude] = useState(null);
//   const [longitude, setLongitude] = useState(null);
//   const [area, setArea] = useState("");
//   const [imageUrl, setImageUrl] = useState(null);
//   const [file, setFile] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [addressObject, setAddressObject] = useState({});
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [country, setCountry] = useState("");
//   const [pincode, setPincode] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [editData, setEditData] = useState({});

//   console.log(latitude, longitude, address, addressObject);

//   const onFinish = async (values) => {
//     console.log(values);

//     const modifiedEmail = values?.email?.trim()?.toLowerCase() || "";

//     const isEditMode = Boolean(editId);

//     const payload = {
//       hospitalData: {
//         email: modifiedEmail,
//         phone: values?.phoneNumber?.trim() || "",
//         name: values?.hospitalName?.trim() || "",
//         GSTIN: values?.gst?.trim() || "",
//         groupId: values?.groupId?.trim() || "",
//         groupName: values?.groupName?.trim() || "",
//         contactPersonName: values?.contactPersonName?.trim() || "",
//         contactPersonPhone: values?.contactPersonPhoneNumber?.trim() || "",
//         website: values?.website?.trim() || "",
//         address: address || "",
//         city: values?.city?.trim() || "",
//         state: values?.state?.trim() || "",
//         country: values?.country?.trim() || "",
//         pincode: values?.pincode?.trim() || "",
//         avatar: "",
//         location: {
//           type: "Point",
//           coordinates: [77.6092, 12.9438], // default coordinates
//         },
//       },
//     };

//     if (!editId && values?.password) {
//       payload.hospitalUserData = {
//         password: values?.password,
//       };
//     }

//     // Override coordinates if available
//     if (latitude && longitude) {
//       payload.hospitalData.location = {
//         type: "Point",
//         coordinates: [latitude, longitude],
//       };
//     }

//     // Add hospitalId in edit mode
//     if (isEditMode) {
//       payload.hospitalData.hospitalId = editId;
//     }

//     try {
//       setLoading(true);
//       const endpoint = isEditMode
//         ? "/api/admin/update-hospital"
//         : "/api/admin/create-hospital";
//       const sendRequest = isEditMode ? putData : postData;

//       const response = await sendRequest(endpoint, payload);

//       if (response?.responseCode === 200) {
//         message.success(response?.message);
//         setHospitalModal(false);
//         fetchPatientsList();
//       } else {
//         message.error(response?.message || "Something went wrong");
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to submit hospital data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSingleHospital = async () => {
//     const payload = {
//       hospitalId: editId,
//     };
//     try {
//       setLoading(true);
//       const response = await postData(
//         "/api/admin/get-single-hospital",
//         payload
//       );
//       if (response?.responseCode == 200) {
//         setEditData(response?.data);
//         form.setFieldsValue({
//           hospitalName: response?.data?.name || "",
//           phoneNumber: response?.data?.phone || "",
//           email: response?.data?.email || "",
//           gst: response?.data?.GSTIN || "",
//           contactPersonPhoneNumber: response?.data?.contactPersonPhone || "",
//           groupName: response?.data?.groupName || "",
//           contactPersonName: response?.data?.contactPersonName || "",
//           groupId: response?.data?.groupId || "",
//           website: response?.data?.website || "",
//           city: response?.data?.city || "",
//           state: response?.data?.state || "",
//           country: response?.data?.country || "",
//           pincode: response?.data?.pincode || "",
//           address: response?.data?.address || "",
//         });
//         setAddress(response?.data?.address || "");
//         setCity(response?.data?.city || "");
//         setCountry(response?.data?.country || "");
//         setState(response?.data?.state || "");
//         setPincode(response?.data?.pincode || "");
//         if (
//           Array.isArray(response?.data?.location?.coordinates) &&
//           response?.data?.location?.coordinates.length > 0
//         ) {
//           setLatitude(response?.data?.location?.coordinates[0]);
//           setLongitude(response?.data?.location?.coordinates[1]);
//         }
//       } else if (response?.responseCode == 400) {
//         message.error(response?.message || "Something went wrong");
//       } else {
//         message.error(response?.message || "Something went wrong");
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to fetch hospitals List");
//     } finally {
//       setLoading(false);
//     }

//     console.log(payload);
//   };

//   useEffect(() => {
//     if (editId) {
//       fetchSingleHospital();
//     }
//   }, [editId]);

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop: async (acceptedFiles, rejectedFiles) => {
//       // Allow file types for insurance details
//       const validExtensions = [".png", ".jpg", ".jpeg", ,];

//       acceptedFiles.forEach(async (file) => {
//         const fileExtension = file.name
//           .slice(file.name.lastIndexOf("."))
//           .toLowerCase();

//         if (!validExtensions.includes(fileExtension)) {
//           message.error(
//             "Unsupported file type. Please upload files in formats: PNG, JPG, JPEG"
//           );
//           return;
//         }

//         // Check if the file exceeds the size limit (5MB)
//         // if (file.size > 5242880) {
//         //   message.error("File size exceeds the maximum limit of 5MB.");
//         //   return;
//         // }

//         // Set preview for images, and icons for other types
//         setFile(
//           Object.assign(file, {
//             preview: URL.createObjectURL(file),
//           })
//         );

//         // handleUpload(file);
//         try {
//           // Handle file upload and get the returned URL
//           const Url = await handleUpload(file);

//           setImageUrl(Url);
//         } catch (error) {
//           message.error("File upload failed. Please try again.");
//         }
//       });
//     },
//     maxFiles: 1, // Limit to one file at a time
//   });

//   useEffect(() => {
//     console.log(addressObject);
//     if (Object?.keys(addressObject)?.length > 0 && address) {
//       form?.setFieldsValue({
//         city: addressObject?.city || "",
//         state: addressObject?.state || "",
//         country: addressObject?.country || "",
//         pincode: addressObject?.zip || "",
//       });
//       setCity(addressObject?.city || "");
//       setState(addressObject?.state || "");
//       setCountry(addressObject?.country || "");
//       setPincode(addressObject?.zip || "");
//     }
//     //  else {
//     //   // Clear form values
//     //   form?.setFieldsValue({
//     //     city: "",
//     //     state: "",
//     //     country: "",
//     //     pincode: "",
//     //   });
//     //   // Clear local state values
//     //   setCity("");
//     //   setState("");
//     //   setCountry("");
//     //   setPincode("");
//     // }
//   }, [addressObject, address]);

//   console.log(editData);

//   return (
//     <Spin spinning={loading}>
//       <Form
//         layout='vertical'
//         form={form}
//         preserve
//         onFinish={onFinish}
//         className='client-details-form custom-form-ant'>
//         <div className='max-h-[22rem] overflow-y-auto overflow-x-hidden pr-1 pt-2 custom-scrollbard'>
//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item
//                 name='patientName'
//                 initialValue={editData?.name || ""}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please enter Patient Name",
//                   },
//                   {
//                     pattern: /^[a-zA-Z0-9 ]*$/,
//                     message: "Only alphabets and numbers are allowed",
//                   },
//                 ]}>
//                 <TextField
//                   label={
//                     <div className='flex items-center'>
//                       <FaWheelchair style={{ marginRight: 8, fontSize: 20 }} />
//                       <div>Patient Name *</div>
//                     </div>
//                   }
//                   variant='outlined'
//                   fullWidth
//                   size='small'
//                   type='text'
//                   placeholder='Enter Patient Name'
//                   InputProps={{
//                     style: { height: 40 },
//                   }}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 name='phoneNumber'
//                 initialValue={editData?.phone || ""}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please enter patient phone number",
//                   },
//                   {
//                     pattern: /^\d+$/,
//                     message: "Phone number must contain only digits",
//                   },
//                   {
//                     len: 10,
//                     message: "Phone number must be 10 digits",
//                   },
//                 ]}>
//                 <TextField
//                   variant='outlined'
//                   fullWidth
//                   label={
//                     <div className='flex items-center'>
//                       <PhoneOutlined style={{ marginRight: 8, fontSize: 20 }} />
//                       <div>Phone Number *</div>
//                     </div>
//                   }
//                   size='small'
//                   placeholder='Enter Patient Phone Number'
//                   InputProps={{
//                     style: { height: 40 },
//                     classes: { input: "no-arrows" },
//                   }}
//                   disabled={editId}
//                   inputProps={{
//                     maxLength: 10,
//                   }}
//                   onChange={(e) => {
//                     if (!/^\d+$/.test(e.target.value) && e.target.value !== "")
//                       return;
//                   }}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item
//                 name='emergencyContact'
//                 initialValue={editData?.phone || ""}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please enter emergency contact",
//                   },
//                   {
//                     pattern: /^\d+$/,
//                     message: "Phone number must contain only digits",
//                   },
//                   {
//                     len: 10,
//                     message: "Phone number must be 10 digits",
//                   },
//                 ]}>
//                 <TextField
//                   variant='outlined'
//                   fullWidth
//                   label={
//                     <div className='flex items-center'>
//                       <PhoneOutlined style={{ marginRight: 8, fontSize: 20 }} />
//                       <div>Emergency Contact Number *</div>
//                     </div>
//                   }
//                   size='small'
//                   placeholder='Enter Emergency contact Number'
//                   InputProps={{
//                     style: { height: 40 },
//                     classes: { input: "no-arrows" },
//                   }}
//                   inputProps={{
//                     maxLength: 10,
//                   }}
//                   onChange={(e) => {
//                     if (!/^\d+$/.test(e.target.value) && e.target.value !== "")
//                       return;
//                   }}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 name='aadharNumber'
//                 initialValue={editData?.phone || ""}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please enter aadhar number",
//                   },
//                   {
//                     pattern: /^\d+$/,
//                     message: "aadhar number must contain only digits",
//                   },
//                   {
//                     len: 12,
//                     message: "Aadhar number must be 12 digits",
//                   },
//                 ]}>
//                 <TextField
//                   variant='outlined'
//                   fullWidth
//                   label={
//                     <div className='flex items-center'>
//                       <HiOutlineIdentification
//                         style={{ marginRight: 8, fontSize: 20 }}
//                       />
//                       <div>Aadhar Number *</div>
//                     </div>
//                   }
//                   size='small'
//                   placeholder='Enter aadhar number'
//                   InputProps={{
//                     style: { height: 40 },
//                     classes: { input: "no-arrows" },
//                   }}
//                   inputProps={{
//                     maxLength: 12,
//                   }}
//                   onChange={(e) => {
//                     if (!/^\d+$/.test(e.target.value) && e.target.value !== "")
//                       return;
//                   }}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item
//                 name='gender'
//                 initialValue={editData?.gender || ""}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please select gender",
//                   },
//                 ]}>
//                 <TextField
//                   select
//                   fullWidth
//                   size='small'
//                   label={
//                     <div className='flex items-center'>
//                       <FaTransgender style={{ marginRight: 8, fontSize: 20 }} />
//                       <div>Gender *</div>
//                     </div>
//                   }
//                   placeholder='Select Gender'>
//                   <MenuItem value='male'>Male</MenuItem>
//                   <MenuItem value='female'>Female</MenuItem>
//                   <MenuItem value='others'>Others</MenuItem>
//                 </TextField>
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 name='dateOfBirth'
//                 rules={[
//                   {
//                     required: false,
//                     message: "Please select date of birth",
//                   },
//                 ]}
//                 initialValue={editData?.dateOfBirth}>
//                 <TextField
//                   type='date'
//                   onClick={(e) => e.target.showPicker()}
//                   fullWidth
//                   label={
//                     <div className='flex items-center'>
//                       <CalendarOutlined
//                         style={{ marginRight: 8, fontSize: 20 }}
//                       />{" "}
//                       <div>Date of Birth</div>
//                     </div>
//                   }
//                   size='small'
//                   variant='outlined'
//                   InputLabelProps={{ shrink: true }}
//                   onKeyDown={(e) => e.preventDefault()}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={16}>
//             <Col span={24}>
//               <Form.Item
//                 name='address'
//                 rules={[
//                   {
//                     required: false,
//                     message: "Address is required",
//                   },
//                 ]}>
//                 <LocationSearchMui
//                   value={address}
//                   onChange={(value) => {
//                     setAddress(value);
//                   }}
//                   initialValue={address}
//                   setLatitude={setLatitude}
//                   setLongitude={setLongitude}
//                   setArea={setArea}
//                   setAddress={setAddress}
//                   setAddressObject={setAddressObject}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item
//                 name='city'
//                 initialValue={editData?.city || ""}
//                 rules={[
//                   {
//                     required: false,
//                     message: "Please enter the city",
//                   },
//                   {
//                     pattern: /^[a-zA-Z0-9 ]*$/,
//                     message: "Only alphabets and numbers are allowed",
//                   },
//                 ]}>
//                 <TextField
//                   label={
//                     <div className='flex items-center'>
//                       <FaLocationDot style={{ marginRight: 8, fontSize: 20 }} />
//                       <div>City *</div>
//                     </div>
//                   }
//                   variant='outlined'
//                   fullWidth
//                   size='small'
//                   type='text'
//                   value={city}
//                   onChange={(e) => setCity(e.target.value)}
//                   // placeholder='Enter the city'
//                   InputLabelProps={{ shrink: city }}
//                   InputProps={{
//                     style: { height: 40 },
//                   }}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 name='state'
//                 initialValue={editData?.state || ""}
//                 rules={[
//                   {
//                     required: false,
//                     message: "Please enter the state",
//                   },
//                   {
//                     pattern: /^[a-zA-Z0-9 ]*$/,
//                     message: "Only alphabets and numbers are allowed",
//                   },
//                 ]}>
//                 <TextField
//                   label={
//                     <div className='flex items-center'>
//                       <FaLocationDot style={{ marginRight: 8, fontSize: 20 }} />
//                       <div>State *</div>
//                     </div>
//                   }
//                   variant='outlined'
//                   fullWidth
//                   size='small'
//                   type='text'
//                   value={state}
//                   onChange={(e) => setState(e.target.value)}
//                   InputLabelProps={{ shrink: state }}
//                   // placeholder='Enter the State'
//                   InputProps={{
//                     style: { height: 40 },
//                   }}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item
//                 name='country'
//                 initialValue={editData?.country || ""}
//                 rules={[
//                   {
//                     required: false,
//                     message: "Please enter the country",
//                   },
//                 ]}>
//                 <TextField
//                   label={
//                     <div className='flex items-center'>
//                       <FaLocationDot style={{ marginRight: 8, fontSize: 20 }} />
//                       <div>Country *</div>
//                     </div>
//                   }
//                   variant='outlined'
//                   fullWidth
//                   size='small'
//                   type='text'
//                   value={country}
//                   onChange={(e) => setCountry(e.target.value)}
//                   // placeholder='Enter the country'
//                   InputLabelProps={{ shrink: country }}
//                   InputProps={{
//                     style: { height: 40 },
//                   }}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 name='pincode'
//                 initialValue={editData?.pincode || ""}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please enter the pincode",
//                   },
//                   {
//                     pattern: /^[0-9]*$/,
//                     message: "Only numbers are allowed",
//                   },
//                 ]}>
//                 <TextField
//                   label={
//                     <div className='flex items-center'>
//                       <IoPersonCircle
//                         style={{ marginRight: 8, fontSize: 20 }}
//                       />
//                       <div>Pincode *</div>
//                     </div>
//                   }
//                   variant='outlined'
//                   fullWidth
//                   size='small'
//                   type='number'
//                   value={pincode}
//                   onChange={(e) => setPincode(e.target.value)}
//                   // placeholder='Enter the Pincode'
//                   InputLabelProps={{ shrink: pincode }}
//                   InputProps={{
//                     classes: { input: "no-arrows" },
//                     min: 0,
//                     onWheel: (e) => e.target.blur(),
//                     style: { height: 40 },
//                   }}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>
//         </div>
//         <footer className='flex justify-end items-center gap-2 w-full'>
//           <Button
//             type='default'
//             onClick={() => {
//               form.resetFields();
//               setHospitalModal(false);
//             }}
//             className='min-w-[100px]'>
//             Back
//           </Button>
//           <Button type='primary' htmlType='submit' className='min-w-[100px]'>
//             Save & Next
//           </Button>
//         </footer>
//       </Form>
//     </Spin>
//   );
// };

// export default AddPatient;
