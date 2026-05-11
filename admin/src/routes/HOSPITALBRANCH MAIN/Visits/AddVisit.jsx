import {
  CalendarOutlined,
  CloseOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import {
  Autocomplete,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import { Button, Col, Drawer, Form, message, Row, Space, Spin } from "antd";
import {
  MdOutlineAccessTime,
  MdOutlineBadge,
  MdOutlineBedroomParent,
  MdOutlineLocalHospital,
  MdOutlineMeetingRoom,
} from "react-icons/md";
import { IoPersonCircle } from "react-icons/io5";
import {
  FaLocationDot,
  FaPersonWalkingArrowRight,
  FaStethoscope,
  FaUserDoctor,
  FaWheelchair,
} from "react-icons/fa6";
import { CgWebsite } from "react-icons/cg";
import LocationSearchMui from "../../../utils/location";
import { useEffect, useState } from "react";
import { BiSolidTrash } from "react-icons/bi";
import { handleUpload } from "../../../utils/FileUpload";
import { useDropzone } from "react-dropzone";
import { IoMdCloudUpload } from "react-icons/io";
import { AddOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { RiLockPasswordLine, RiLuggageDepositLine } from "react-icons/ri";
import { fetchData, postData, putData } from "../../../api/apiService";
import { autocompleteStyles, CustomPaper } from "../../../utils/autoCompleteCss";

import { PiGitBranchFill } from "react-icons/pi";

const AddVisit = ({
  visitDrawer,
  setVisitDrawer,
  fetchVisitsList,
  editId = null,
  setEditId,
  patientsData,
  setPatientsData,
  branchPatientModal,
  setBranchPatientModal,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [doctorsData, setDoctorsData] = useState([]);
  const [department, setDepartment] = useState("");
  const [appointmentData, setAppointmentData] = useState(null);
  const [appointmentLoading, setAppointmentLoading] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      if (selectedPatientId) {
        try {
          setAppointmentLoading(true);
          const response = await postData(
            `/api/admin/get-appointment-by-patientId`,
            { patientId: selectedPatientId } 
          );

          if (response?.responseCode === 200) {
            setAppointmentData(response.data);
            form.setFieldsValue({
              appointmentId: response.data?.appointmentId,
              department: response.data?.department,
            });
            setSelectedDoctorId(response.data?.doctor?._id || "");
          } else {
            form.setFieldsValue({
              appointmentId: "",
              department: "",
            });
            setSelectedDoctorId("");
          }
        } catch (error) {
          message.error(error?.message || "Failed to fetch appointment");
        } finally {
          setAppointmentLoading(false);
        }
      } else {
        form.setFieldsValue({
          appointmentId: "",
          department: "",
        });
        setSelectedDoctorId("");
      }
    };

    fetchAppointment();
  }, [selectedPatientId]);

  const onFinish = async (values) => {
    console.log(values);
    console.log(selectedPatientId);
    console.log(selectedDoctorId);

    const payload = {
      appointmentId: values?.appointmentId || "",
      patientId: selectedPatientId,
      visitType: values?.visitType, // OPD, IPD, Emergency
      department: values?.department,
      doctorAssigned: selectedDoctorId,
      complaints: values?.complaints,
      medicalRecords: [],
      vitals: {
        bp: values?.bp,
        temp: values?.temp, // in °F
        pulse: values?.pulse, // bpm
        weight: values?.weight, // kg
        height: values?.height, // cm
      },
    };
    console.log(payload);
    try {
      setLoading(true);
      const response = await postData(
        "/api/branch/create-visit-by-branch",
        payload
      );
      if (response?.responseCode == 200) {
        console.log(response);
        setVisitDrawer(false);
        fetchVisitsList();
        form.resetFields();
        setSelectedDoctorId("");
        setSelectedPatientId("");
      } else if (response?.responseCode == 400) {
        message.error(response?.message || "Something went wrong");
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to fetch doctors List");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editId == null) {
      form.resetFields();
      setSelectedDoctorId("");
      setSelectedPatientId("");
    }
  }, [editId, visitDrawer]);

  const fetchDoctorsList = async () => {
    const payload = {
      search: "", // name , phone
      sort: -1, // 1 for old, -1 for new
      page: 1,
      pageSize: 1000,
    };
    try {
      setLoading(true);
      const response = await postData(
        "/api/branch/list-of-doctor-by-branchId",
        payload
      );
      if (response?.responseCode == 200) {
        setDoctorsData(response?.data?.doctors || []);
      } else if (response?.responseCode == 400) {
        message.error(response?.message || "Something went wrong");
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to fetch doctors List");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorsList();
  }, []);

  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`;
  };

  return (
    <Drawer
      visible={visitDrawer}
      closable={true}
      title={<h3 className='text-xl text-center text-black'>Add Visit</h3>}
      footer={null}
      maskClosable={true}
      placement='right'
      size='large'
      extra={
        <CloseOutlined
          onClick={() => {
            setEditId(null);
            setVisitDrawer(false);
          }}
          style={{ fontSize: "16px", cursor: "pointer" }}
        />
      }
      className='custom-drawer preview-drawer'
      onClose={() => {
        setEditId(null);
        setVisitDrawer(false);
      }}>
      <Form
        layout='vertical'
        form={form}
        onFinish={onFinish}
        className='client-details-form custom-form-ant'>
        <Spin spinning={loading}>
          <div className='min-h-[82dvh] max-h-[82dvh] overflow-y-auto overflow-x-hidden pr-1 pt-2 custom-scrollbard'>
            <Row gutter={16}>
              {/* Patient Selection */}
              <Col span={11}>
                <Autocomplete
                  fullWidth
                  size='small'
                  className='mb-[12px]'
                  options={patientsData || []}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.name
                  }
                  value={
                    Array.isArray(patientsData)
                      ? patientsData.find(
                        (patient) =>
                          patient._id?.toString() ===
                          selectedPatientId?.toString()
                      ) || null
                      : null
                  }
                  onChange={(event, newValue) => {
                    setSelectedPatientId(newValue?._id || "");
                  }}
                  PaperComponent={CustomPaper}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      InputLabelProps={{ required: false }}
                      label={
                        <div className='flex items-center'>
                          <FaWheelchair
                            style={{ marginRight: 8, fontSize: 20 }}
                          />
                          <div>Patient *</div>
                        </div>
                      }
                      sx={autocompleteStyles}
                    />
                  )}
                />
              </Col>

              <Col
                span={2}
                className='flex items-center justify-center mb-[12px] gap-1 cursor-pointer'
                onClick={() => setBranchPatientModal(true)}>
                <AddOutlined />
                <p>Add</p>
              </Col>

              {/* Branch Selection */}
              <Col span={11}>
                <Autocomplete
                  fullWidth
                  size='small'
                  options={doctorsData || []} // Pass full object
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.name
                  }
                  //   value={selectedHospitalId || null}
                  value={
                    Array.isArray(doctorsData)
                      ? doctorsData.find(
                        (doctor) =>
                          doctor._id?.toString() ===
                          (selectedDoctorId || appointmentData?.doctor?._id || "").toString()
                      ) || null
                      : null
                  }
                  rules={[
                    {
                      required: true,
                      message: "Doctor is required",
                    },
                  ]}
                  PaperComponent={CustomPaper}
                  onChange={(event, newValue) => {
                    console.log(newValue);
                    if (newValue) {
                      setSelectedDoctorId(newValue._id);

                      if (
                        Array.isArray(newValue.specialization) &&
                        newValue.specialization.length > 0
                      ) {
                        console.log(newValue.specialization[0]);
                        form.setFieldsValue({
                          department: newValue.specialization[0],
                        });

                        setDepartment(newValue.specialization[0]); // Correct access to first specialization
                      }
                    } else {
                      setSelectedDoctorId("");
                      setDepartment("");
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required={true}
                      InputLabelProps={{
                        required: false,
                      }}
                      label={
                        <div className='flex items-center'>
                          <FaUserDoctor
                            style={{ marginRight: 8, fontSize: 20 }}
                          />
                          <div>Doctor *</div>
                        </div>
                      }
                      sx={autocompleteStyles}
                    />
                  )}
                />
              </Col>
            </Row>
            {/* Add this above Patient Selection */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="appointmentId">
                  <TextField
                    label={
                      <div className='flex items-center'>
                        <MdOutlineBadge style={{ marginRight: 8, fontSize: 20 }} />
                        <div>Appointment ID</div>
                      </div>
                    }
                    variant='outlined'
                    fullWidth
                    size='small'
                    type='text'
                    placeholder='Appointment ID'
                    InputProps={{
                      readOnly: true,
                      style: { height: 40 },
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='department'
                  initialValue={appointmentData?.department || ""}
                  rules={[
                    {
                      required: true,
                      message: "Please enter department Name",
                    },
                  ]}>
                  <TextField
                    label={
                      <div className='flex items-center'>
                        <RiLuggageDepositLine
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                        <div>Department *</div>
                      </div>
                    }
                    variant='outlined'
                    fullWidth
                    size='small'
                    disabled
                    type='text'
                    placeholder='Enter Department'
                    InputProps={{
                      style: { height: 40 },
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='visitType'
                  rules={[
                    {
                      required: true,
                      message: "Please select visit type",
                    },
                  ]}>
                  <TextField
                    select
                    fullWidth
                    size='small'
                    label={
                      <div className='flex items-center'>
                        <FaPersonWalkingArrowRight
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                        <div>Visit Type *</div>
                      </div>
                    }
                    placeholder='Select Visit Type'>
                    <MenuItem value='OPD'>OPD</MenuItem>
                    <MenuItem value='IPD'>IPD</MenuItem>
                    <MenuItem value='Emergency'>Emergency</MenuItem>
                  </TextField>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='date'
                  initialValue={getTodayDate()}
                  rules={[
                    {
                      required: false,
                      message: "Please select date",
                    },
                  ]}>
                  <TextField
                    type='date'
                    onClick={(e) => e.target.showPicker()}
                    fullWidth
                    defaultValue={getTodayDate()}
                    label={
                      <div className='flex items-center'>
                        <CalendarOutlined
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                        <div>Date *</div>
                      </div>
                    }
                    size='small'
                    variant='outlined'
                    InputLabelProps={{ shrink: true }}
                    onKeyDown={(e) => e.preventDefault()}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='time'
                  rules={[
                    {
                      required: true,
                      message: "Please select time",
                    },
                  ]}>
                  <TextField
                    type='time'
                    onClick={(e) => e.target.showPicker()}
                    fullWidth
                    label={
                      <div className='flex items-center'>
                        <MdOutlineAccessTime
                          style={{ marginRight: 8, fontSize: 20 }}
                        />{" "}
                        <div>Time *</div>
                      </div>
                    }
                    size='small'
                    variant='outlined'
                    InputLabelProps={{ shrink: true }}
                    onKeyDown={(e) => e.preventDefault()}
                  />
                </Form.Item>
              </Col>
            </Row>{" "}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='bp'
                  rules={[
                    {
                      required: false,
                      message: "Please enter Patient BP",
                    },
                  ]}>
                  <TextField
                    label={
                      <div className='flex items-center'>
                        <FaWheelchair
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                        <div>BP *</div>
                      </div>
                    }
                    variant='outlined'
                    fullWidth
                    size='small'
                    type='text'
                    placeholder='Enter Patient BP'
                    InputProps={{
                      style: { height: 40 },
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='temp'
                  rules={[
                    {
                      required: false,
                      message: "Please enter Patient Temperature",
                    },
                  ]}>
                  <TextField
                    label={
                      <div className='flex items-center'>
                        <FaWheelchair
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                        <div>Temperature(°F) *</div>
                      </div>
                    }
                    variant='outlined'
                    fullWidth
                    size='small'
                    type='text'
                    placeholder='Enter Patient Temperature'
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
                  name='pulse'
                  rules={[
                    {
                      required: false,
                      message: "Please enter Patient Pulse",
                    },
                  ]}>
                  <TextField
                    label={
                      <div className='flex items-center'>
                        <FaWheelchair
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                        <div>Pulse(bpm) *</div>
                      </div>
                    }
                    variant='outlined'
                    fullWidth
                    size='small'
                    type='text'
                    placeholder='Enter Patient Pulse'
                    InputProps={{
                      style: { height: 40 },
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='height'
                  rules={[
                    {
                      required: false,
                      message: "Please enter Patient Height",
                    },
                  ]}>
                  <TextField
                    label={
                      <div className='flex items-center'>
                        <FaWheelchair
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                        <div>Height(cms) *</div>
                      </div>
                    }
                    variant='outlined'
                    fullWidth
                    size='small'
                    type='text'
                    placeholder='Enter Patient Height'
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
                  name='weight'
                  rules={[
                    {
                      required: false,
                      message: "Please enter Patient Weight",
                    },
                  ]}>
                  <TextField
                    label={
                      <div className='flex items-center'>
                        <FaWheelchair
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                        <div>Weight(Kgs) *</div>
                      </div>
                    }
                    variant='outlined'
                    fullWidth
                    size='small'
                    type='text'
                    placeholder='Enter Patient Weight'
                    InputProps={{
                      style: { height: 40 },
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='complaints'
                  rules={[
                    {
                      required: false,
                      message: "Please enter Patient complaints",
                    },
                  ]}>
                  <TextField
                    label={
                      <div className='flex items-center'>
                        <FaWheelchair
                          style={{ marginRight: 8, fontSize: 20 }}
                        />
                        <div>Complaints *</div>
                      </div>
                    }
                    variant='outlined'
                    fullWidth
                    multiline
                    rows={2}
                    size='small'
                    type='text'
                    placeholder='Enter Patient Complaints'
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
                setVisitDrawer(false);
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

export default AddVisit;
