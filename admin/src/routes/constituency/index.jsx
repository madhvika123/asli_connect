// import React, { useEffect, useState } from "react";
// import moment from "moment";
// import { Button, message, Modal, Spin, Switch, Table } from "antd";
// import { InputAdornment, MenuItem, TextField } from "@mui/material";
// import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
// import { fetchData, postData } from "../../api/apiService";
// import { MdEdit } from "react-icons/md";
// import { FaUserDoctor } from "react-icons/fa6";
// import { PiGitBranchFill } from "react-icons/pi";
// import AddUser from "./addUser";

// const Constituency = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [total, setTotal] = useState(1);
//   const [searchInput, setSearchInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedFilter, setSelectedFilter] = useState("1");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [users, setUsers] = useState([]);
//   const [displayedUsers, setDisplayedUsers] = useState([]); // immediate filtered list
//   const [editId, setEditId] = useState(null);
//   const [userModelFlag, setUserModelFlag] = useState(false);
//   const [warningModal, setWarningModal] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [newStatus, setNewStatus] = useState(false);
//   const [modalLoad, setModalLoad] = useState(false);

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
//       } else {
//         message.error(response?.message || "Something went wrong");
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to update status");
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
//       title: "Constituency Name",
//       dataIndex: "name",
//       key: "name",
//       align: "center",
//       render: (name) => {
//         const displayName = name ? name.slice(0, 20) : "N/A";
//         return (
//           <span title={name || "N/A"}>
//             {displayName}
//             {name && name.length > 20 ? "..." : ""}
//           </span>
//         );
//       },
//     },
//     {
//       title: "Constituency ID",
//       dataIndex: "parliamentaryConstituencyId",
//       key: "parliamentaryConstituencyId",
//       align: "center",
//       render: (id) => id || "N/A",
//     },
//     {
//       title: "MP Name",
//       dataIndex: "MPName",
//       key: "MPName",
//       align: "center",
//       render: (name) => name || "N/A",
//     },
//     {
//       title: "State",
//       dataIndex: ["state", "name"],
//       key: "state",
//       align: "center",
//       render: (stateName) => stateName || "N/A",
//     },
//     {
//       title: "Districts",
//       dataIndex: "district",
//       key: "district",
//       align: "center",
//       render: (districts) =>
//         districts && districts.length > 0
//           ? districts.map((d) => d.name).join(", ")
//           : "N/A",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       align: "center",
//       render: (status) => (
//         <span
//           style={{
//             color: status === "active" ? "green" : "red",
//             fontWeight: "bold",
//           }}
//         >
//           {status.charAt(0).toUpperCase() + status.slice(1)}
//         </span>
//       ),
//     },
//     // {
//     //   title: "Action",
//     //   key: "action",
//     //   align: "center",
//     //   render: (_, record) => (
//     //     <Switch
//     //       checked={record.status === "active"}
//     //       onChange={() => {
//     //         setSelectedRecord(record);
//     //         setWarningModal(true);
//     //       }}
//     //     />
//     //   ),
//     // },
//   ];

//   const fetchUserList = async () => {
//     const payload = {
//       page: currentPage,
//       pageSize: pageSize,
//       isPartyMember: false,
//       search: searchQuery,
//       sort: selectedFilter, // FIXED SORTING
//     };
//     try {
//       setLoading(true);
//       const response = await postData(
//         "/api/admin/fetch-Parlimentary-constituencies",
//         payload
//       );
//       if (response?.responseCode == 200) {
//         const list = response?.data?.data || [];
//         setUsers(list);
//         setDisplayedUsers(list);
//         setTotal(response?.data?.pagination?.total || 1);
//       } else {
//         message.error(response?.message || "Something went wrong");
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to fetch constituency list");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Debounced server-side search: update searchQuery after 500ms of no typing
//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       setSearchQuery(searchInput.trim());
//     }, 500);
//     return () => clearTimeout(delayDebounce);
//   }, [searchInput]);

//   // Immediate client-side filtering so results appear as user types
//   useEffect(() => {
//     // If input is empty, show the full list from server (current page)
//     if (!searchInput || !searchInput.trim()) {
//       setDisplayedUsers(users);
//       return;
//     }

//     const q = searchInput.toLowerCase();
//     const filtered = users.filter((u) => {
//       const name = (u.name || "").toLowerCase();
//       const mp = (u.MPName || "").toLowerCase();
//       const cid = (u.parliamentaryConstituencyId || "").toLowerCase();
//       return name.includes(q) || mp.includes(q) || cid.includes(q);
//     });

//     setDisplayedUsers(filtered);
//   }, [searchInput, users]);

//   // Fetch when filters or pagination or server-side search query change
//   useEffect(() => {
//     fetchUserList();
//   }, [selectedFilter, currentPage, pageSize, searchQuery]);

//   return (
//     <Spin spinning={loading}>
//       <div className="mt-2 flex flex-col gap-2">
//         <div className="flex items-center justify-between client-details-form">
//           <div className="flex items-center justify-start gap-1 w-full">
//             <TextField
//               id="outlined-basic"
//               label="Search"
//               variant="outlined"
//               size="small"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               type="search"
//               style={{ width: "400px" }}
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
//               <MenuItem value="1">Ascending</MenuItem>
//               <MenuItem value="-1">Descending</MenuItem>
//             </TextField>
//             {/* 
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
//             </Button> */}
//           </div>
//         </div>

//         <div className="max-h-[80dvh] overflow-y-auto pr-1">
//           <Table
//             columns={columns}
//             dataSource={displayedUsers} // use immediate filtered list
//             locale={{ emptyText: "No Users available" }}
//             pagination={{
//               current: currentPage,
//               pageSize: pageSize,
//               total: total,
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

// export default Constituency;
