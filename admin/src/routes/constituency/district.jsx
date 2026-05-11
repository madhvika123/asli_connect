// import React, { useEffect, useState } from "react";
// import moment from "moment";
// import { Button, message, Modal, Spin, Table } from "antd";
// import { InputAdornment, MenuItem, TextField } from "@mui/material";
// import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
// import { postData } from "../../api/apiService";
// import AddUser from "./addUser";

// const District = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [total, setTotal] = useState(1);
//   const [searchInput, setSearchInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedFilter, setSelectedFilter] = useState("0"); // 0 = Newest, 1 = Oldest
//   const [users, setUsers] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [userModelFlag, setUserModelFlag] = useState(false);
//   const [warningModal, setWarningModal] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [modalLoad, setModalLoad] = useState(false);

//   // 🔹 Change Status Handler
//   const userChangeStatus = async () => {
//     setModalLoad(true);
//     const payload = { constituencyId: selectedRecord._id };
//     try {
//       setLoading(true);
//       const response = await postData(
//         "/api/admin/toggle-constituency",
//         payload
//       );
//       if (response?.responseCode === 200) {
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
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//       sorter: (a, b) => a.name.localeCompare(b.name),
//     },
//     {
//       title: "Code",
//       dataIndex: "code",
//       key: "code",
//     },
//     {
//       title: "State",
//       dataIndex: "state",
//       key: "state",
//     },
//     {
//       title: "Active",
//       dataIndex: "isActive",
//       key: "isActive",
//       render: (value) => (value ? "✅ Yes" : "❌ No"),
//     },
//     {
//       title: "Created At",
//       dataIndex: "createdAt",
//       key: "createdAt",
//       render: (value) => new Date(value).toLocaleString(),
//       sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
//     },
//   ];

//   // 🔹 Sort helper (Newest / Oldest)
//   const sortUserList = (list, filter) => {
//     if (filter === "1") {
//       // Oldest first
//       return [...list].sort(
//         (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
//       );
//     } else {
//       // Newest first
//       return [...list].sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//       );
//     }
//   };

//   // 🔹 Fetch API
//   const fetchUserList = async () => {
//     const payload = {
//       page: currentPage,
//       pageSize: pageSize,
//       isPartyMember: false,
//       search: searchInput,
//       sort: selectedFilter, // Backend sort
//     };
//     try {
//       setLoading(true);
//       const response = await postData("/api/admin/fetch-districts", payload);
//       if (response?.responseCode === 200) {
//         const sortedData = sortUserList(response?.data || [], selectedFilter);
//         setUsers(sortedData);
//         setTotal(response?.pagination?.total || 1);
//       } else {
//         message.error(response?.message || "Something went wrong");
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to fetch list");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchInput]);

//   useEffect(() => {
//     fetchUserList();
//   }, [selectedFilter, currentPage, pageSize, searchInput]);

//   return (
//     <Spin spinning={loading}>
//       <div className="mt-2 flex flex-col gap-2">
//         <div className="flex items-center justify-between client-details-form">
//           <div className="flex items-center justify-start gap-2 w-full">
//             {/* 🔹 Increased width of Search Bar */}
//             <TextField
//               id="outlined-basic"
//               label="Search"
//               variant="outlined"
//               size="small"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               type="search"
//               sx={{ width: "400px" }} // ⬅️ Increased width
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <SearchOutlined className="search-icon" />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </div>

//           <div className="flex items-center justify-end gap-2 w-full">
//             {/* 🔹 Sorting Dropdown */}
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
//               <MenuItem value="0">Ascending</MenuItem>
//               <MenuItem value="1">Descending</MenuItem>
//             </TextField>

//             {/* <Button
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
//             dataSource={users}
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

//       {/* Warning Modal */}
//       <Modal open={warningModal} footer={null} centered closeIcon={false}>
//         <Spin spinning={modalLoad}>
//           <div className="dashboard m-2">
//             <h4 className="text-xl font-semibold text-center py-2">
//               Are you sure you want to{" "}
//               {selectedRecord?.isActive ? "Deactivate" : "Activate"} <br /> this
//               user status?
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

// export default District;
