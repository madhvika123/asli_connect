// import {
//   CalendarOutlined,
//   CloseOutlined,
//   PhoneOutlined,
// } from "@ant-design/icons";
// import { MenuItem, TextField } from "@mui/material";
// import {
//   Button,
//   Col,
//   Drawer,
//   Form,
//   message,
//   Row,
//   Space,
//   Spin,
//   Select,
// } from "antd";
// import { IoPersonCircle } from "react-icons/io5";
// import LocationSearchMui from "../../utils/location";
// import { useEffect, useState } from "react";
// import { handleUpload } from "../../utils/FileUpload";
// import { useDropzone } from "react-dropzone";
// import { fetchData, postData, putData } from "../../api/apiService";
// import {
//   FaLocationDot,
//   FaTransgender,
//   FaUser,
//   FaWheelchair,
// } from "react-icons/fa6";
// import { HiOutlineIdentification } from "react-icons/hi2";
// import { MailOutlined } from "@mui/icons-material";
// import { EnvironmentOutlined } from "@ant-design/icons";

// const { Option } = Select;

// const AddUser = ({
//   patientDrawer,
//   setPatientDrawer,
//   fetchPatientsList,
//   editId = null,
//   setEditId,
// }) => {
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
//   const [constituencies, setConstituencies] = useState([]);

//   const onFinish = async (values) => {
//     const isEditMode = Boolean(editId);
//     const payload = {
//       name: values?.name?.trim() || "",
//       gender: values?.gender,
//       phone: values?.phoneNumber?.trim() || "",
//       dateOfBirth: values?.dateOfBirth,
//       address: address || "",
//       city: city?.trim() || "",
//       state: state?.trim() || "",
//       country: country?.trim() || "",
//       aadhaarNumber: values?.aadharNumber?.trim() || "",
//       avatar: "",
//       pincode: pincode?.trim() || "",
//       constituency: values?.constituency || "",
//     };
//     // if (isEditMode) {
//     //   payload.patientId = editId;
//     // }

//     try {
//       setLoading(true);
//       const response = await postData("/api/admin/add-or-update-user", payload);
//       if (response?.responseCode === 200) {
//         message.success(response?.message);
//         setPatientDrawer(false);
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

//   const fetchSinglePatient = async () => {
//     const payload = {
//       patientId: editId,
//     };
//     try {
//       setLoading(true);
//       const response = await postData("/api/admin/get-single-patient", payload);
//       if (response?.responseCode == 200) {
//         setEditData(response?.data);
//         form.setFieldsValue({
//           patientName: response?.data?.name,
//           gender: response?.data?.gender,
//           phoneNumber: response?.data?.phone || "",
//           emergencyContact: response?.data?.emergencyContact || "",
//           dateOfBirth: response?.data?.dateOfBirth,
//           aadharNumber: response?.data?.aadhaarNumber || "",
//           pincode: response?.data?.pincode || "",
//           state: response?.data?.state || "",
//           country: response?.data?.country || "",
//           address: response?.data?.address || "",
//           city: response?.data?.city || "",
//           guardianName: response?.data?.guardian?.name,
//           guardianRelation: response?.data?.guardian?.relation,
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
//       message.error(error?.message || "Failed to fetch single patient");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (editId !== null) {
//       fetchSinglePatient();
//     } else {
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
//     }
//   }, [editId, patientDrawer]);

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

//   return (
//     <Drawer
//       visible={patientDrawer}
//       closable={true}
//       title={
//         <h3 className="text-xl text-center text-black">
//           {editId ? "Update" : "Add"} User
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
//             setPatientDrawer(false);
//           }}
//           style={{ fontSize: "16px", cursor: "pointer" }}
//         />
//       }
//       className="custom-drawer preview-drawer"
//       onClose={() => {
//         setEditId(null);
//         setPatientDrawer(false);
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
//                   name="name"
//                   initialValue={editData?.name || ""}
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please enter User Name",
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
//                         <FaUser style={{ marginRight: 8, fontSize: 20 }} />
//                         <div>User Name *</div>
//                       </div>
//                     }
//                     variant="outlined"
//                     fullWidth
//                     size="small"
//                     type="text"
//                     placeholder="Enter User Name"
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
//                       message: "Please enter User phone number",
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
//                     placeholder="Enter Patient Phone Number"
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
//                       message: "Please enter  email",
//                     },
//                     {
//                       type: "email",
//                       message: "Please enter a valid email address",
//                     },
//                   ]}
//                 >
//                   <TextField
//                     variant="outlined"
//                     fullWidth
//                     label={
//                       <div className="flex items-center">
//                         <MailOutlined
//                           style={{ marginRight: 8, fontSize: 20 }}
//                         />
//                         <div>Email *</div>
//                       </div>
//                     }
//                     size="small"
//                     placeholder="EnterEmail"
//                     InputProps={{
//                       style: { height: 40 },
//                     }}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item
//                   name="aadharNumber"
//                   initialValue={editData?.aadharNumber || ""}
//                   rules={[
//                     {
//                       required: false,
//                       message: "Please enter aadhar number",
//                     },
//                     {
//                       pattern: /^\d+$/,
//                       message: "aadhar number must contain only digits",
//                     },
//                     {
//                       len: 12,
//                       message: "Aadhar number must be 12 digits",
//                     },
//                   ]}
//                 >
//                   <TextField
//                     variant="outlined"
//                     fullWidth
//                     label={
//                       <div className="flex items-center">
//                         <HiOutlineIdentification
//                           style={{ marginRight: 8, fontSize: 20 }}
//                         />
//                         <div>Aadhar Number</div>
//                       </div>
//                     }
//                     size="small"
//                     placeholder="Enter aadhar number"
//                     InputProps={{
//                       style: { height: 40 },
//                       classes: { input: "no-arrows" },
//                     }}
//                     inputProps={{
//                       maxLength: 12,
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
//                   name="gender"
//                   initialValue={editData?.gender || ""}
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please select gender",
//                     },
//                   ]}
//                 >
//                   <TextField
//                     select
//                     fullWidth
//                     size="small"
//                     label={
//                       <div className="flex items-center">
//                         <FaTransgender
//                           style={{ marginRight: 8, fontSize: 20 }}
//                         />
//                         <div>Gender *</div>
//                       </div>
//                     }
//                     placeholder="Select Gender"
//                   >
//                     <MenuItem value="male">Male</MenuItem>
//                     <MenuItem value="female">Female</MenuItem>
//                     <MenuItem value="other">Others</MenuItem>
//                   </TextField>
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item
//                   name="dateOfBirth"
//                   rules={[
//                     {
//                       required: false,
//                       message: "Please select date of birth",
//                     },
//                   ]}
//                   initialValue={editData?.dateOfBirth}
//                 >
//                   <TextField
//                     type="date"
//                     onClick={(e) => e.target.showPicker()}
//                     fullWidth
//                     label={
//                       <div className="flex items-center">
//                         <CalendarOutlined
//                           style={{ marginRight: 8, fontSize: 20 }}
//                         />{" "}
//                         <div>Date of Birth</div>
//                       </div>
//                     }
//                     size="small"
//                     variant="outlined"
//                     InputLabelProps={{ shrink: true }}
//                     onKeyDown={(e) => e.preventDefault()}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <Form.Item
//                   name="address"
//                   rules={[
//                     {
//                       required: false,
//                       message: "Address is required",
//                     },
//                   ]}
//                 >
//                   <LocationSearchMui
//                     value={address}
//                     onChange={(value) => {
//                       setAddress(value);
//                     }}
//                     initialValue={address}
//                     setLatitude={setLatitude}
//                     setLongitude={setLongitude}
//                     setArea={setArea}
//                     setAddress={setAddress}
//                     setAddressObject={setAddressObject}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item
//                   name="constituency"
//                   initialValue={editData?.constituency || ""}
//                   //   rules={[
//                   //     {
//                   //       required: true,
//                   //       message: "Please select a constituency",
//                   //     },
//                   //   ]}
//                 >
//                   <Select
//                     placeholder={
//                       <div className="flex items-center">
//                         <EnvironmentOutlined
//                           style={{ marginRight: 8, fontSize: 20 }}
//                         />
//                         <span>Select Constituency</span>
//                       </div>
//                     }
//                     showSearch
//                     optionFilterProp="children"
//                     size="middle"
//                     style={{ width: "100%" }}
//                   >
//                     {constituencies.map((c) => (
//                       <Option key={c._id} value={c._id}>
//                         {c.name}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </Col>
//             </Row>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <Form.Item
//                   name="city"
//                   initialValue={editData?.city || ""}
//                   rules={[
//                     {
//                       required: false,
//                       message: "Please enter the city",
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
//                         <FaLocationDot
//                           style={{ marginRight: 8, fontSize: 20 }}
//                         />
//                         <div>City</div>
//                       </div>
//                     }
//                     variant="outlined"
//                     fullWidth
//                     size="small"
//                     type="text"
//                     value={city}
//                     onChange={(e) => setCity(e.target.value)}
//                     // placeholder='Enter the city'
//                     InputLabelProps={{ shrink: city }}
//                     InputProps={{
//                       style: { height: 40 },
//                     }}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item
//                   name="state"
//                   initialValue={editData?.state || ""}
//                   rules={[
//                     {
//                       required: false,
//                       message: "Please enter the state",
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
//                         <FaLocationDot
//                           style={{ marginRight: 8, fontSize: 20 }}
//                         />
//                         <div>State</div>
//                       </div>
//                     }
//                     variant="outlined"
//                     fullWidth
//                     size="small"
//                     type="text"
//                     value={state}
//                     onChange={(e) => setState(e.target.value)}
//                     InputLabelProps={{ shrink: state }}
//                     // placeholder='Enter the State'
//                     InputProps={{
//                       style: { height: 40 },
//                     }}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <Form.Item
//                   name="country"
//                   initialValue={editData?.country || ""}
//                   rules={[
//                     {
//                       required: false,
//                       message: "Please enter the country",
//                     },
//                   ]}
//                 >
//                   <TextField
//                     label={
//                       <div className="flex items-center">
//                         <FaLocationDot
//                           style={{ marginRight: 8, fontSize: 20 }}
//                         />
//                         <div>Country</div>
//                       </div>
//                     }
//                     variant="outlined"
//                     fullWidth
//                     size="small"
//                     type="text"
//                     value={country}
//                     onChange={(e) => setCountry(e.target.value)}
//                     // placeholder='Enter the country'
//                     InputLabelProps={{ shrink: country }}
//                     InputProps={{
//                       style: { height: 40 },
//                     }}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item
//                   name="pincode"
//                   initialValue={editData?.pincode || ""}
//                   rules={[
//                     {
//                       required: false,
//                       message: "Please enter the pincode",
//                     },
//                     {
//                       pattern: /^[0-9]*$/,
//                       message: "Only numbers are allowed",
//                     },
//                   ]}
//                 >
//                   <TextField
//                     label={
//                       <div className="flex items-center">
//                         <IoPersonCircle
//                           style={{ marginRight: 8, fontSize: 20 }}
//                         />
//                         <div>Pincode</div>
//                       </div>
//                     }
//                     variant="outlined"
//                     fullWidth
//                     size="small"
//                     type="number"
//                     value={pincode}
//                     onChange={(e) => setPincode(e.target.value)}
//                     // placeholder='Enter the Pincode'
//                     InputLabelProps={{ shrink: pincode }}
//                     InputProps={{
//                       classes: { input: "no-arrows" },
//                       min: 0,
//                       onWheel: (e) => e.target.blur(),
//                       style: { height: 40 },
//                     }}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>
//           </div>
//           <footer className="flex justify-end items-center py-2 space-x-4">
//             <Button
//               type="default"
//               onClick={() => {
//                 form.resetFields();
//                 setPatientDrawer(false);
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

// export default AddUser;
