// import { CloseOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
// import {
//   Autocomplete,
//   IconButton,
//   InputAdornment,
//   TextField,
// } from "@mui/material";
// import {
//   Button,
//   Col,
//   Drawer,
//   Form,
//   message,
//   Row,
//   Space,
//   Spin,
//   Switch,
// } from "antd";

// import {
//   MdOutlineBadge,
//   MdOutlineBedroomParent,
//   MdOutlineLocalHospital,
//   MdOutlineMeetingRoom,
// } from "react-icons/md";
// import { IoPersonCircle } from "react-icons/io5";
// import { FaLocationDot, FaStethoscope, FaUserDoctor } from "react-icons/fa6";
// import { CgWebsite } from "react-icons/cg";
// import LocationSearchMui from "../../utils/location";
// import { useEffect, useState } from "react";
// import { BiSolidTrash } from "react-icons/bi";
// import { handleUpload } from "../../utils/FileUpload";
// import { useDropzone } from "react-dropzone";
// import { IoMdCloudUpload } from "react-icons/io";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { RiLockPasswordLine } from "react-icons/ri";
// import { fetchData, postData, putData } from "../../api/apiService";
// import { autocompleteStyles, CustomPaper } from "../../utils/autoCompleteCss";
// import { TbMapPinCode } from "react-icons/tb";
// import { doctorQualifications, doctorSpecializations } from "./doctorJsonData";
// import { PiGitBranchFill } from "react-icons/pi";
// import {
//   MdOutlineWorkOutline,
//   MdOutlineLanguage,
//   MdOutlineVideoCall,
//   MdOutlinePerson,
// } from "react-icons/md";
// import { FiMonitor } from "react-icons/fi";

// const AddDoctor = ({
//   doctorDrawer,
//   setDoctorDrawer,
//   fetchDoctorsList,
//   editId = null,
//   setEditId,
//   branchData,
//   setBranchData,
//   departmentData = [],
// }) => {
//   console.log("AddDoctor component rendered");
//   console.log("editId:", editId);
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
//   const [selectedHospitalId, setSelectedHospitalId] = useState("");
//   const [selectedSpecilizations, setSelectedSpecilizations] = useState([]);
//   const [selectedQualifications, setSelectedQualifications] = useState([]);
//   const [selectedBranchIds, setSelectedBranchIds] = useState([]);
//   const [selectedDepartmentIds, setSelectedDepartmentIds] = useState([]);
//   const [selectedLanguages, setSelectedLanguages] = useState([]);
//   const [onlineConsultationAvailable, setOnlineConsultationAvailable] =
//     useState(true);
//   const [inPersonVisitAvailable, setInPersonVisitAvailable] = useState(false);

//   // Available languages list
//   const availableLanguages = [
//     "English",
//     "Hindi",
//     "Telugu",
//     "Tamil",
//     "Kannada",
//     "Malayalam",
//     "Bengali",
//     "Marathi",
//     "Gujarati",
//     "Punjabi",
//     "Urdu",
//     "Odia",
//   ];

//   console.log(editId);

//   const onFinish = async (values) => {
//     console.log(values);

//     const modifiedEmail = values?.email?.trim()?.toLowerCase() || "";

//     const isEditMode = Boolean(editId);

//     const payload = {
//       name: values?.doctorName?.trim() || "",
//       phone: values?.phoneNumber?.trim() || "",
//       email: modifiedEmail,
//       specialization: selectedSpecilizations,
//       qualifications: selectedQualifications,
//       consultationFee: values?.consultationFee
//         ? parseInt(values?.consultationFee)
//         : 0,
//       avatar: imageUrl || "",
//       branchId: selectedBranchIds,
//       departmentId: selectedDepartmentIds,
//       experience: values?.experience ? parseInt(values?.experience) : 0,
//       languages: selectedLanguages,
//       onlineConsultationAvailable: onlineConsultationAvailable,
//       inPersonVisitAvailable: inPersonVisitAvailable,
//       password: values.password,
//     };

//     // Add doctorId in edit mode
//     if (isEditMode) {
//       payload.doctorId = editId;
//       // delete payload.phone; // Uncomment if phone should not be updated
//     }

//     console.log(payload);

//     try {
//       setLoading(true);
//       const endpoint = isEditMode
//         ? "api/admin/update-doctor"
//         : "/api/admin/create-doctor";
//       const sendRequest = isEditMode ? putData : postData;
//       const response = await sendRequest(endpoint, payload);
//       if (response?.responseCode === 200) {
//         message.success(response?.message);
//         setDoctorDrawer(false);
//         fetchDoctorsList();
//       } else {
//         message.error(response?.message || "Something went wrong");
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to submit doctor data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSingleDoctor = async () => {
//     const payload = {
//       doctorId: editId,
//       day: "",
//     };
//     try {
//       setLoading(true);
//       const response = await postData("/api/admin/get-single-doctor", payload);
//       if (response?.responseCode == 200) {
//         setEditData(response?.data);
//         form.setFieldsValue({
//           doctorName: response?.data?.name || "",
//           phoneNumber: response?.data?.phone || "",
//           email: response?.data?.email || "",
//           consultationFee: response?.data?.consultationFee || "",
//           experience: response?.data?.experience || "",
//         });
//         const branchIds = response?.data?.branches?.map((branch) => branch._id);
//         const departmentIds = response?.data?.departments?.map(
//           (dept) => dept._id
//         );

//         console.log("Branch IDs:", branchIds);

//         setSelectedBranchIds(branchIds || []);
//         setSelectedDepartmentIds(departmentIds || []);
//         setSelectedQualifications(response?.data?.qualifications || []);
//         setSelectedSpecilizations(response?.data?.specialization || []);
//         setSelectedLanguages(response?.data?.languages || []);
//         setImageUrl(response?.data?.avatar || "");
//         setOnlineConsultationAvailable(
//           response?.data?.onlineConsultationAvailable ?? true
//         );
//         setInPersonVisitAvailable(
//           response?.data?.inPersonVisitAvailable ?? false
//         );
//       } else if (response?.responseCode == 400) {
//         message.error(response?.message || "Something went wrong");
//       } else {
//         message.error(response?.message || "Something went wrong");
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to fetch doctor data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     console.log(editId, "editId");
//     if (editId !== null) {
//       fetchSingleDoctor();
//     } else {
//       console.log("Rendering this");
//       form.resetFields();
//       setEditData({});
//       setAddress("");
//       setCity("");
//       setCountry("");
//       setState("");
//       setPincode("");
//       setLatitude("");
//       setLongitude("");
//       setSelectedHospitalId("");
//       setSelectedQualifications([]);
//       setSelectedBranchIds([]);
//       setSelectedSpecilizations([]);
//       setSelectedDepartmentIds([]);
//       setSelectedLanguages([]);
//       setImageUrl("");
//       setFile(null);
//       setOnlineConsultationAvailable(true);
//       setInPersonVisitAvailable(false);
//     }
//   }, [editId, doctorDrawer]);

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop: async (acceptedFiles, rejectedFiles) => {
//       const validExtensions = [".png", ".jpg", ".jpeg"];

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
//         if (file.size > 5242880) {
//           message.error("File size exceeds the maximum limit of 5MB.");
//           return;
//         }
//         setFile(
//           Object.assign(file, {
//             preview: URL.createObjectURL(file),
//           })
//         );

//         try {
//           // Handle file upload and get the returned URL
//           const Url = await handleUpload(file);
//           setImageUrl(Url);
//           message.success("Avatar uploaded successfully");
//         } catch (error) {
//           message.error("File upload failed. Please try again.");
//         }
//       });
//     },
//     maxFiles: 1, // Limit to one file at a time
//     accept: {
//       "image/*": [".jpeg", ".jpg", ".png"],
//     },
//   });

//   const removeFile = () => {
//     setFile(null);
//     setImageUrl("");
//   };

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
//   }, [addressObject, address]);

//   return (
//     <Drawer
//       visible={doctorDrawer}
//       closable={true}
//       title={
//         <h3 className="text-xl text-center text-black">
//           {editId ? "Update" : "Add"} Doctor
//         </h3>
//       }
//       footer={null}
//       maskClosable={true}
//       placement="right"
//       size="large"
//       extra={
//         <CloseOutlined
//           onClick={() => {
//             setEditId(null);
//             setDoctorDrawer(false);
//           }}
//           style={{ fontSize: "16px", cursor: "pointer" }}
//         />
//       }
//       className="custom-drawer preview-drawer"
//       onClose={() => {
//         setEditId(null);
//         setDoctorDrawer(false);
//       }}
//     >
//       <Form
//         layout="vertical"
//         form={form}
//         onFinish={onFinish}
//         className="client-details-form custom-form-ant"
//       >
//         <Spin spinning={loading}>
//           <div className="min-h-[82dvh] max-h-[82dvh] overflow-y-auto overflow-x-hidden pr-1 pt-2 custom-scrollbard">
//             <Row gutter={16}>
//               <Col span={12}>
//                 <Form.Item
//                   name="doctorName"
//                   initialValue={editData?.name || ""}
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please enter Doctor Name",
//                     },
//                     {
//                       pattern: /^[a-zA-Z0-9 ]*$/,
//                       message: "Only alphabets and numbers are allowed",
//                     },
//                   ]}
//                 >
//                   <TextField
//                     label={
//                       <div className="flex items-center">
//                         <FaUserDoctor
//                           style={{ marginRight: 8, fontSize: 20 }}
//                         />
//                         <div>Doctor Name *</div>
//                       </div>
//                     }
//                     variant="outlined"
//                     fullWidth
//                     size="small"
//                     type="text"
//                     placeholder="Enter Doctor Name"
//                     InputProps={{
//                       style: { height: 40 },
//                     }}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item
//                   name="phoneNumber"
//                   initialValue={editData?.phone || ""}
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please enter doctor phone number",
//                     },
//                     {
//                       pattern: /^\d+$/,
//                       message: "Phone number must contain only digits",
//                     },
//                     {
//                       len: 10,
//                       message: "Phone number must be 10 digits",
//                     },
//                   ]}
//                 >
//                   <TextField
//                     variant="outlined"
//                     fullWidth
//                     label={
//                       <div className="flex items-center">
//                         <PhoneOutlined
//                           style={{ marginRight: 8, fontSize: 20 }}
//                         />
//                         <div>Phone Number *</div>
//                       </div>
//                     }
//                     size="small"
//                     placeholder="Enter Doctor Phone Number"
//                     InputProps={{
//                       style: { height: 40 },
//                       classes: { input: "no-arrows" },
//                     }}
//                     disabled={editId}
//                     inputProps={{
//                       maxLength: 10,
//                     }}
//                     onChange={(e) => {
//                       if (
//                         !/^\d+$/.test(e.target.value) &&
//                         e.target.value !== ""
//                       )
//                         return;
//                     }}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col span={12}>
//                 <Form.Item
//                   name="email"
//                   initialValue={editData?.email || ""}
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please enter email",
//                     },
//                   ]}
//                 >
//                   <TextField
//                     label={
//                       <span>
//                         <MailOutlined style={{ marginRight: 8 }} /> Email ID *
//                       </span>
//                     }
//                     variant="outlined"
//                     fullWidth
//                     type="email"
//                     size="small"
//                     placeholder="Enter Email ID"
//                     InputProps={{
//                       style: { height: 40 },
//                     }}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item
//                   name="consultationFee"
//                   initialValue={editData?.consultationFee || ""}
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please enter Consultation Fee",
//                     },
//                   ]}
//                 >
//                   <TextField
//                     variant="outlined"
//                     fullWidth
//                     label={
//                       <div className="flex items-center">
//                         <MdOutlineMeetingRoom
//                           style={{ marginRight: 8, fontSize: 20 }}
//                         />
//                         <div>Consultation Fee *</div>
//                       </div>
//                     }
//                     type="number"
//                     size="small"
//                     placeholder="Enter Consultation Fee"
//                     InputProps={{
//                       style: { height: 40 },
//                       classes: { input: "no-arrows" },
//                     }}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col span={12}>
//                 <Form.Item
//                   name="experience"
//                   initialValue={editData?.experience || ""}
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please enter Years of Experience",
//                     },
//                   ]}
//                 >
//                   <TextField
//                     variant="outlined"
//                     fullWidth
//                     label={
//                       <div className="flex items-center">
//                         <MdOutlineWorkOutline
//                           style={{ marginRight: 8, fontSize: 20 }}
//                         />
//                         <div>Experience (Years) *</div>
//                       </div>
//                     }
//                     type="number"
//                     size="small"
//                     placeholder="Enter Years of Experience"
//                     InputProps={{
//                       style: { height: 40 },
//                       classes: { input: "no-arrows" },
//                     }}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item
//                   name="password"
//                   rules={[
//                     { required: true, message: "Please enter the Password" },
//                   ]}
//                 >
//                   <TextField
//                     label={
//                       <div className="flex items-center">
//                         <RiLockPasswordLine
//                           style={{ marginRight: 8, fontSize: 20 }}
//                         />
//                         <div>Password *</div>
//                       </div>
//                     }
//                     fullWidth
//                     variant="outlined"
//                     placeholder="Enter the Password"
//                     size="small"
//                     type={showPassword ? "text" : "password"}
//                     InputProps={{
//                       style: { height: 40 },
//                       endAdornment: (
//                         <InputAdornment position="end">
//                           <IconButton
//                             onClick={() => setShowPassword(!showPassword)}
//                             edge="end"
//                           >
//                             {showPassword ? <VisibilityOff /> : <Visibility />}
//                           </IconButton>
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Autocomplete
//               multiple
//               fullWidth
//               size="small"
//               className="mb-[12px]"
//               options={branchData || []}
//               getOptionLabel={(option) =>
//                 typeof option === "string" ? option : option.branchName
//               }
//               value={(branchData || []).filter((branch) =>
//                 selectedBranchIds.includes(branch._id)
//               )}
//               onChange={(event, newValue) => {
//                 const ids = newValue.map((item) => item._id);
//                 setSelectedBranchIds(ids);
//               }}
//               PaperComponent={CustomPaper}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   InputLabelProps={{
//                     required: false,
//                   }}
//                   label={
//                     <div className="flex items-center">
//                       <PiGitBranchFill
//                         style={{ marginRight: 8, fontSize: 20 }}
//                       />
//                       <div>Hospital Branches *</div>
//                     </div>
//                   }
//                   sx={autocompleteStyles}
//                 />
//               )}
//             />
//             <Autocomplete
//               multiple
//               fullWidth
//               size="small"
//               className="mb-[12px]"
//               options={departmentData || []}
//               getOptionLabel={
//                 (option) => (typeof option === "string" ? option : option.name) // Changed from departmentName to name
//               }
//               value={(departmentData || []).filter((dept) =>
//                 selectedDepartmentIds.includes(dept._id)
//               )}
//               onChange={(event, newValue) => {
//                 const ids = newValue.map((item) => item._id);
//                 setSelectedDepartmentIds(ids);
//               }}
//               PaperComponent={CustomPaper}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   InputLabelProps={{
//                     required: false,
//                   }}
//                   label={
//                     <div className="flex items-center">
//                       <MdOutlineLocalHospital
//                         style={{ marginRight: 8, fontSize: 20 }}
//                       />
//                       <div>Departments *</div>
//                     </div>
//                   }
//                   sx={autocompleteStyles}
//                 />
//               )}
//             />
//             <Autocomplete
//               multiple
//               fullWidth
//               className="mb-[12px]"
//               size="small"
//               limitTags={3}
//               options={doctorQualifications}
//               value={selectedQualifications}
//               onChange={(event, newValue) => {
//                 console.log("Selected qualifications:", newValue);
//                 setSelectedQualifications(newValue);
//               }}
//               getOptionLabel={(option) => option}
//               PaperComponent={CustomPaper}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   InputLabelProps={{
//                     required: false,
//                   }}
//                   label={
//                     <div className="flex items-center">
//                       <MdOutlineBadge
//                         style={{ marginRight: 8, fontSize: 20 }}
//                       />
//                       <div>Qualifications *</div>
//                     </div>
//                   }
//                   sx={autocompleteStyles}
//                 />
//               )}
//             />

//             <Autocomplete
//               multiple
//               fullWidth
//               size="small"
//               limitTags={3}
//               className="mb-[12px]"
//               options={doctorSpecializations}
//               value={selectedSpecilizations}
//               onChange={(event, newValue) => {
//                 console.log("Selected specializations:", newValue);
//                 setSelectedSpecilizations(newValue);
//               }}
//               getOptionLabel={(option) => option}
//               PaperComponent={CustomPaper}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   InputLabelProps={{
//                     required: false,
//                   }}
//                   label={
//                     <div className="flex items-center">
//                       <FaStethoscope style={{ marginRight: 8, fontSize: 20 }} />
//                       <div>Specializations *</div>
//                     </div>
//                   }
//                   sx={autocompleteStyles}
//                 />
//               )}
//             />

//             <Autocomplete
//               multiple
//               fullWidth
//               size="small"
//               limitTags={3}
//               className="mb-[12px]"
//               options={availableLanguages}
//               value={selectedLanguages}
//               onChange={(event, newValue) => {
//                 console.log("Selected languages:", newValue);
//                 setSelectedLanguages(newValue);
//               }}
//               getOptionLabel={(option) => option}
//               PaperComponent={CustomPaper}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   InputLabelProps={{
//                     required: false,
//                   }}
//                   label={
//                     <div className="flex items-center">
//                       <MdOutlineLanguage
//                         style={{ marginRight: 8, fontSize: 20 }}
//                       />
//                       <div>Languages *</div>
//                     </div>
//                   }
//                   sx={autocompleteStyles}
//                 />
//               )}
//             />

//             {/* Toggle Switches */}
//             <Row gutter={16} className="mb-4">
//               <Col span={12}>
//                 <div className="flex items-center justify-between p-3 border rounded-md">
//                   <div className="flex items-center">
//                     <MdOutlineVideoCall
//                       style={{ marginRight: 8, fontSize: 20, color: "#1890ff" }}
//                     />
//                     <span className="text-sm font-medium">
//                       Online Consultation
//                     </span>
//                   </div>
//                   <Switch
//                     checked={onlineConsultationAvailable}
//                     onChange={setOnlineConsultationAvailable}
//                     size="small"
//                   />
//                 </div>
//               </Col>
//               <Col span={12}>
//                 <div className="flex items-center justify-between p-3 border rounded-md">
//                   <div className="flex items-center">
//                     <MdOutlinePerson
//                       style={{ marginRight: 8, fontSize: 20, color: "#1890ff" }}
//                     />
//                     <span className="text-sm font-medium">In-Person Visit</span>
//                   </div>
//                   <Switch
//                     checked={inPersonVisitAvailable}
//                     onChange={setInPersonVisitAvailable}
//                     size="small"
//                   />
//                 </div>
//               </Col>
//             </Row>
//           </div>
//           <footer className="flex justify-end items-center py-2 space-x-4">
//             <Button
//               type="default"
//               onClick={() => {
//                 form.resetFields();
//                 setDoctorDrawer(false);
//               }}
//               className="min-w-[100px]"
//             >
//               Back
//             </Button>
//             <Button type="primary" htmlType="submit" className="min-w-[100px]">
//               {editId ? "Update" : "Add"}
//             </Button>
//           </footer>
//         </Spin>
//       </Form>
//     </Drawer>
//   );
// };

// export default AddDoctor;
