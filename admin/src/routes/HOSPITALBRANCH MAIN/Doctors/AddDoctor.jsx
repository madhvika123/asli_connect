import { CloseOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import {
  Autocomplete,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Button, Col, Drawer, Form, message, Row, Space, Spin } from "antd";
import {
  MdOutlineBadge,
  MdOutlineBedroomParent,
  MdOutlineLocalHospital,
  MdOutlineMeetingRoom,
} from "react-icons/md";
import { IoPersonCircle } from "react-icons/io5";
import { FaLocationDot, FaStethoscope, FaUserDoctor } from "react-icons/fa6";
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
import {
  autocompleteStyles,
  CustomPaper,
} from "../../../utils/autoCompleteCss";
import { TbMapPinCode } from "react-icons/tb";
import { doctorQualifications, doctorSpecializations } from "./doctorJsonData";
import { PiGitBranchFill } from "react-icons/pi";

const AddDoctor = ({
  doctorDrawer,
  setDoctorDrawer,
  fetchDoctorsList,
  editId = null,
  setEditId,
  branchData,
  setBranchData,
  departmentData = [],
}) => {
  console.log("AddDoctor component rendered");
  console.log("Edit ID:", editId);
  console.log("Branch Data:", branchData);
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
  const [selectedSpecilizations, setSelectedSpecilizations] = useState([]);
  const [selectedQualifications, setSelectedQualifications] = useState([]);
  const [selectedBranchIds, setSelectedBranchIds] = useState([]);

  const branchesArray = branchData?.branches || [];
  console.log(editId);

  const onFinish = async (values) => {
    console.log(values);

    const modifiedEmail = values?.email?.trim()?.toLowerCase() || "";

    const isEditMode = Boolean(editId);

    const payload = {
      name: values?.doctorName?.trim() || "",
      phone: values?.phoneNumber?.trim() || "",
      email: modifiedEmail,
      specialization: selectedSpecilizations,
      qualifications: selectedQualifications,
      consultationFee: values?.consultationFee
        ? parseInt(values?.consultationFee)
        : 0,
      avatar: "",
      branchId: selectedBranchIds,
      password: values.password,
    };

    // Add hospitalId in edit mode
    if (isEditMode) {
      payload.doctorId = editId;
      // delete payload.phone;
    }

    console.log(payload);

    try {
      setLoading(true);
      const endpoint = isEditMode
        ? "api/admin/update-doctor"
        : "/api/branch/create-doctor-by-branch";
      const sendRequest = isEditMode ? putData : postData;
      const response = await sendRequest(endpoint, payload);
      if (response?.responseCode === 200) {
        message.success(response?.message);
        setDoctorDrawer(false);
        fetchDoctorsList();
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to submit hospital data");
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleDoctor = async () => {
    const payload = {
      doctorId: editId,
      day: "",
    };
    try {
      setLoading(true);
      const response = await postData("/api/admin/get-single-doctor", payload);
      if (response?.responseCode == 200) {
        setEditData(response?.data);
        form.setFieldsValue({
          doctorName: response?.data?.name || "",
          phoneNumber: response?.data?.phone || "",
          email: response?.data?.email || "",
          consultationFee: response?.data?.consultationFee || "",
        });
        const branchIds = response?.data?.branches?.map((branch) => branch._id);
        console.log("Branch IDs:", branchIds);
        setSelectedBranchIds(branchIds || []);
        setSelectedQualifications(response?.data?.qualifications || []);
        setSelectedSpecilizations(response?.data?.specialization || []);
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
  };

  useEffect(() => {
    console.log(editId, "useEffect triggered edit id");
    if (editId !== null) {
      fetchSingleDoctor();
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
      setSelectedQualifications([]);
      setSelectedBranchIds([]);
      setSelectedSpecilizations([]);
    }
  }, [editId, doctorDrawer]);

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
  }, [addressObject, address]);

  console.log("Selected Branch IDs:", selectedBranchIds);
  console.log("all branches:", branchesArray);

  return (
    <Drawer
      visible={doctorDrawer}
      closable={true}
      title={
        <h3 className="text-xl text-center text-black">
          {editId ? "Update" : "Add"} Doctor
        </h3>
      }
      footer={null}
      maskClosable={true}
      placement="right"
      size="large"
      extra={
        <CloseOutlined
          onClick={() => {
            setEditId(null);
            setDoctorDrawer(false);
          }}
          style={{ fontSize: "16px", cursor: "pointer" }}
        />
      }
      className="custom-drawer preview-drawer"
      onClose={() => {
        setEditId(null);
        setDoctorDrawer(false);
      }}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        className="client-details-form custom-form-ant"
      >
        <Spin spinning={loading}>
          <div className="min-h-[82dvh] max-h-[82dvh] overflow-y-auto overflow-x-hidden pr-1 pt-2 custom-scrollbard">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="doctorName"
                  initialValue={editData?.patientName || ""}
                  rules={[
                    {
                      required: true,
                      message: "Please enter Doctor Name",
                    },
                    {
                      pattern: /^[a-zA-Z0-9 ]*$/,
                      message: "Only alphabets and numbers are allowed",
                    },
                  ]}
                >
                  <TextField
                    label={
                      <div className="flex items-center">
                        <FaUserDoctor
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                        <div>Doctor Name *</div>
                      </div>
                    }
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="text"
                    placeholder="Enter Doctor Name"
                    InputProps={{
                      style: { height: 40 },
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phoneNumber"
                  initialValue={editData?.phone || ""}
                  rules={[
                    {
                      required: true,
                      message: "Please enter doctor phone number",
                    },
                    {
                      pattern: /^\d+$/,
                      message: "Phone number must contain only digits",
                    },
                    {
                      len: 10,
                      message: "Phone number must be 10 digits",
                    },
                  ]}
                >
                  <TextField
                    variant="outlined"
                    fullWidth
                    label={
                      <div className="flex items-center">
                        <PhoneOutlined
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                        <div>Phone Number *</div>
                      </div>
                    }
                    size="small"
                    placeholder="Enter Doctor Phone Number"
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
                  name="email"
                  initialValue={editData?.email || ""}
                  rules={[
                    {
                      required: true,
                      message: "Please enter email",
                    },
                  ]}
                >
                  <TextField
                    label={
                      <span>
                        <MailOutlined style={{ marginRight: 8 }} /> Email ID *
                      </span>
                    }
                    variant="outlined" // You can use "outlined", "filled", or "standard" variants
                    fullWidth
                    type="email"
                    size="small"
                    placeholder="Enter Email ID"
                    InputProps={{
                      style: { height: 40 }, // Adjusting height if necessary
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="consultationFee"
                  initialValue={editData?.consultationFee || ""}
                  rules={[
                    {
                      required: true,
                      message: "Please enter Consultation Fee",
                    },
                  ]}
                >
                  <TextField
                    variant="outlined"
                    fullWidth
                    label={
                      <div className="flex items-center">
                        <MdOutlineMeetingRoom
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                        <div>Consultation Fee *</div>
                      </div>
                    }
                    type="number"
                    size="small"
                    placeholder="Enter Consultation Fee"
                    InputProps={{
                      style: { height: 40 },
                      classes: { input: "no-arrows" },
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Autocomplete
              multiple
              fullWidth
              size="small"
              className="mb-[12px]"
              options={branchesArray} // Use branchesArray here
              getOptionLabel={(option) => option.branchName}
              value={branchesArray.filter((branch) =>
                selectedBranchIds.includes(branch._id)
              )}
              onChange={(event, newValue) => {
                const ids = newValue.map((item) => item._id);
                setSelectedBranchIds(ids);
              }}
              PaperComponent={CustomPaper}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputLabelProps={{
                    required: false,
                  }}
                  label={
                    <div className="flex items-center">
                      <PiGitBranchFill
                        style={{ marginRight: 8, fontSize: 20 }}
                      />
                      <div>Hospital Branches</div>
                    </div>
                  }
                  sx={autocompleteStyles}
                />
              )}
            />

            <Autocomplete
              multiple
              fullWidth
              className="mb-[12px]"
              size="small"
              limitTags={3}
              options={doctorQualifications}
              value={selectedQualifications}
              onChange={(event, newValue) => {
                console.log("Selected qualifications:", newValue);
                setSelectedQualifications(newValue);
              }}
              getOptionLabel={(option) => option}
              PaperComponent={CustomPaper}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputLabelProps={{
                    required: false,
                  }}
                  label={
                    <div className="flex items-center">
                      <MdOutlineBadge
                        style={{ marginRight: 8, fontSize: 20 }}
                      />
                      <div>Qualifications</div>
                    </div>
                  }
                  sx={autocompleteStyles}
                />
              )}
            />

            <Autocomplete
              multiple
              fullWidth
              size="small"
              limitTags={3}
              className="mb-[12px]"
              options={doctorSpecializations}
              value={selectedSpecilizations}
              onChange={(event, newValue) => {
                console.log("Selected qualifications:", newValue);
                setSelectedSpecilizations(newValue);
              }}
              getOptionLabel={(option) => option}
              PaperComponent={CustomPaper}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputLabelProps={{
                    required: false,
                  }}
                  label={
                    <div className="flex items-center">
                      <FaStethoscope style={{ marginRight: 8, fontSize: 20 }} />
                      <div>Specializatios</div>
                    </div>
                  }
                  sx={autocompleteStyles}
                />
              )}
            />
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please enter the Password" }]}
            >
              <TextField
                label={
                  <div className="flex items-center">
                    <RiLockPasswordLine
                      style={{ marginRight: 8, fontSize: 20 }}
                    />
                    <div>Password *</div>
                  </div>
                }
                fullWidth
                variant="outlined"
                placeholder="Enter the Password"
                size="small"
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Form.Item>
            {/* <div className='flex items-center gap-4 flex-wrap w-[100%] flex-row'>
              <h1 className='text-center font-bold text-[#565656] w-[40%]'>
                Upload Doctor Image
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
          <footer className="flex justify-end items-center py-2 space-x-4">
            <Button
              type="default"
              onClick={() => {
                form.resetFields();
                setDoctorDrawer(false);
              }}
              className="min-w-[100px]"
            >
              Back
            </Button>
            <Button type="primary" htmlType="submit" className="min-w-[100px]">
              {editId ? "Update" : "Add"}
            </Button>
          </footer>
        </Spin>
      </Form>
    </Drawer>
  );
};

export default AddDoctor;
