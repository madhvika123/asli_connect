// import React, { useEffect, useState, useMemo } from "react";
// import moment from "moment";
// import { Button, message, Modal, Spin, Switch, Table } from "antd";
// import { InputAdornment, MenuItem, TextField } from "@mui/material";
// import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
// import { fetchData, postData } from "../../api/apiService";
// import { MdEdit } from "react-icons/md";
// import { FaUserDoctor } from "react-icons/fa6";
// // import AddDoctor from "./AddDoctor";
// import { PiGitBranchFill } from "react-icons/pi";
// import AddUser from "./addUser";
// import TruncatedTextWithTooltip from "../../utils/TruncatedTextWithTooltip";

// const Department = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [total, setTotal] = useState(1);
//   const [searchInput, setSearchInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedFilter, setSelectedFilter] = useState("1");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [users, setUsers] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [userModelFlag, setUserModelFlag] = useState(false);
//   const [warningModal, setWarningModal] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [newStatus, setNewStatus] = useState(false);
//   const [modalLoad, setModalLoad] = useState(false);

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

//     // Client-side filtering based on search input
//     if (searchInput.trim()) {
//       const searchTerm = searchInput.toLowerCase().trim();
//       filtered = users.filter(
//         (user) =>
//           user.name?.toLowerCase().includes(searchTerm) ||
//           user.email?.toLowerCase().includes(searchTerm) ||
//           user.phone?.toLowerCase().includes(searchTerm) ||
//           user.description?.toLowerCase().includes(searchTerm) ||
//           user.address?.toLowerCase().includes(searchTerm) ||
//           user.website?.toLowerCase().includes(searchTerm) ||
//           user.constituency?.name?.toLowerCase().includes(searchTerm)
//       );
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
//     console.log(selectedRecord);
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
//       align: "center",
//       key: "index",
//       render: (_, __, index) => index + 1,
//     },
//     {
//       title: "Department Name",
//       dataIndex: "name",
//       key: "name",
//       align: "center",
//       render: (name) => {
//         if (!name) return "N/A";
//         return (
//           <TruncatedTextWithTooltip
//             text={name}
//             maxLength={20}
//             tooltipMaxWidth={400}
//           />
//         );
//       },
//     },
//     // {
//     //   title: "Department ID",
//     //   dataIndex: "departmentId",
//     //   key: "departmentId",
//     //   align: "center",
//     //   render: (id) => id || "N/A",
//     // },
//     {
//       title: "Description",
//       dataIndex: "description",
//       key: "description",
//       align: "center",
//       render: (desc) => {
//         const short = desc ? desc.slice(0, 30) : "N/A";
//         return (
//           <span title={desc || "N/A"}>
//             {short}
//             {desc && desc.length > 30 ? "..." : ""}
//           </span>
//         );
//       },
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       key: "email",
//       align: "center",
//       render: (email) => email || "N/A",
//     },
//     {
//       title: "Phone",
//       dataIndex: "phone",
//       key: "phone",
//       align: "center",
//       render: (phone) => phone || "N/A",
//     },
//     {
//       title: "Website",
//       dataIndex: "website",
//       key: "website",
//       align: "center",
//       render: (url) =>
//         url ? (
//           <a href={url} target="_blank" rel="noopener noreferrer">
//             {url}
//           </a>
//         ) : (
//           "N/A"
//         ),
//     },
//     {
//       title: "Constituency",
//       dataIndex: ["constituency", "name"],
//       key: "constituency",
//       align: "center",
//       render: (c) => c || "N/A",
//     },
//     {
//       title: "Address",
//       dataIndex: "address",
//       key: "address",
//       align: "center",
//       render: (address) => {
//         const short = address ? address.slice(0, 25) : "N/A";
//         return (
//           <span title={address || "N/A"}>
//             {short}
//             {address && address.length > 25 ? "..." : ""}
//           </span>
//         );
//       },
//     },
//     {
//       title: "Created At",
//       dataIndex: "createdAt",
//       key: "createdAt",
//       align: "center",
//       render: (createdAt) =>
//         createdAt ? moment(createdAt).format("DD/MM/YYYY") : "N/A",
//     },
//     {
//       title: "Status",
//       dataIndex: "isActive",
//       key: "isActive",
//       align: "center",
//       render: (isActive, record) => (
//         <Switch
//           checked={isActive}
//           onChange={(checked) => {
//             setSelectedRecord(record);
//             setWarningModal(true);
//           }}
//         />
//       ),
//     },
//   ];

//   const fetchUserList = async () => {
//     const payload = {
//       page: currentPage,
//       pageSize: pageSize,
//       isPartyMember: false,
//       search: searchQuery,
//       sort: selectedFilter, /// 1 --- old or 0 -- latest
//     };
//     try {
//       setLoading(true);
//       const response = await postData(
//         "/api/admin/list-of-departments",
//         payload
//       );
//       if (response?.responseCode == 200) {
//         setUsers(response?.data?.departments || []);
//         setTotal(response?.data?.totalDepartments || 1);
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

//   console.log("users", users);

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
//               placeholder="Search by name, email, phone, etc..."
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
//               label="Sort by Alphabet"
//               placeholder="Select sorting order"
//               className="max-w-[25%]"
//               value={selectedFilter}
//               onChange={(e) => setSelectedFilter(e.target.value)}
//             >
//               <MenuItem value="1">Ascending</MenuItem>
//               <MenuItem value="0">Descending</MenuItem>
//             </TextField>

//             {/*<Button
//               type="button"
//               icon={<PlusOutlined />}
//               onClick={() => {
//                 setEditId(null);
//                 setUserModelFlag(true);
//               }}
//               className="bg-primary text-white h-[36px]"
//             >
//               Add New
//             </Button>*/}
//           </div>
//         </div>
//         <div className="max-h-[80dvh] overflow-y-auto pr-1">
//           <Table
//             columns={columns}
//             dataSource={filteredAndSortedUsers}
//             locale={{
//               emptyText: (
//                 <div style={{ color: "black" }}>
//                   {searchInput ? "No User Found" : "No Users available"}
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
//           setEditId={setEditId}
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
//     </Spin>
//   );
// };

// export default Department;
