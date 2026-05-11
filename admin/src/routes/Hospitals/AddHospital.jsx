import { CloseOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Button, Col, Drawer, Form, message, Row, Space, Spin } from "antd";
import { MdOutlineLocalHospital } from "react-icons/md";
import { IoPersonCircle } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { CgWebsite } from "react-icons/cg";
import LocationSearchMui from "../../utils/location";
import { useEffect, useState } from "react";
import { BiSolidTrash } from "react-icons/bi";
import { handleUpload } from "../../utils/FileUpload";
import { useDropzone } from "react-dropzone";
import { IoMdCloudUpload } from "react-icons/io";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { RiLockPasswordLine } from "react-icons/ri";
import { postData, putData } from "../../api/apiService";

const AddHospital = ({
  hospitalDrawer,
  setHospitalDrawer,
  fetchHospitalsList,
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

  console.log(latitude, longitude, address, addressObject);

  const onFinish = async (values) => {
    console.log(values);

    const modifiedEmail = values?.email?.trim()?.toLowerCase() || "";

    const isEditMode = Boolean(editId);

    const payload = {
      hospitalData: {
        email: modifiedEmail,
        phone: values?.phoneNumber?.trim() || "",
        name: values?.hospitalName?.trim() || "",
        GSTIN: values?.gst?.trim() || "",
        groupId: values?.groupId?.trim() || "",
        groupName: values?.groupName?.trim() || "",
        contactPersonName: values?.contactPersonName?.trim() || "",
        contactPersonPhone: values?.contactPersonPhoneNumber?.trim() || "",
        website: values?.website?.trim() || "",
        address: address || "",
        city: values?.city?.trim() || "",
        state: values?.state?.trim() || "",
        country: values?.country?.trim() || "",
        pincode: values?.pincode?.trim() || "",
        avatar: "",
        location: {},
      },
    };

    if (!editId && values?.password) {
      payload.hospitalUserData = {
        password: values?.password,
      };
    }

    // Override coordinates if available
    if (latitude && longitude) {
      payload.hospitalData.location = {
        type: "Point",
        coordinates: [latitude, longitude],
      };
    }

    // Add hospitalId in edit mode
    if (isEditMode) {
      payload.hospitalData.hospitalId = editId;
    }

    try {
      setLoading(true);
      const endpoint = isEditMode
        ? "/api/admin/update-hospital"
        : "/api/admin/create-hospital";
      const sendRequest = isEditMode ? putData : postData;

      const response = await sendRequest(endpoint, payload);

      if (response?.responseCode === 200) {
        message.success(response?.message);
        setHospitalDrawer(false);
        fetchHospitalsList();
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to submit hospital data");
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleHospital = async () => {
    const payload = {
      hospitalId: editId,
    };
    try {
      setLoading(true);
      const response = await postData(
        "/api/admin/get-single-hospital",
        payload
      );
      if (response?.responseCode == 200) {
        setEditData(response?.data);
        form.setFieldsValue({
          hospitalName: response?.data?.name || "",
          phoneNumber: response?.data?.phone || "",
          email: response?.data?.email || "",
          gst: response?.data?.GSTIN || "",
          contactPersonPhoneNumber: response?.data?.contactPersonPhone || "",
          groupName: response?.data?.groupName || "",
          contactPersonName: response?.data?.contactPersonName || "",
          groupId: response?.data?.groupId || "",
          website: response?.data?.website || "",
          city: response?.data?.city || "",
          state: response?.data?.state || "",
          country: response?.data?.country || "",
          pincode: response?.data?.pincode || "",
          address: response?.data?.address || "",
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
      message.error(error?.message || "Failed to fetch hospitals List");
    } finally {
      setLoading(false);
    }

    console.log(payload);
  };

  useEffect(() => {
    console.log(editId);
    if (editId !== null) {
      fetchSingleHospital();
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
    }
  }, [editId, hospitalDrawer]);

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

  console.log(editData);

  return (
    <Drawer
      visible={hospitalDrawer}
      closable={true}
      title={
        <h3 className='text-xl text-center text-black'>
          {editId ? "Update" : "Add"} Hospital
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
            setHospitalDrawer(false);
          }}
          style={{ fontSize: "16px", cursor: "pointer" }}
        />
      }
      className='custom-drawer preview-drawer'
      onClose={() => {
        setEditId(null);
        setHospitalDrawer(false);
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
                  name='hospitalName'
                  initialValue={editData?.name || ""}
                  rules={[
                    {
                      required: true,
                      message: "Please enter Hospital Name",
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
                        />
                        <div>Hospital Name *</div>
                      </div>
                    }
                    variant='outlined'
                    fullWidth
                    size='small'
                    type='text'
                    placeholder='Enter Customer Name'
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
                      message: "Please enter your phone number",
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
                      <span>
                        <PhoneOutlined style={{ marginRight: 8 }} /> Phone
                        Number *
                      </span>
                    }
                    size='small'
                    placeholder='Enter Phone Number'
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
                  name='email'
                  initialValue={editData?.email || ""}
                  rules={[
                    {
                      required: true,
                      message: "Please enter email",
                    },
                  ]}>
                  <TextField
                    label={
                      <span>
                        <MailOutlined style={{ marginRight: 8 }} /> Email ID *
                      </span>
                    }
                    variant='outlined' // You can use "outlined", "filled", or "standard" variants
                    fullWidth
                    type='email'
                    size='small'
                    placeholder='Enter Email ID'
                    InputProps={{
                      style: { height: 40 }, // Adjusting height if necessary
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='gst'
                  initialValue={editData?.GSTIN || ""}
                  rules={[
                    {
                      required: false,
                      message: "Please enter Gst",
                    },
                    {
                      pattern: /^[a-zA-Z0-9]*$/,
                      message: "Only alphabets and numbers are allowed",
                    },
                  ]}>
                  <TextField
                    label={
                      <div className='flex items-center'>
                        <IoPersonCircle
                          style={{ marginRight: 8, fontSize: 20 }}
                        />{" "}
                        <div>GSTIN</div>
                      </div>
                    }
                    variant='outlined'
                    fullWidth
                    placeholder='Enter your GSTIN'
                    size='small'
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
                  name='contactPersonName'
                  initialValue={editData?.contactPersonName || ""}
                  rules={[
                    {
                      required: false,
                      message: "Please enter Contact person Name",
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
                        <div>Admin Name</div>
                      </div>
                    }
                    variant='outlined'
                    fullWidth
                    size='small'
                    type='text'
                    placeholder='Enter Contact person Name'
                    InputProps={{
                      style: { height: 40 },
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='contactPersonPhoneNumber'
                  initialValue={editData?.contactPersonPhone || ""}
                  rules={[
                    {
                      required: false,
                      message: "Please enter contact person phone number",
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
                      <span>
                        <PhoneOutlined style={{ marginRight: 8 }} /> Admin Phone
                        Number
                      </span>
                    }
                    size='small'
                    placeholder='Enter Contact Person
                    Phone Number'
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
              {!editId && (
                <Col span={12}>
                  <Form.Item
                    name='password'
                    rules={[
                      {
                        required: true,
                        message: "Please enter hospital Password",
                      },
                    ]}>
                    <TextField
                      label={
                        <div className='flex items-center'>
                          <RiLockPasswordLine
                            style={{ marginRight: 8, fontSize: 20 }}
                          />
                          <div>Admin Password *</div>
                        </div>
                      }
                      fullWidth
                      variant='outlined'
                      placeholder='Enter Hospital Password'
                      size='small'
                      type={showPassword ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge='end'>
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Form.Item>
                </Col>
              )}
              <Col span={editId ? 24 : 12}>
                <Form.Item
                  name='website'
                  initialValue={editData?.website || ""}
                  rules={[
                    {
                      required: false,
                      message: "Please enter website url",
                    },
                  ]}>
                  <TextField
                    label={
                      <div className='flex items-center'>
                        <CgWebsite style={{ marginRight: 8, fontSize: 20 }} />
                        <div>Website URL</div>
                      </div>
                    }
                    variant='outlined'
                    fullWidth
                    size='small'
                    type='text'
                    placeholder='Enter the website url'
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
                  name='groupName'
                  initialValue={editData?.groupName || ""}
                  rules={[
                    {
                      required: false,
                      message: "Please enter group name",
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
                        <div>Group Name</div>
                      </div>
                    }
                    variant='outlined'
                    fullWidth
                    size='small'
                    type='text'
                    placeholder='Enter the Group Name'
                    InputProps={{
                      style: { height: 40 },
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='groupId'
                  initialValue={editData?.groupId || ""}
                  rules={[
                    {
                      required: false,
                      message: "Please enter group Id",
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
                        <div>Group ID</div>
                      </div>
                    }
                    variant='outlined'
                    fullWidth
                    size='small'
                    type='text'
                    placeholder='Enter the Group ID'
                    InputProps={{
                      style: { height: 40 },
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
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

            {/* <div className='flex items-center gap-4 flex-wrap w-[100%] flex-row'>
              <h1 className='text-center font-bold text-[#565656] w-[40%]'>
                Upload Hospital Image
              </h1>
              <Form.Item className='w-[55%]'>
                <div
                  {...getRootProps()}
                  className='w-full min-h-20 max-h-40 flex flex-col justify-center items-center border-2 border-dashed border-[#000000] rounded-lg cursor-pointer text-gray-500 hover:bg-gray-50'>
                  <input {...getInputProps()} />

                  {imageUrl ? (
                    <div className='mt-4 w-full flex items-center text-center justify-center'>
                      <div className='flex items-center gap-1 space-x-3 flex-wrap'>
                        {imageUrl ? (
                          imageUrl.endsWith(".png") ||
                          imageUrl.endsWith(".jpg") ||
                          (imageUrl.endsWith(".jpeg") && (
                            <img
                              src={imageUrl}
                              alt='Image'
                              className='w-16 h-16 object-cover'
                            />
                          ))
                        ) : (
                          <IoMdCloudUpload className='mb-2 text-3xl text-[#A4A4A4]' />
                        )}

                        <p>
                          {imageUrl
                            ?.split("/")
                            ?.pop()
                            ?.replace(/\d+/g, "")
                            ?.replace(/_/g, " ")
                            ?.trim()}
                        </p>

                        <BiSolidTrash
                          className='text-md font-light cursor-pointer'
                          onClick={() => {
                            setFile(null);
                            setImageUrl(null);
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <IoMdCloudUpload className='mb-2 text-3xl text-[#A4A4A4]' />
                  )}

                  <p className='ant-upload-text'>
                    Browse/drag to {imageUrl ? "change" : "upload"} file
                  </p>
                </div>
              </Form.Item>
            </div> */}
          </div>
          <footer className='flex justify-end items-center py-2 space-x-4'>
            <Button
              type='default'
              onClick={() => {
                form.resetFields();
                setHospitalDrawer(false);
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

export default AddHospital;
