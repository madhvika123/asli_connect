import { CloseOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import {
  Autocomplete,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Button, Col, Drawer, Form, message, Row, Space, Spin } from "antd";
import {
  MdOutlineBedroomParent,
  MdOutlineLocalHospital,
  MdOutlineMeetingRoom,
} from "react-icons/md";
import { IoPersonCircle } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { CgWebsite } from "react-icons/cg";
import LocationSearchMui from "../../../utils/location";
import { useEffect, useState } from "react";
import { BiSolidTrash } from "react-icons/bi";
import { handleUpload } from "../../../utils/FileUpload";
import { useDropzone } from "react-dropzone";
import { IoMdCloudUpload } from "react-icons/io";
import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { RiLockPasswordLine } from "ri-icons/ri";
import { fetchData, postData, putData } from "../../../api/apiService";
import { autocompleteStyles, CustomPaper } from "../../../utils/autoCompleteCss";
import { TbMapPinCode } from "react-icons/tb";
import { MdOutlineNumbers } from "react-icons/md";

const AddBranch = ({
  branchDrawer,
  setBranchDrawer,
  fetchBranchesList,
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
    const modifiedEmail = values?.branchUserEmail?.trim()?.toLowerCase() || "";
    const isEditMode = Boolean(editId);
    
    const payload = {
      branchDetails: {
        branchName: values?.branchName?.trim() || "",
        registrationNumber: values?.registrationNumber?.trim() || "",
        avatar: imageUrl || "",
        branchGSTIN: values?.branchGST?.trim() || "",
        address: address || "",
        city: values?.city?.trim() || "",
        state: values?.state?.trim() || "",
        country: values?.country?.trim() || "",
        pincode: values?.pincode?.trim() || "",
        noOfBeds: values?.noOfBeds ? parseInt(values?.noOfBeds?.trim()) : null,
        noOfRooms: values?.noOfRooms ? parseInt(values?.noOfRooms?.trim()) : null,
        doctors: []
      },
    };

    // Add hospitalId only for create mode
    if (!isEditMode && selectedHospitalId) {
      payload.branchDetails.hospitalId = selectedHospitalId;
    }

    // Add branchUserDetails only for create mode
    if (!isEditMode && values?.password) {
      payload.branchUserDetails = {
        password: values?.password,
        email: modifiedEmail,
        name: values?.branchUserName?.trim() || "",
        phone: values?.branchUserPhone?.trim() || "",
      };
    }

    // Add location coordinates if available
    if (latitude && longitude) {
      payload.branchDetails.location = {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)], // longitude first, then latitude
      };
    }

    // Add branchId for edit mode
    if (isEditMode) {
      payload.branchDetails.branchId = editId;
    }

    console.log(payload);
    
    try {
      setLoading(true);
      const endpoint = isEditMode
        ? "/api/hospital/update-branch-by-hospital"
        : "/api/hospital/create-branch-by-hospital";
      const sendRequest = isEditMode ? putData : postData;

      const response = await sendRequest(endpoint, payload);

      if (response?.responseCode === 200) {
        message.success(response?.message || `Branch ${isEditMode ? 'updated' : 'created'} successfully!`);
        setBranchDrawer(false);
        fetchBranchesList();
        resetForm();
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to submit branch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleBranch = async () => {
    const payload = {
      branchId: editId,
    };
    try {
      setLoading(true);
      const response = await postData("/api/admin/get-single-branch", payload);
      if (response?.responseCode == 200) {
        setEditData(response?.data);
        form.setFieldsValue({
          branchName: response?.data?.branchName || "",
          phoneNumber: response?.data?.phone || "",
          branchGST: response?.data?.branchGSTIN || "",
          registrationNumber: response?.data?.registrationNumber || "",
          city: response?.data?.city || "",
          noOfBeds: response?.data?.noOfBeds?.toString() || "",
          noOfRooms: response?.data?.noOfRooms?.toString() || "",
          branchCode: response?.data?.branchCode || "",
          state: response?.data?.state || "",
          country: response?.data?.country || "",
          pincode: response?.data?.pincode || "",
          address: response?.data?.address || "",
        });
        
        setSelectedHospitalId(response?.data?.hospitalId?._id);
        setAddress(response?.data?.address || "");
        setCity(response?.data?.city || "");
        setCountry(response?.data?.country || "");
        setState(response?.data?.state || "");
        setPincode(response?.data?.pincode || "");
        setImageUrl(response?.data?.avatar || "");
        
        if (
          Array.isArray(response?.data?.location?.coordinates) &&
          response?.data?.location?.coordinates.length > 0
        ) {
          setLongitude(response?.data?.location?.coordinates[0]); // longitude first
          setLatitude(response?.data?.location?.coordinates[1]);  // latitude second
        }
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to fetch branch details");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    form.resetFields();
    setEditData({});
    setAddress("");
    setCity("");
    setCountry("");
    setState("");
    setPincode("");
    setLatitude(null);
    setLongitude(null);
    setSelectedHospitalId("");
    setImageUrl(null);
    setFile(null);
    setShowPassword(false);
    setAddressObject({});
  };

  useEffect(() => {
    console.log(editId);
    if (editId !== null) {
      fetchSingleBranch();
    } else {
      console.log("Rendering this");
      resetForm();
    }
  }, [editId, branchDrawer]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles, rejectedFiles) => {
      const validExtensions = [".png", ".jpg", ".jpeg"];

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
        
        setFile(
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );

        try {
          const Url = await handleUpload(file);
          setImageUrl(Url);
          message.success("Image uploaded successfully!");
        } catch (error) {
          message.error("File upload failed. Please try again.");
        }
      });
    },
    maxFiles: 1,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    }
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
  }, [addressObject, address]);

  const handleCloseDrawer = () => {
    setEditId(null);
    setBranchDrawer(false);
    resetForm();
  };

  return (
    <Drawer
      visible={branchDrawer}
      closable={true}
      title={
        <div className='flex items-center justify-center'>
          <MdOutlineLocalHospital className='mr-2 text-blue-600' size={24} />
          <h3 className='text-xl text-center text-gray-800 font-semibold m-0'>
            {editId ? "Update" : "Add"} Branch
          </h3>
        </div>
      }
      footer={null}
      maskClosable={true}
      placement='right'
      size='large'
      extra={
        <CloseOutlined
          onClick={handleCloseDrawer}
          style={{ fontSize: "16px", cursor: "pointer" }}
          className="text-gray-600 hover:text-gray-800"
        />
      }
      className='custom-drawer preview-drawer'
      onClose={handleCloseDrawer}>
      <Form
        layout='vertical'
        form={form}
        onFinish={onFinish}
        className='client-details-form custom-form-ant'>
        <Spin spinning={loading}>
          <div className='min-h-[82dvh] max-h-[82dvh] overflow-y-auto overflow-x-hidden pr-1 pt-2 custom-scrollbard'>
                {/* Basic Branch Information */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Basic Information
              </h4>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name='branchName'
                    rules={[
                      {
                        required: true,
                        message: "Please enter Branch Name",
                      },
                      {
                        pattern: /^[a-zA-Z0-9 ]*$/,
                        message: "Only alphabets and numbers are allowed",
                      },
                    ]}>
                    <TextField
                      label={
                        <div className='flex items-center'>
                          <MdOutlineLocalHospital
                            style={{ marginRight: 8, fontSize: 20 }}
                            className="text-blue-600"
                          />
                          <div>Branch Name *</div>
                        </div>
                      }
                      variant='outlined'
                      fullWidth
                      size='small'
                      type='text'
                      placeholder='Enter Branch Name'
                      InputProps={{
                        style: { height: 45 },
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name='registrationNumber'
                    rules={[
                      {
                        required: true,
                        message: "Please enter registration number",
                      },
                    ]}>
                    <TextField
                      variant='outlined'
                      fullWidth
                      label={
                        <span className="flex items-center">
                          <MdOutlineNumbers style={{ marginRight: 8 }} className="text-green-600" />
                          Registration Number *
                        </span>
                      }
                      size='small'
                      placeholder='Enter Registration Number'
                      InputProps={{
                        style: { height: 45 },
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name='branchGST'
                    rules={[
                      {
                        required: false,
                        message: "Please enter Branch GSTIN",
                      },
                      {
                        pattern: /^[a-zA-Z0-9]*$/,
                        message: "Only alphabets and numbers are allowed",
                      },
                      {
                        validator: (_, value) => {
                          if (!value || value.length <= 15) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error("Maximum 15 characters allowed"));
                        },
                      },
                    ]}>
                    <TextField
                      label={
                        <div className='flex items-center'>
                          <CgWebsite
                            style={{ marginRight: 8, fontSize: 20 }}
                            className="text-purple-600"
                          />
                          <div>Branch GSTIN</div>
                        </div>
                      }
                      variant='outlined'
                      fullWidth
                      placeholder='Enter Branch GSTIN'
                      maxLength={15}
                      size='small'
                      InputProps={{
                        style: { height: 45 },
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {/* Empty space for better layout */}
                </Col>
              </Row>
            </div>

            {/* Capacity Information */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Capacity Information
              </h4>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name='noOfRooms'
                    rules={[
                      {
                        required: true,
                        message: "Please enter no.of rooms",
                      },
                      {
                        validator: (_, value) => {
                          if (!value || (parseInt(value) > 0)) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error("Number of rooms must be greater than 0"));
                        },
                      },
                    ]}>
                    <TextField
                      variant='outlined'
                      fullWidth
                      label={
                        <div className='flex items-center'>
                          <MdOutlineMeetingRoom
                            style={{ marginRight: 8, fontSize: 20 }}
                            className="text-orange-600"
                          />
                          <div> No. of Rooms *</div>
                        </div>
                      }
                      size='small'
                      type='number'
                      placeholder='Enter Number of Rooms'
                      InputProps={{
                        style: { height: 45 },
                        classes: { input: "no-arrows" },
                        inputProps: { min: 1 }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name='noOfBeds'
                    rules={[
                      {
                        required: true,
                        message: "Please enter no.of beds",
                      },
                      {
                        validator: (_, value) => {
                          if (!value || (parseInt(value) > 0)) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error("Number of beds must be greater than 0"));
                        },
                      },
                    ]}>
                    <TextField
                      variant='outlined'
                      fullWidth
                      label={
                        <div className='flex items-center'>
                          <MdOutlineBedroomParent
                            style={{ marginRight: 8, fontSize: 20 }}
                            className="text-red-600"
                          />
                          <div> No. of Beds *</div>
                        </div>
                      }
                      size='small'
                      type='number'
                      placeholder='Enter Number of Beds'
                      InputProps={{
                        style: { height: 45 },
                        classes: { input: "no-arrows" },
                        inputProps: { min: 1 }
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Location Information */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Location Information
              </h4>
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

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name='city'
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
                            style={{ marginRight: 8, fontSize: 18 }}
                            className="text-blue-600"
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
                      InputLabelProps={{ shrink: !!city }}
                      InputProps={{
                        style: { height: 45 },
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name='state'
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
                            style={{ marginRight: 8, fontSize: 18 }}
                            className="text-green-600"
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
                      InputLabelProps={{ shrink: !!state }}
                      InputProps={{
                        style: { height: 45 },
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name='country'
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
                            style={{ marginRight: 8, fontSize: 18 }}
                            className="text-purple-600"
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
                      InputLabelProps={{ shrink: !!country }}
                      InputProps={{
                        style: { height: 45 },
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name='pincode'
                    rules={[
                      {
                        required: false,
                        message: "Please enter the pincode",
                      },
                      {
                        pattern: /^[0-9]*$/,
                        message: "Only numbers are allowed",
                      },
                      {
                        len: 6,
                        message: "Pincode must be 6 digits",
                      },
                    ]}>
                    <TextField
                      label={
                        <div className='flex items-center'>
                          <TbMapPinCode
                            style={{ marginRight: 8, fontSize: 20 }}
                            className="text-red-600"
                          />
                          <div>Pincode</div>
                        </div>
                      }
                      variant='outlined'
                      fullWidth
                      size='small'
                      type='text'
                      value={pincode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                        if (value.length <= 6) {
                          setPincode(value);
                        }
                      }}
                      InputLabelProps={{ shrink: !!pincode }}
                      InputProps={{
                        style: { height: 45 },
                        inputProps: { maxLength: 6 }
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Branch Admin Details - Only for Create Mode */}
            {editId === null && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Branch Admin Details
                </h4>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name='branchUserName'
                      rules={[
                        {
                          required: true,
                          message: "Please enter Branch Admin Name",
                        },
                        {
                          pattern: /^[a-zA-Z ]*$/,
                          message: "Only alphabets and spaces are allowed",
                        },
                      ]}>
                      <TextField
                        label={
                          <div className='flex items-center'>
                            <IoPersonCircle
                              style={{ marginRight: 8, fontSize: 20 }}
                              className="text-blue-600"
                            />
                            <div>Branch Admin Name *</div>
                          </div>
                        }
                        variant='outlined'
                        fullWidth
                        size='small'
                        type='text'
                        placeholder='Enter Branch Admin Name'
                        InputProps={{
                          style: { height: 45 },
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='branchUserPhone'
                      rules={[
                        {
                          required: true,
                          message: "Please enter branch admin phone number",
                        },
                        {
                          pattern: /^\d{10}$/,
                          message: "Phone number must be exactly 10 digits",
                        },
                      ]}>
                      <TextField
                        variant='outlined'
                        fullWidth
                        label={
                          <span className="flex items-center">
                            <PhoneOutlined style={{ marginRight: 8 }} className="text-green-600" />
                            Branch Admin Phone *
                          </span>
                        }
                        size='small'
                        placeholder='Enter 10-digit Phone Number'
                        InputProps={{
                          style: { height: 45 },
                        }}
                        inputProps={{
                          maxLength: 10,
                        }}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                          if (value.length <= 10) {
                            form.setFieldsValue({ branchUserPhone: value });
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name='branchUserEmail'
                      rules={[
                        {
                          required: true,
                          message: "Please enter Branch Admin Email",
                        },
                        {
                          type: 'email',
                          message: "Please enter a valid email address",
                        },
                      ]}>
                      <TextField
                        label={
                          <span className="flex items-center">
                            <MailOutlined style={{ marginRight: 8 }} className="text-red-600" />
                            Branch Admin Email *
                          </span>
                        }
                        variant='outlined'
                        fullWidth
                        type='email'
                        size='small'
                        placeholder='Enter Branch Admin Email'
                        InputProps={{
                          style: { height: 45 },
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='password'
                      rules={[
                        {
                          required: true,
                          message: "Please enter branch Password",
                        },
                        {
                          min: 8,
                          message: "Password must be at least 8 characters long",
                        },
                      ]}>
                      <TextField
                        label={
                          <div className='flex items-center'>
                            <Visibility
                              style={{ marginRight: 8, fontSize: 20 }}
                              className="text-purple-600"
                            />
                            <div>Branch Admin Password *</div>
                          </div>
                        }
                        fullWidth
                        variant='outlined'
                        placeholder='Enter Strong Password (min 8 chars)'
                        size='small'
                        type={showPassword ? "text" : "password"}
                        InputProps={{
                          style: { height: 45 },
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge='end'
                                size="small">
                                {showPassword ? (
                                  <VisibilityOff fontSize="small" />
                                ) : (
                                  <Visibility fontSize="small" />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <footer className='flex justify-end items-center py-4 px-2 bg-gray-50 border-t border-gray-200 space-x-3'>
            <Button
              type='default'
              onClick={handleCloseDrawer}
              className='min-w-[120px] h-10 font-medium'
              size="large">
              Cancel
            </Button>
            <Button 
              type='primary' 
              htmlType='submit' 
              className='min-w-[120px] h-10 font-medium bg-blue-600 hover:bg-blue-700'
              size="large"
              loading={loading}>
              {editId ? "Update Branch" : "Create Branch"}
            </Button>
          </footer>
        </Spin>
      </Form>
    </Drawer>
  );
};

export default AddBranch;