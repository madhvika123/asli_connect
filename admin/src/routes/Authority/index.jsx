// import React, { useEffect, useState, useMemo } from "react";
// import moment from "moment";
// import {
//   Button,
//   message,
//   Modal,
//   Spin,
//   Switch,
//   Table,
//   Form,
//   Input,
//   Space,
// } from "antd";
// import { InputAdornment, MenuItem, TextField } from "@mui/material";
// import {
//   PlusOutlined,
//   SearchOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";
// import { fetchData, postData } from "../../api/apiService";
// import { MdEdit } from "react-icons/md";
// import { FaUserDoctor } from "react-icons/fa6";
// // import AddDoctor from "./AddDoctor";
// import { PiGitBranchFill } from "react-icons/pi";
// import AddUser from "./addUser";
// import TruncatedTextWithTooltip from "../../utils/TruncatedTextWithTooltip";

// const Authority = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [total, setTotal] = useState(1);
//   const [searchInput, setSearchInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedFilter, setSelectedFilter] = useState("0");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [users, setUsers] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [editRecord, setEditRecord] = useState(null);
//   const [userModelFlag, setUserModelFlag] = useState(false);
//   const [warningModal, setWarningModal] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [newStatus, setNewStatus] = useState(false);
//   const [modalLoad, setModalLoad] = useState(false);
//   const [authorityLevelModal, setAuthorityLevelModal] = useState(false);
//   const [selectedAuthority, setSelectedAuthority] = useState(null);
//   const [authorityLevelForm] = Form.useForm();
//   const [authorityLevelLoading, setAuthorityLevelLoading] = useState(false);

//   // Debounce search input to reduce API calls
//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       setSearchQuery(searchInput.trim());
//       setCurrentPage(1); // reset to first page on new search
//     }, 300); // 300ms delay

//     return () => clearTimeout(delayDebounceFn);
//   }, [searchInput]);

//   // Client-side filtered and sorted data
//   const filteredAndSortedUsers = useMemo(() => {
//     let filtered = users;

//     // Client-side filtering based on search input - ONLY NAME
//     if (searchInput.trim()) {
//       const searchTerm = searchInput.toLowerCase().trim();

//       filtered = users.filter((user) => {
//         // Search only by name field
//         const nameMatch = user.name?.toLowerCase().includes(searchTerm);

//         return nameMatch;
//       });
//     }

//     // Client-side sorting
//     const sorted = [...filtered].sort((a, b) => {
//       const dateA = new Date(a.createdAt);
//       const dateB = new Date(b.createdAt);

//       if (selectedFilter === "0") {
//         // Newest first - descending order
//         return dateB - dateA;
//       } else {
//         // Oldest first - ascending order
//         return dateA - dateB;
//       }
//     });

//     return sorted;
//   }, [users, searchInput, selectedFilter]);

//   const userChangeStatus = async () => {
//     setModalLoad(true);

//     const payload = {
//       constituencyId: selectedRecord._id,
//     };
//     try {
//       setLoading(true);
//       const response = await postData(
//         "/api/admin/toggle-constituency",
//         payload
//       );
//       if (response?.responseCode == 200) {
//         setWarningModal(false);
//         setSelectedRecord(null);
//       } else if (response?.responseCode == 400) {
//         message.error(response?.message || "Something went wrong");
//       } else {
//         message.error(response?.message || "Something went wrong");
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to fetch doctors List");
//     } finally {
//       setModalLoad(false);
//       fetchUserList();
//     }
//   };

//   const columns = [
//     {
//       title: "S.No",
//       key: "index",
//       align: "center",
//       render: (_, __, index) => index + 1,
//     },
//     {
//       title: "Department",
//       dataIndex: ["department", "name"],
//       key: "department",
//       align: "center",
//       render: (name, record) => record?.department?.name || "N/A",
//     },
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//       align: "center",
//       render: (name) => (
//         <span title={name}>
//           {name?.slice(0, 20)}
//           {name?.length > 20 ? "..." : ""}
//         </span>
//       ),
//     },
//     // {
//     //   title: "Authority ID",
//     //   dataIndex: "authorityId",
//     //   key: "authorityId",
//     //   align: "center",
//     // },
//     {
//       title: "Designation",
//       dataIndex: "designation",
//       key: "designation",
//       align: "center",
//       render: (designation) => (
//         <span title={designation}>
//           {designation?.slice(0, 25)}
//           {designation?.length > 25 ? "..." : ""}
//         </span>
//       ),
//     },
//     {
//       title: "Description",
//       dataIndex: "description",
//       key: "description",
//       align: "center",
//       render: (desc) => {
//         if (!desc) return "N/A";
//         return (
//           <TruncatedTextWithTooltip
//             text={desc}
//             maxLength={30}
//             tooltipMaxWidth={400}
//           />
//         );
//       },
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       key: "email",
//       align: "center",
//       render: (emails) => emails?.join(", ") || "N/A",
//     },
//     {
//       title: "Phone",
//       dataIndex: "phone",
//       key: "phone",
//       align: "center",
//     },

//     {
//       title: "Constituency",
//       dataIndex: ["constituency", "name"],
//       key: "constituency",
//       align: "center",
//     },
//     {
//       title: "Address",
//       dataIndex: "address",
//       key: "address",
//       align: "center",
//       render: (address) => (
//         <span title={address}>
//           {address?.slice(0, 25)}
//           {address?.length > 25 ? "..." : ""}
//         </span>
//       ),
//     },
//     {
//       title: "Created At",
//       dataIndex: "createdAt",
//       key: "createdAt",
//       align: "center",
//       render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "N/A"),
//     },
//     // {
//     //   title: "Status",
//     //   dataIndex: "isActive",
//     //   key: "isActive",
//     //   align: "center",
//     //   render: (isActive, record) => (
//     //     <Switch
//     //       checked={isActive}
//     //       onChange={() => {
//     //         setSelectedRecord(record);
//     //         setWarningModal(true);
//     //       }}
//     //     />
//     //   ),
//     // },
//     {
//       title: "Actions",
//       key: "actions",
//       align: "center",
//       render: (_, record) => (
//         <Space>
//           <Button
//             type="link"
//             icon={<MdEdit />}
//             onClick={() => {
//               setEditId(record._id);
//               setEditRecord(record);
//               setUserModelFlag(true);
//             }}
//           >
//             Edit
//           </Button>
//           <Button
//             type="link"
//             onClick={() => {
//               setSelectedAuthority(record);
//               setAuthorityLevelModal(true);
//             }}
//           >
//             Authority Level
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   const fetchUserList = async () => {
//     const payload = {
//       page: currentPage,
//       pageSize: pageSize,
//       isPartyMember: false,
//       search: searchQuery,
//       sortBy: selectedFilter, /// 1 --- old or 0 -- latest
//     };
//     try {
//       setLoading(true);
//       const response = await postData(
//         "/api/admin/list-of-authorities",
//         payload
//       );
//       if (response?.responseCode == 200) {
//         setUsers(response?.data?.authorities || []);
//         setTotal(response?.data?.totalAuthorities || 1);
//       } else if (response?.responseCode == 400) {
//         message.error(response?.message || "Something went wrong");
//       } else {
//         message.error(response?.message || "Something went wrong");
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to fetch doctors List");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserList();
//   }, [selectedFilter, currentPage, pageSize, searchQuery]);

//   // Initialize form when modal opens
//   useEffect(() => {
//     if (authorityLevelModal && selectedAuthority) {
//       if (
//         selectedAuthority.authority &&
//         selectedAuthority.authority.length > 0
//       ) {
//         // Map authority data to form format (remove _id if present)
//         const authorityLevels = selectedAuthority.authority.map((auth) => ({
//           level: auth.level || "",
//           email: auth.email || "",
//           name: auth.name || auth.authorityName || "",
//         }));
//         authorityLevelForm.setFieldsValue({
//           authorityLevels: authorityLevels,
//         });
//       } else {
//         authorityLevelForm.setFieldsValue({
//           authorityLevels: [],
//         });
//       }
//     }
//   }, [authorityLevelModal, selectedAuthority]);

//   const handleAuthorityLevelSubmit = async (values) => {
//     if (!selectedAuthority) {
//       message.error("No authority selected");
//       return;
//     }

//     setAuthorityLevelLoading(true);
//     try {
//       // Map authorityLevels to only include the fields backend expects (level, email, name)
//       const authorityLevels = (values.authorityLevels || []).map((level) => ({
//         level: level.level,
//         email: level.email,
//         name: level.name,
//       }));

//       const payload = {
//         authorityId: selectedAuthority._id,
//         authorityLevels: authorityLevels,
//       };

//       const response = await postData(
//         "/api/admin/add-update-authority-level",
//         payload
//       );

//       if (response?.responseCode === 200) {
//         message.success(
//           response?.message || "Authority levels updated successfully"
//         );
//         setAuthorityLevelModal(false);
//         setSelectedAuthority(null);
//         authorityLevelForm.resetFields();
//         fetchUserList(); // Refresh the list
//       } else {
//         message.error(response?.message || "Something went wrong");
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to update authority levels");
//     } finally {
//       setAuthorityLevelLoading(false);
//     }
//   };

//   const handleAuthorityLevelModalClose = () => {
//     setAuthorityLevelModal(false);
//     setSelectedAuthority(null);
//     authorityLevelForm.resetFields();
//   };

//   return (
//     <Spin spinning={loading}>
//       <div className="mt-2 flex flex-col gap-2">
//         <div className="flex items-center justify-between client-details-form">
//           <div className="flex items-center justify-start gap-1 w-full">
//             <TextField
//               id="outlined-basic"
//               label="Search"
//               variant="outlined"
//               className="w-full max-w-[400px]"
//               size="small"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               type="search"
//               //placeholder="Search by name..."
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <SearchOutlined className="search-icon" />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </div>
//           <div className="flex items-center justify-end gap-1 w-full">
//             <TextField
//               select
//               fullWidth
//               size="small"
//               label="Sort by Date"
//               placeholder="Select sorting order"
//               className="max-w-[25%]"
//               value={selectedFilter}
//               onChange={(e) => setSelectedFilter(e.target.value)}
//             >
//               <MenuItem value="0">Newest First</MenuItem>
//               <MenuItem value="1">Oldest First</MenuItem>
//             </TextField>

//             <Button
//               type="button"
//               icon={<PlusOutlined />}
//               onClick={() => {
//                 setEditId(null);
//                 setUserModelFlag(true);
//               }}
//               className="bg-primary text-white h-[36px]"
//             >
//               Add New
//             </Button>
//           </div>
//         </div>
//         <div className="max-h-[80dvh] overflow-y-auto pr-1">
//           <Table
//             columns={columns}
//             dataSource={filteredAndSortedUsers}
//             locale={{
//               emptyText: (
//                 <div style={{ color: "black" }}>
//                   {searchInput
//                     ? "No Authority Found"
//                     : "No Authorities available"}
//                 </div>
//               ),
//             }}
//             pagination={{
//               current: currentPage,
//               pageSize: pageSize,
//               total: searchInput ? filteredAndSortedUsers.length : total,
//               showSizeChanger: true,
//               onChange: (page, pageSize) => {
//                 setCurrentPage(page);
//                 setPageSize(pageSize);
//               },
//             }}
//             rowKey={(record) => record._id}
//             scroll={{ x: "max-content" }}
//           />
//         </div>
//         <AddUser
//           patientDrawer={userModelFlag}
//           setPatientDrawer={setUserModelFlag}
//           fetchPatientsList={fetchUserList}
//           editId={editId}
//           editRecord={editRecord}
//           setEditId={setEditId}
//           setEditRecord={setEditRecord}
//         />
//       </div>

//       <Modal visible={warningModal} footer={null} centered closeIcon={false}>
//         <Spin spinning={modalLoad}>
//           <div className="dashboard m-2">
//             <h4 className="text-xl font-semibold text-center py-2">
//               Are you sure you want to{" "}
//               {selectedRecord?.isActive ? "Deactivate" : "Activate"} <br /> this
//               user status
//             </h4>
//             <footer className="flex justify-center items-center pt-2 space-x-4">
//               <Button
//                 type="default"
//                 onClick={() => {
//                   setSelectedRecord(null);
//                   setWarningModal(false);
//                 }}
//                 className="min-w-[100px]"
//               >
//                 No
//               </Button>
//               <Button
//                 type="primary"
//                 className="min-w-[100px]"
//                 onClick={() => userChangeStatus()}
//               >
//                 Yes
//               </Button>
//             </footer>
//           </div>
//         </Spin>
//       </Modal>

//       {/* Authority Level Modal */}
//       <Modal
//         title="Manage Authority Levels"
//         open={authorityLevelModal}
//         onCancel={handleAuthorityLevelModalClose}
//         footer={null}
//         width={700}
//         centered
//       >
//         <Spin spinning={authorityLevelLoading}>
//           <div className="py-2">
//             {selectedAuthority && (
//               <div className="mb-4 p-3 bg-gray-50 rounded">
//                 <p className="text-sm text-gray-600">
//                   <strong>Authority:</strong> {selectedAuthority.name}
//                 </p>
//               </div>
//             )}
//             <Form
//               form={authorityLevelForm}
//               layout="vertical"
//               onFinish={handleAuthorityLevelSubmit}
//               initialValues={{
//                 authorityLevels: [],
//               }}
//             >
//               <Form.List name="authorityLevels">
//                 {(fields, { add, remove }) => (
//                   <>
//                     {fields.map(({ key, name, ...restField }) => (
//                       <Space
//                         key={key}
//                         style={{
//                           display: "flex",
//                           marginBottom: 8,
//                           width: "100%",
//                         }}
//                         align="baseline"
//                       >
//                         <Form.Item
//                           {...restField}
//                           name={[name, "level"]}
//                           label="Level"
//                           rules={[
//                             {
//                               required: true,
//                               message: "Please enter level name",
//                             },
//                           ]}
//                           style={{ flex: 1 }}
//                         >
//                           <Input placeholder="e.g., Level 1" />
//                         </Form.Item>
//                         <Form.Item
//                           {...restField}
//                           name={[name, "email"]}
//                           label="Email"
//                           rules={[
//                             {
//                               required: true,
//                               message: "Please enter email",
//                             },
//                             {
//                               type: "email",
//                               message: "Please enter a valid email",
//                             },
//                           ]}
//                           style={{ flex: 1 }}
//                         >
//                           <Input placeholder="email@example.com" />
//                         </Form.Item>
//                         <Form.Item
//                           {...restField}
//                           name={[name, "name"]}
//                           label="Authority Name"
//                           rules={[
//                             {
//                               required: true,
//                               message: "Please enter authority name",
//                             },
//                             {
//                               pattern: /^[a-zA-Z0-9 ]*$/,
//                               message: "Only alphabets and numbers are allowed",
//                             },
//                           ]}
//                         >
//                           <Input placeholder="Authority Name" />
//                         </Form.Item>
//                         <Button
//                           type="text"
//                           danger
//                           icon={<DeleteOutlined />}
//                           onClick={() => remove(name)}
//                           style={{ marginTop: 30 }}
//                         >
//                           Remove
//                         </Button>
//                       </Space>
//                     ))}
//                     <Form.Item>
//                       <Button
//                         type="dashed"
//                         onClick={() => add()}
//                         block
//                         icon={<PlusOutlined />}
//                         style={{
//                           borderColor: "#1890ff",
//                           color: "#1890ff",
//                           marginTop: 8,
//                         }}
//                       >
//                         Add Authority Level
//                       </Button>
//                     </Form.Item>
//                   </>
//                 )}
//               </Form.List>
//               <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
//                 <Space style={{ width: "100%", justifyContent: "flex-end" }}>
//                   <Button onClick={handleAuthorityLevelModalClose}>
//                     Cancel
//                   </Button>
//                   <Button
//                     type="primary"
//                     htmlType="submit"
//                     loading={authorityLevelLoading}
//                   >
//                     Update
//                   </Button>
//                 </Space>
//               </Form.Item>
//             </Form>
//           </div>
//         </Spin>
//       </Modal>
//     </Spin>
//   );
// };

// export default Authority;
