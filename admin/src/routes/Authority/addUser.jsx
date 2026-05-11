// import {
//   CloseOutlined,
//   PhoneOutlined,
//   EnvironmentOutlined,
//   PlusOutlined,
//   DeleteOutlined,
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
//   Input,
//   Space,
// } from "antd";
// import LocationSearchMui from "../../utils/location";
// import { useEffect, useState } from "react";
// import { fetchData, postData } from "../../api/apiService";
// import { FaUser, FaBriefcase } from "react-icons/fa6";
// import { MailOutlined } from "@mui/icons-material";
// import { MdLocationCity, MdDescription } from "react-icons/md";
// import { FaAddressCard } from "react-icons/fa";

// const AddUser = ({
//   patientDrawer,
//   setPatientDrawer,
//   fetchPatientsList,
//   editId = null,
//   editRecord = null,
//   setEditId,
//   setEditRecord,
// }) => {
//   const [form] = Form.useForm();
//   const [address, setAddress] = useState("");
//   const [latitude, setLatitude] = useState(null);
//   const [longitude, setLongitude] = useState(null);
//   const [area, setArea] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [editData, setEditData] = useState({});
//   const [addressObject, setAddressObject] = useState({});
//   const [departments, setDepartments] = useState([]);
//   const [selectedDepartment, setSelectedDepartment] = useState(null);
//   const [constituencyId, setConstituencyId] = useState(null);

//   // Fetch departments
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const response = await postData("/api/admin/list-of-departments", {
//           page: 1,
//           pageSize: 1000,
//         });
//         if (response?.responseCode === 200) {
//           setDepartments(response?.data?.departments || []);
//         }
//       } catch (error) {
//         console.error("Error fetching departments:", error);
//         message.error("Failed to fetch departments");
//       }
//     };
//     fetchDepartments();
//   }, []);

//   // When department is selected, get constituency from department
//   const handleDepartmentChange = (departmentId) => {
//     const department = departments.find((dept) => dept._id === departmentId);
//     if (department) {
//       setSelectedDepartment(department);
//       // Get constituency from department
//       if (department.constituency?._id) {
//         setConstituencyId(department.constituency._id);
//       } else {
//         setConstituencyId(null);
//         message.warning("Selected department does not have a constituency");
//       }
//     } else {
//       setSelectedDepartment(null);
//       setConstituencyId(null);
//     }
//   };

//   const onFinish = async (values) => {
//     if (!selectedDepartment) {
//       message.error("Please select a department");
//       return;
//     }

//     if (!constituencyId) {
//       message.error("Selected department does not have a constituency");
//       return;
//     }

//     // Prepare email array - support comma-separated emails
//     let emailArray = [];
//     if (values.email) {
//       if (Array.isArray(values.email)) {
//         emailArray = values.email;
//       } else {
//         // Split by comma and trim each email
//         emailArray = values.email
//           .split(",")
//           .map((email) => email.trim())
//           .filter((email) => email.length > 0);
//       }
//     }

//     // Prepare authority levels if provided
//     const authorityLevels =
//       values.authorityLevels?.map((level, index) => ({
//         level: level.level,
//         email: level.email,
//         index: index + 1,
//       })) || [];

//     const payload = {
//       name: values?.name?.trim() || "",
//       designation: values?.designation?.trim() || "",
//       description: values?.description?.trim() || "",
//       email: emailArray,
//       phone: values?.phone?.trim() || "",
//       departmentId: selectedDepartment._id,
//       constituencyId: constituencyId,
//       address: address || "",
//       ...(authorityLevels.length > 0 && { authorityLevels }),
//     };

//     try {
//       setLoading(true);
//       const response = await postData(
//         "/api/admin/create-update-authority",
//         payload
//       );
//       if (response?.responseCode === 200) {
//         message.success(response?.message || "Authority saved successfully");
//         setPatientDrawer(false);
//         form.resetFields();
//         setSelectedDepartment(null);
//         setConstituencyId(null);
//         setAddress("");
//         setEditId(null);
//         if (setEditRecord) setEditRecord(null);
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

//   const fetchSingleAuthority = async () => {
//     if (!editId || !editRecord) return;

//     try {
//       setLoading(true);
//       setEditData(editRecord);

//       // Populate form fields
//       const emailValue = Array.isArray(editRecord.email)
//         ? editRecord.email.join(", ")
//         : editRecord.email || "";

//       // Set department and constituency first
//       if (editRecord?.department) {
//         const departmentId = editRecord.department._id;
//         const department = departments.find(
//           (dept) => dept._id === departmentId
//         );
//         if (department) {
//           // Use handleDepartmentChange to ensure constituency is set correctly
//           handleDepartmentChange(departmentId);
//         } else {
//           // If department not found in list, use the one from record
//           setSelectedDepartment(editRecord.department);
//           if (editRecord.constituency?._id) {
//             setConstituencyId(editRecord.constituency._id);
//           }
//         }
//       }

//       // Populate form fields after department is set
//       form.setFieldsValue({
//         name: editRecord?.name || "",
//         designation: editRecord?.designation || "",
//         description: editRecord?.description || "",
//         email: emailValue,
//         phone: editRecord?.phone || "",
//         departmentId: editRecord?.department?._id || "",
//       });

//       setAddress(editRecord?.address || "");

//       // Set authority levels if they exist
//       if (
//         editRecord?.authority &&
//         Array.isArray(editRecord.authority) &&
//         editRecord.authority.length > 0
//       ) {
//         const authorityLevels = editRecord.authority.map((auth) => ({
//           level: auth.level || "",
//           email: auth.email || "",
//         }));
//         form.setFieldsValue({
//           authorityLevels: authorityLevels,
//         });
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to fetch authority");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (editId && editRecord && patientDrawer) {
//       // Wait for departments to load before populating form
//       if (departments.length > 0) {
//         fetchSingleAuthority();
//       }
//     } else if (!editId) {
//       form.resetFields();
//       setEditData({});
//       setAddress("");
//       setSelectedDepartment(null);
//       setConstituencyId(null);
//       if (setEditRecord) setEditRecord(null);
//     }
//   }, [editId, editRecord, patientDrawer, departments]);

//   useEffect(() => {
//     if (Object.keys(addressObject || {}).length > 0 && address) {
//       // Address object is handled by LocationSearchMui
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
//           {editId ? "Update" : "Add"} Authority
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
//             if (setEditRecord) setEditRecord(null);
//             setPatientDrawer(false);
//           }}
//           style={{ fontSize: "16px", cursor: "pointer" }}
//         />
//       }
//       className="custom-drawer preview-drawer"
//       onClose={() => {
//         setEditId(null);
//         if (setEditRecord) setEditRecord(null);
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
//             {/* ===== Row 1: Name and Designation ===== */}
//             <Row gutter={16} className={gapClass}>
//               <Col span={12}>
//                 <Form.Item
//                   name="name"
//                   rules={[
//                     { required: true, message: "Please enter name" },
//                     {
//                       pattern: /^[a-zA-Z\s]*$/,
//                       message: "Only alphabets and spaces are allowed",
//                     },
//                   ]}
//                 >
//                   <TextField
//                     label={
//                       <div className="flex items-center">
//                         <FaUser style={{ marginRight: 8, fontSize: 20 }} />
//                         <div>Name *</div>
//                       </div>
//                     }
//                     variant="outlined"
//                     fullWidth
//                     size="small"
//                     placeholder="Enter Name"
//                     InputProps={{ style: inputStyle }}
//                   />
//                 </Form.Item>
//               </Col>

//               <Col span={12}>
//                 <Form.Item
//                   name="designation"
//                   rules={[
//                     { required: true, message: "Please enter designation" },
//                   ]}
//                 >
//                   <TextField
//                     label={
//                       <div className="flex items-center">
//                         <FaBriefcase style={{ marginRight: 8, fontSize: 20 }} />
//                         <div>Designation *</div>
//                       </div>
//                     }
//                     variant="outlined"
//                     fullWidth
//                     size="small"
//                     placeholder="Enter Designation"
//                     InputProps={{ style: inputStyle }}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>

//             {/* ===== Row 2: Description ===== */}
//             <Row gutter={16} className={gapClass}>
//               <Col span={24}>
//                 <Form.Item name="description">
//                   <TextField
//                     label={
//                       <div className="flex items-center">
//                         <MdDescription
//                           style={{ marginRight: 8, fontSize: 20 }}
//                         />
//                         <div>Description</div>
//                       </div>
//                     }
//                     variant="outlined"
//                     fullWidth
//                     size="small"
//                     placeholder="Enter Description"
//                     multiline
//                     rows={3}
//                     InputProps={{ style: { ...inputStyle, minHeight: 80 } }}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>

//             {/* ===== Row 3: Email and Phone ===== */}
//             <Row gutter={16} className={gapClass}>
//               <Col span={12}>
//                 <Form.Item
//                   name="email"
//                   rules={[
//                     { required: true, message: "Please enter email" },
//                     {
//                       validator: (_, value) => {
//                         if (!value) {
//                           return Promise.resolve();
//                         }
//                         // Check if it's a single email or comma-separated emails
//                         const emails = value.split(",").map((e) => e.trim());
//                         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//                         const allValid = emails.every((email) =>
//                           emailRegex.test(email)
//                         );
//                         if (allValid) {
//                           return Promise.resolve();
//                         }
//                         return Promise.reject(
//                           new Error("Please enter valid email(s)")
//                         );
//                       },
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
//                     placeholder="Enter Email (comma-separated for multiple)"
//                     InputProps={{ style: inputStyle }}
//                   />
//                 </Form.Item>
//               </Col>

//               <Col span={12}>
//                 <Form.Item
//                   name="phone"
//                   rules={[
//                     { required: true, message: "Please enter phone number" },
//                     {
//                       pattern: /^\d+$/,
//                       message: "Phone must contain only digits",
//                     },
//                     { len: 10, message: "Phone number must be 10 digits" },
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
//                     placeholder="Enter Phone Number"
//                     InputProps={{
//                       style: inputStyle,
//                       classes: { input: "no-arrows" },
//                     }}
//                     inputProps={{ maxLength: 10 }}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>

//             {/* ===== Row 4: Department ===== */}
//             <Row gutter={16} className={gapClass}>
//               <Col span={24}>
//                 <Form.Item
//                   name="departmentId"
//                   rules={[
//                     { required: true, message: "Please select department" },
//                   ]}
//                 >
//                   <TextField
//                     select
//                     fullWidth
//                     size="small"
//                     label={
//                       <div className="flex items-center">
//                         <MdLocationCity
//                           style={{ marginRight: 8, fontSize: 20 }}
//                         />
//                         <div>Select Department *</div>
//                       </div>
//                     }
//                     placeholder="Select Department"
//                     InputProps={{ style: inputStyle }}
//                     onChange={(e) => handleDepartmentChange(e.target.value)}
//                   >
//                     {departments.map((dept) => (
//                       <MenuItem key={dept._id} value={dept._id}>
//                         {dept.name}
//                         {dept.constituency?.name
//                           ? ` (${dept.constituency.name})`
//                           : ""}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Form.Item>
//                 {selectedDepartment && constituencyId && (
//                   <div className="text-sm text-gray-600 mt-1">
//                     Constituency: {selectedDepartment.constituency?.name}
//                   </div>
//                 )}
//               </Col>
//             </Row>

//             {/* ===== Row 5: Address ===== */}
//             <Row gutter={16} className={gapClass}>
//               <Col span={24}>
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
//                     icon={
//                       <FaAddressCard style={{ marginRight: 8, fontSize: 20 }} />
//                     }
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>

//             {/* ===== Authority Levels (Optional) ===== */}
//             <Row gutter={16} className={gapClass}>
//               <Col span={24}>
//                 <Form.Item label="Authority Levels (Optional)">
//                   <Form.List name="authorityLevels">
//                     {(fields, { add, remove }) => (
//                       <>
//                         {fields.map(({ key, name, ...restField }) => (
//                           <Space
//                             key={key}
//                             style={{
//                               display: "flex",
//                               marginBottom: 8,
//                               width: "100%",
//                             }}
//                             align="baseline"
//                           >
//                             <Form.Item
//                               {...restField}
//                               name={[name, "level"]}
//                               rules={[
//                                 {
//                                   required: true,
//                                   message: "Please enter level name",
//                                 },
//                               ]}
//                               style={{ flex: 1 }}
//                             >
//                               <Input placeholder="Level Name (e.g., Level 1)" />
//                             </Form.Item>
//                             <Form.Item
//                               {...restField}
//                               name={[name, "email"]}
//                               rules={[
//                                 {
//                                   required: true,
//                                   message: "Please enter email",
//                                 },
//                                 {
//                                   type: "email",
//                                   message: "Please enter valid email",
//                                 },
//                               ]}
//                               style={{ flex: 1 }}
//                             >
//                               <Input placeholder="Email" />
//                             </Form.Item>
//                             <Button
//                               type="text"
//                               danger
//                               icon={<DeleteOutlined />}
//                               onClick={() => remove(name)}
//                             >
//                               Remove
//                             </Button>
//                           </Space>
//                         ))}
//                         <Form.Item>
//                           <Button
//                             type="dashed"
//                             onClick={() => add()}
//                             block
//                             icon={<PlusOutlined />}
//                             style={{
//                               borderColor: "#1890ff",
//                               color: "#1890ff",
//                             }}
//                           >
//                             Add Authority Level
//                           </Button>
//                         </Form.Item>
//                       </>
//                     )}
//                   </Form.List>
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
//                 setSelectedDepartment(null);
//                 setConstituencyId(null);
//                 setAddress("");
//                 setEditId(null);
//                 if (setEditRecord) setEditRecord(null);
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
