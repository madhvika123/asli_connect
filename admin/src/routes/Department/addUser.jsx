// import {
//   CalendarOutlined,
//   CloseOutlined,
//   PhoneOutlined,
//   EnvironmentOutlined,
// } from "@ant-design/icons";
// import { MenuItem, TextField } from "@mui/material";
// import {
//   Button,
//   Col,
//   Drawer,
//   Form,
//   message,
//   Row,
//   Spin,
//   Select,
// } from "antd";
// import { IoPersonCircle } from "react-icons/io5";
// import LocationSearchMui from "../../utils/location";
// import { useEffect, useState } from "react";
// import { handleUpload } from "../../utils/FileUpload";
// import { useDropzone } from "react-dropzone";
// import { fetchData, postData } from "../../api/apiService";
// import { FaTransgender, FaUser } from "react-icons/fa6";
// import { HiOutlineIdentification } from "react-icons/hi2";
// import { MailOutlined } from "@mui/icons-material";

// // NEW ICONS
// import { MdLocationCity } from "react-icons/md";
// import { TbMapPinCode } from "react-icons/tb";
// import { FaAddressCard } from "react-icons/fa";
// import { RiLockPasswordLine } from "react-icons/ri"; // Added password icon

// const { Option } = Select;

// const AddUser= ({
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
//   const [loading, setLoading] = useState(false);
//   const [editData, setEditData] = useState({});
//   const [addressObject, setAddressObject] = useState({});
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [country, setCountry] = useState("");
//   const [pincode, setPincode] = useState("");
//   const [constituencies, setConstituencies] = useState([]);

//   useEffect(() => {
//     const fetchConstituencies = async () => {
//       try {
//         const response = await fetchData(
//           "/api/user/list-of-constituencies-dropdown"
//         );
//         setConstituencies(response.data || []);
//       } catch (error) {
//         console.error("Error fetching constituencies:", error);
//       }
//     };
//     fetchConstituencies();
//   }, []);

//   const onFinish = async (values) => {
//     const payload = {
//       name: values?.name?.trim() || "",
//       password: values?.password?.trim() || "", // Added password to payload
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
//       message.error(error?.message || "Failed to submit data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSinglePatient = async () => {
//     if (!editId) return;
//     const payload = { patientId: editId };
//     try {
//       setLoading(true);
//       const response = await postData("/api/admin/get-single-patient", payload);
//       if (response?.responseCode === 200) {
//         setEditData(response?.data);
//         form.setFieldsValue({
//           patientName: response?.data?.name,
//           gender: response?.data?.gender,
//           phoneNumber: response?.data?.phone || "",
//           dateOfBirth: response?.data?.dateOfBirth,
//           aadharNumber: response?.data?.aadhaarNumber || "",
//           pincode: response?.data?.pincode || "",
//           state: response?.data?.state || "",
//           country: response?.data?.country || "",
//           address: response?.data?.address || "",
//           city: response?.data?.city || "",
//           constituency: response?.data?.constituency || "",
//         });
//         setAddress(response?.data?.address || "");
//         setCity(response?.data?.city || "");
//         setState(response?.data?.state || "");
//         setCountry(response?.data?.country || "");
//         setPincode(response?.data?.pincode || "");
//         if (
//           Array.isArray(response?.data?.location?.coordinates) &&
//           response?.data?.location?.coordinates.length > 0
//         ) {
//           setLatitude(response?.data?.location?.coordinates[0]);
//           setLongitude(response?.data?.location?.coordinates[1]);
//         }
//       } else {
//         message.error(response?.message || "Something went wrong");
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to fetch patient");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (editId) fetchSinglePatient();
//     else {
//       form.resetFields();
//       setEditData({});
//       setAddress("");
//       setCity("");
//       setState("");
//       setCountry("");
//       setPincode("");
//     }
//   }, [editId, patientDrawer]);

//   useEffect(() => {
//     if (Object.keys(addressObject || {}).length > 0 && address) {
//       form.setFieldsValue({
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

//   const inputStyle = { height: 42, fontSize: "14px", color: "#333" };
//   const gapClass = "mb-4";

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
            
//             {/* ===== Row 1 ===== */}
//             <Row gutter={16} className={gapClass}>
//               <Col span={12}>
//                 <Form.Item
//                   name="name"
//                   initialValue={editData?.name || ""}
//                   rules={[
//                     { required: true, message: "Please enter User Name" },
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
//                         <div>Username *</div>
//                       </div>
//                     }
//                     variant="outlined"
//                     fullWidth
//                     size="small"
//                     placeholder="Enter User Name"
//                     InputProps={{ style: inputStyle }}
//                   />
//                 </Form.Item>
//               </Col>

//               {/* ===== Added Password Field ===== */}
//               <Col span={12}>
//                 <Form.Item
//                   name="password"
//                   rules={[
//                     { required: true, message: "Please enter password" },
//                     { min: 6, message: "Password must be at least 6 characters" },
//                   ]}
//                 >
//                   <TextField
//                     type="password"
//                     variant="outlined"
//                     fullWidth
//                     label={
//                       <div className="flex items-center">
//                         <RiLockPasswordLine style={{ marginRight: 8, fontSize: 20 }} />
//                         <div>Password *</div>
//                       </div>
//                     }
//                     size="small"
//                     placeholder="Enter Password"
//                     InputProps={{ style: inputStyle }}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>

//             {/* ===== Row 2 ===== */}
//             <Row gutter={16} className={gapClass}>
//               <Col span={12}>
//                 <Form.Item
//                   name="phoneNumber"
//                   initialValue={editData?.phone || ""}
//                   rules={[
//                     { required: true, message: "Please enter phone number" },
//                     { pattern: /^\d+$/, message: "Phone must contain only digits" },
//                     { len: 10, message: "Phone number must be 10 digits" },
//                   ]}
//                 >
//                   <TextField
//                     variant="outlined"
//                     fullWidth
//                     label={
//                       <div className="flex items-center">
//                         <PhoneOutlined style={{ marginRight: 8, fontSize: 20 }} />
//                         <div>Phone Number *</div>
//                       </div>
//                     }
//                     size="small"
//                     placeholder="Enter Phone Number"
//                     InputProps={{ style: inputStyle, classes: { input: "no-arrows" } }}
//                     disabled={editId}
//                     inputProps={{ maxLength: 10 }}
//                   />
//                 </Form.Item>
//               </Col>

//               <Col span={12}>
//                 <Form.Item
//                   name="email"
//                   initialValue={editData?.email || ""}
//                   rules={[
//                     { required: true, message: "Please enter email" },
//                     { type: "email", message: "Please enter valid email" },
//                   ]}
//                 >
//                   <TextField
//                     variant="outlined"
//                     fullWidth
//                     label={
//                       <div className="flex items-center">
//                         <MailOutlined style={{ marginRight: 8, fontSize: 20 }} />
//                         <div>Email *</div>
//                       </div>
//                     }
//                     size="small"
//                     placeholder="Enter Email"
//                     InputProps={{ style: inputStyle }}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>

//             {/* ===== Row 3 ===== */}
//             <Row gutter={16} className={gapClass}>
//               <Col span={12}>
//                 <Form.Item
//                   name="aadharNumber"
//                   initialValue={editData?.aadharNumber || ""}
//                   rules={[
//                     { pattern: /^\d+$/, message: "Aadhar must be digits" },
//                     { len: 12, message: "Aadhar must be 12 digits" },
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
//                     placeholder="Enter Aadhar Number"
//                     InputProps={{ style: inputStyle, classes: { input: "no-arrows" } }}
//                     inputProps={{ maxLength: 12 }}
//                   />
//                 </Form.Item>
//               </Col>

//               <Col span={12}>
//                 <Form.Item
//                   name="gender"
//                   initialValue={editData?.gender || ""}
//                   rules={[{ required: true, message: "Please select gender" }]}
//                 >
//                   <TextField
//                     select
//                     fullWidth
//                     size="small"
//                     label={
//                       <div className="flex items-center">
//                         <FaTransgender style={{ marginRight: 8, fontSize: 20 }} />
//                         <div>Gender *</div>
//                       </div>
//                     }
//                     placeholder="Select Gender"
//                     InputProps={{ style: inputStyle }}
//                   >
//                     <MenuItem value="male">Male</MenuItem>
//                     <MenuItem value="female">Female</MenuItem>
//                     <MenuItem value="other">Others</MenuItem>
//                   </TextField>
//                 </Form.Item>
//               </Col>
//             </Row>

//             {/* ===== Row 4 ===== */}
//             <Row gutter={16} className={gapClass}>
//               <Col span={12}>
//                 <Form.Item name="dateOfBirth" initialValue={editData?.dateOfBirth}>
//                   <TextField
//                     type="date"
//                     onClick={(e) => e.target.showPicker()}
//                     fullWidth
//                     label={
//                       <div className="flex items-center">
//                         <CalendarOutlined style={{ marginRight: 8, fontSize: 20 }} />
//                         <div>Date of Birth</div>
//                       </div>
//                     }
//                     size="small"
//                     variant="outlined"
//                     InputLabelProps={{ shrink: true }}
//                     onKeyDown={(e) => e.preventDefault()}
//                     InputProps={{ style: inputStyle }}
//                   />
//                 </Form.Item>
//               </Col>

//               {/* ✅ Updated Constituency Input - Now inside TextField */}
//               <Col span={12}>
//                 <Form.Item
//                   name="constituency"
//                   rules={[{ required: true, message: "Please select constituency" }]}
//                 >
//                   <TextField
//                     select
//                     fullWidth
//                     size="small"
//                     label={
//                       <div className="flex items-center">
//                         <MdLocationCity style={{ marginRight: 8, fontSize: 20 }} />
//                         <div>Select Constituency *</div>
//                       </div>
//                     }
//                     placeholder="Select Constituency"
//                     InputProps={{ style: inputStyle }}
//                   >
//                     {constituencies.map((c) => (
//                       <MenuItem key={c._id} value={c._id}>
//                         {c.name}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Form.Item>
//               </Col>
//             </Row>

//             {/* ===== Row 5 ===== */}
//             <Row gutter={16} className={gapClass}>
//               <Col span={12}>
//                 <Form.Item name="address">
//                   <LocationSearchMui
//                     value={address}
//                     placeholder="Enter Address"
//                     onChange={setAddress}
//                     setLatitude={setLatitude}
//                     setLongitude={setLongitude}
//                     setArea={setArea}
//                     setAddressObject={setAddressObject}
//                     inputStyle={inputStyle}
//                     icon={<FaAddressCard style={{ marginRight: 8, fontSize: 20 }} />}
//                   />
//                 </Form.Item>
//               </Col>

//               <Col span={12}>
//                 <Form.Item name="city" initialValue={editData?.city || ""}>
//                   <TextField
//                     label={
//                       <div className="flex items-center">
//                         <EnvironmentOutlined style={{ marginRight: 8, fontSize: 20 }} />
//                         <div>City</div>
//                       </div>
//                     }
//                     variant="outlined"
//                     fullWidth
//                     size="small"
//                     value={city}
//                     onChange={(e) => setCity(e.target.value)}
//                     InputLabelProps={{ shrink: city }}
//                     InputProps={{ style: inputStyle }}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>

//             {/* ===== Row 6 ===== */}
//             <Row gutter={16} className={gapClass}>
//               <Col span={12}>
//                 <Form.Item name="state" initialValue={editData?.state || ""}>
//                   <TextField
//                     label={
//                       <div className="flex items-center">
//                         <EnvironmentOutlined style={{ marginRight: 8, fontSize: 20 }} />
//                         <div>State</div>
//                       </div>
//                     }
//                     variant="outlined"
//                     fullWidth
//                     size="small"
//                     value={state}
//                     onChange={(e) => setState(e.target.value)}
//                     InputLabelProps={{ shrink: state }}
//                     InputProps={{ style: inputStyle }}
//                   />
//                 </Form.Item>
//               </Col>

//               <Col span={12}>
//                 <Form.Item name="country" initialValue={editData?.country || ""}>
//                   <TextField
//                     label={
//                       <div className="flex items-center">
//                         <EnvironmentOutlined style={{ marginRight: 8, fontSize: 20 }} />
//                         <div>Country</div>
//                       </div>
//                     }
//                     variant="outlined"
//                     fullWidth
//                     size="small"
//                     value={country}
//                     onChange={(e) => setCountry(e.target.value)}
//                     InputLabelProps={{ shrink: country }}
//                     InputProps={{ style: inputStyle }}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>

//             {/* ===== Row 7 ===== */}
//             <Row gutter={16} className={gapClass}>
//               <Col span={12}>
//                 <Form.Item name="pincode" initialValue={editData?.pincode || ""}>
//                   <TextField
//                     label={
//                       <div className="flex items-center">
//                         <TbMapPinCode style={{ marginRight: 8, fontSize: 20 }} />
//                         <div>Pincode</div>
//                       </div>
//                     }
//                     variant="outlined"
//                     fullWidth
//                     size="small"
//                     type="number"
//                     value={pincode}
//                     onChange={(e) => setPincode(e.target.value)}
//                     InputLabelProps={{ shrink: pincode }}
//                     InputProps={{
//                       classes: { input: "no-arrows" },
//                       min: 0,
//                       onWheel: (e) => e.target.blur(),
//                       style: inputStyle,
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