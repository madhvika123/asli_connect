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
//   Spin,
// } from "antd";
// import { IoPersonCircle } from "react-icons/io5";
// import LocationSearchMui from "../../utils/location";
// import { useEffect, useState } from "react";
// import { handleUpload } from "../../utils/FileUpload";
// import { useDropzone } from "react-dropzone";
// import { fetchData, postData } from "../../api/apiService";
// import {
//   FaUser,
//   FaIdCard,
//   FaMapPin,
//   FaUsers,
//   FaUserTie,
//   FaGlobe,
//   FaCity,
//   FaLocationDot,
//   FaBuilding,
// } from "react-icons/fa6";

// const AddUser = ({
//   patientDrawer,
//   setPatientDrawer,
//   fetchPatientsList,
//   editId = null,
//   setEditId,
// }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [editData, setEditData] = useState({});
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [state, setState] = useState("");
//   const [district, setDistrict] = useState("");

//   const fetchStates = async () => {
//     try {
//       const response = await fetchData("/api/admin/fetch-states");
//       if (response?.responseCode === 200) {
//         setStates(response?.data || []);
//       } else {
//         message.error(response?.message || "Failed to fetch states");
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to fetch states");
//     }
//   };

//   const fetchDistricts = async (stateId) => {
//     try {
//       const payload = { stateParam: stateId };
//       const response = await postData("/api/admin/fetch-districts", payload);
//       if (response?.responseCode === 200) {
//         setDistricts(response?.data || []);
//       } else {
//         message.error(response?.message || "Failed to fetch districts");
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to fetch districts");
//     }
//   };

//   useEffect(() => {
//     fetchStates();
//   }, []);

//   useEffect(() => {
//     if (state) fetchDistricts(state);
//   }, [state]);

//   const onFinish = async (values) => {
//     const payload = {
//       name: values?.name?.trim() || "",
//       state: values?.state,
//       area: values?.area,
//       constituencyId: values?.constituencyId,
//       mlaName: values?.mlaName,
//       district: values?.district,
//       citizenCount: values?.citizenCount,
//     };

//     try {
//       setLoading(true);
//       const response = await postData(
//         "/api/admin/create-or-update-constituency",
//         payload
//       );
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

//   useEffect(() => {
//     if (editId !== null) {
//       fetchPatientsList();
//     } else {
//       form.resetFields();
//     }
//   }, [editId, patientDrawer]);

//   return (
//     <Drawer
//       visible={patientDrawer}
//       closable={true}
//       title={
//         <h3 className="text-xl text-center text-black">
//           {editId ? "Update" : "Add"} Constituency
//         </h3>
//       }
//       footer={null}
//       maskClosable={true}
//       placement="right"
//       width={600}
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
            
//             {/* Row 1: Constituency Name & Constituency ID */}
//             <Row gutter={16} className="mb-4">
//               <Col span={12}>
//                 <Form.Item
//                   name="name"
//                   initialValue={editData?.name || ""}
//                   rules={[
//                     { required: true, message: "Please enter Constituency Name" },
//                     { pattern: /^[a-zA-Z0-9 ]*$/, message: "Only alphabets and numbers are allowed" },
//                   ]}
//                 >
//                   <TextField
//                     label={
//                       <div className="flex items-center">
//                         <FaUser style={{ marginRight: 8, fontSize: 16 }} />
//                         <div>Constituency Name *</div>
//                       </div>
//                     }
//                     variant="outlined"
//                     fullWidth
//                     size="small"
//                     placeholder="Enter Constituency Name"
//                     InputProps={{ style: { height: 40 } }}
//                   />
//                 </Form.Item>
//               </Col>

//               <Col span={12}>
//                 <Form.Item
//                   name="constituencyId"
//                   initialValue={editData?.constituencyId || ""}
//                   rules={[
//                     { required: true, message: "Please enter Constituency Id" },
//                     { pattern: /^[a-zA-Z0-9 ]*$/, message: "Only alphabets and numbers are allowed" },
//                   ]}
//                 >
//                   <TextField
//                     label={
//                       <div className="flex items-center">
//                         <FaIdCard style={{ marginRight: 8, fontSize: 16 }} />
//                         <div>Constituency Id *</div>
//                       </div>
//                     }
//                     variant="outlined"
//                     fullWidth
//                     size="small"
//                     placeholder="Enter Constituency Id"
//                     InputProps={{ style: { height: 40 } }}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>

//             {/* Row 2: Area & Citizen Count */}
//             <Row gutter={16} className="mb-4">
//               <Col span={12}>
//                 <Form.Item
//                   name="area"
//                   initialValue={editData?.area || ""}
//                   rules={[
//                     { required: true, message: "Please enter Area" },
//                     { pattern: /^[a-zA-Z0-9 ]*$/, message: "Only alphabets and numbers are allowed" },
//                   ]}
//                 >
//                   <TextField
//                     label={
//                       <div className="flex items-center">
//                         <FaLocationDot style={{ marginRight: 8, fontSize: 16 }} />
//                         <div>Area *</div>
//                       </div>
//                     }
//                     variant="outlined"
//                     fullWidth
//                     size="small"
//                     placeholder="Enter Area"
//                     InputProps={{ style: { height: 40 } }}
//                   />
//                 </Form.Item>
//               </Col>

//               <Col span={12}>
//                 <Form.Item
//                   name="citizenCount"
//                   initialValue={editData?.citizenCount || ""}
//                   rules={[
//                     { required: true, message: "Please enter Citizen Count" },
//                     { pattern: /^[0-9]*$/, message: "Only numbers are allowed" },
//                   ]}
//                 >
//                   <TextField
//                     label={
//                       <div className="flex items-center">
//                         <FaUsers style={{ marginRight: 8, fontSize: 16 }} />
//                         <div>Citizen Count *</div>
//                       </div>
//                     }
//                     variant="outlined"
//                     fullWidth
//                     size="small"
//                     placeholder="Enter Citizen Count"
//                     InputProps={{ style: { height: 40 } }}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>

//             {/* Row 3: State & District */}
//             <Row gutter={16} className="mb-4">
//               <Col span={12}>
//                 <Form.Item
//                   name="state"
//                   rules={[{ required: true, message: "Please select a state" }]}
//                 >
//                   <TextField
//                     select
//                     label={
//                       <div className="flex items-center">
//                         <FaGlobe style={{ marginRight: 8, fontSize: 16 }} />
//                         <div>Select State *</div>
//                       </div>
//                     }
//                     fullWidth
//                     size="small"
//                     value={state || ""}
//                     onChange={(e) => {
//                       setState(e.target.value);
//                       setDistricts([]);
//                       form.setFieldValue('district', ''); // Clear district when state changes
//                     }}
//                     InputProps={{ style: { height: 40 } }}
//                   >
//                     {states.map((s) => (
//                       <MenuItem key={s._id} value={s._id}>
//                         {s.name}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Form.Item>
//               </Col>

//               <Col span={12}>
//                 <Form.Item
//                   name="district"
//                   rules={[{ required: true, message: "Please select a district" }]}
//                 >
//                   <TextField
//                     select
//                     label={
//                       <div className="flex items-center">
//                         <FaBuilding style={{ marginRight: 8, fontSize: 16 }} />
//                         <div>Select District *</div>
//                       </div>
//                     }
//                     fullWidth
//                     size="small"
//                     value={district || ""}
//                     onChange={(e) => setDistrict(e.target.value)}
//                     InputProps={{ style: { height: 40 } }}
//                     disabled={!state}
//                   >
//                     {districts.map((d) => (
//                       <MenuItem key={d._id} value={d._id}>
//                         {d.name}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Form.Item>
//               </Col>
//             </Row>

//             {/* MLA Name - Full Width */}
//             <div className="mb-4">
//               <Form.Item
//                 name="mlaName"
//                 initialValue={editData?.mlaName || ""}
//                 rules={[
//                   { pattern: /^[a-zA-Z ]*$/, message: "Only alphabets are allowed" },
//                 ]}
//               >
//                 <TextField
//                   label={
//                     <div className="flex items-center">
//                       <FaUserTie style={{ marginRight: 8, fontSize: 16 }} />
//                       <div>MLA Name</div>
//                     </div>
//                   }
//                   variant="outlined"
//                   fullWidth
//                   size="small"
//                   placeholder="Enter MLA Name"
//                   InputProps={{ style: { height: 40 } }}
//                 />
//               </Form.Item>
//             </div>

//           </div>
//           <footer className="flex justify-end items-center py-2 space-x-4 mt-4">
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