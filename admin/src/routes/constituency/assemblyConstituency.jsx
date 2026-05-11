// import React, { useEffect, useState } from "react";
// import moment from "moment";
// import {
//   Button,
//   message,
//   Modal,
//   Spin,
//   Switch,
//   Table,
//   Select,
//   Drawer,
//   Space,
//   Divider,
// } from "antd";
// import { InputAdornment, MenuItem, TextField } from "@mui/material";
// import {
//   PlusOutlined,
//   SearchOutlined,
//   FilterOutlined,
//   ClearOutlined,
// } from "@ant-design/icons";
// import { fetchData, postData } from "../../api/apiService";
// import { MdEdit } from "react-icons/md";
// import { FaUserDoctor } from "react-icons/fa6";
// // import AddDoctor from "./AddDoctor";
// import { PiGitBranchFill } from "react-icons/pi";
// import AddUser from "./addUser";

// const { Option } = Select;

// const AssemblyConstituency = () => {
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
//   const [parlimentaryConstituencies, setParlimentaryConstituencies] = useState(
//     []
//   );
//   const [states, setStates] = useState([]);
//   const [
//     selectedParlimentaryConstituency,
//     setSelectedParlimentaryConstituency,
//   ] = useState(null);
//   const [selectedState, setSelectedState] = useState(null);
//   const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);

//   // Fetch parliamentary constituencies for filter
//   const fetchParlimentaryConstituencies = async () => {
//     try {
//       const response = await postData(
//         "/api/admin/fetch-Parlimentary-constituencies",
//         {
//           limit: 1000,
//           page: 1,
//         }
//       );
//       if (response?.responseCode === 200) {
//         setParlimentaryConstituencies(response?.data?.data || []);
//       }
//     } catch (error) {
//       console.error("Error fetching parliamentary constituencies:", error);
//     }
//   };

//   // Fetch states for filter
//   const fetchStates = async () => {
//     try {
//       const response = await fetchData("/api/admin/fetch-states");
//       if (response?.responseCode === 200) {
//         setStates(response?.data || []);
//       } else {
//         message.error(response?.message || "Failed to fetch states");
//       }
//     } catch (error) {
//       console.error("Error fetching states:", error);
//     }
//   };

//   // Check if there are active filters
//   const hasActiveFilters = () => {
//     return (
//       selectedParlimentaryConstituency ||
//       selectedState ||
//       selectedFilter !== "1"
//     );
//   };

//   // Clear all filters
//   const handleClearFilters = () => {
//     setSelectedParlimentaryConstituency(null);
//     setSelectedState(null);
//     setSelectedFilter("1");
//     setSearchInput("");
//     setCurrentPage(1);
//   };

//   // const toggleUser

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
//       title: "Assembly Constituency ID",
//       dataIndex: "assemblyConstituencyId",
//       key: "assemblyConstituencyId",
//       align: "center",
//       render: (id) => id || "N/A",
//     },
//     {
//       title: "Citizen Count",
//       dataIndex: "citizenCount",
//       key: "citizenCount",
//       align: "center",
//       render: (count) => count || "N/A",
//     },
//     {
//       title: "Parliamentary Constituency",
//       key: "parliamentaryConstituency",
//       align: "center",
//       render: (_, record) => record.parliamentaryConstituency?.name || "N/A",
//     },
//     {
//       title: "MLA Name",
//       key: "mlaName",
//       align: "center",
//       render: (_, record) => {
//         if (record.mla?.user?.name) return record.mla.user.name;
//         if (record.mlaName) return record.mlaName;
//         return "N/A";
//       },
//     },
//     {
//       title: "State",
//       dataIndex: ["state", "name"],
//       key: "state",
//       align: "center",
//       render: (stateName) => stateName || "N/A",
//     },
//     {
//       title: "District",
//       dataIndex: ["district", "name"],
//       key: "district",
//       align: "center",
//       render: (districtName) => districtName || "N/A",
//     },
//     {
//       title: "Status",
//       dataIndex: "isActive",
//       key: "status",
//       align: "center",
//       render: (isActive) => (
//         <span
//           style={{
//             color: isActive ? "green" : "red",
//             fontWeight: "bold",
//           }}
//         >
//           {isActive ? "Active" : "Inactive"}
//         </span>
//       ),
//     },
//     // {
//     //   title: "Action",
//     //   key: "action",
//     //   align: "center",
//     //   render: (_, record) => (
//     //     <Switch
//     //       checked={record.isActive}
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
//       search: searchInput,
//       sort: selectedFilter, /// FIXED: convert to number
//       parliamentaryConstituencyId:
//         selectedParlimentaryConstituency || undefined,
//       stateId: selectedState || undefined,
//     };
//     try {
//       setLoading(true);
//       const response = await postData(
//         "/api/admin/fetch-Assembly-constituencies",
//         payload
//       );
//       if (response?.responseCode == 200) {
//         setUsers(response?.data?.data || []);
//         setTotal(response?.data?.pagination?.total || 1);
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
//     fetchParlimentaryConstituencies();
//     fetchStates();
//   }, []);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchInput, selectedParlimentaryConstituency, selectedState]);

//   useEffect(() => {
//     fetchUserList();
//   }, [
//     selectedFilter,
//     currentPage,
//     pageSize,
//     searchInput,
//     selectedParlimentaryConstituency,
//     selectedState,
//   ]);

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
//               size="small"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               type="search"
//               sx={{ width: 400 }}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <SearchOutlined className="search-icon" />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//             {hasActiveFilters() && (
//               <Button
//                 type="text"
//                 icon={<ClearOutlined />}
//                 onClick={handleClearFilters}
//                 className="text-red-500 hover:text-red-700"
//               >
//                 Clear Filters
//               </Button>
//             )}
//           </div>
//           <div className="flex items-center justify-end gap-1 w-full">
//             <div className="relative">
//               <Button
//                 type={hasActiveFilters() ? "primary" : "default"}
//                 icon={<FilterOutlined />}
//                 onClick={() => setFilterDrawerVisible(true)}
//                 className="h-[36px] w-[36px] p-0"
//                 title="Filters"
//               />
//               {hasActiveFilters() && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center z-10">
//                   {
//                     [
//                       selectedParlimentaryConstituency,
//                       selectedState,
//                       selectedFilter !== "1",
//                     ].filter(Boolean).length
//                   }
//                 </span>
//               )}
//             </div>
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

//         {/* Filter Drawer */}
//         <Drawer
//           title={<span className="text-lg font-semibold">Filters & Sort</span>}
//           placement="right"
//           onClose={() => setFilterDrawerVisible(false)}
//           open={filterDrawerVisible}
//           width={500}
//         >
//           <div className="flex flex-col h-full">
//             <div className="flex-1 overflow-y-auto">
//               <Space direction="vertical" size="middle" className="w-full">
//                 {/* Sort Section */}
//                 <div>
//                   <h4 className="text-base font-semibold mb-3">Sort By</h4>
//                   <Select
//                     style={{ width: "100%" }}
//                     size="large"
//                     value={selectedFilter}
//                     onChange={(value) => {
//                       setSelectedFilter(value);
//                       setCurrentPage(1);
//                     }}
//                   >
//                     <Option value="1">Ascending</Option>
//                     <Option value="-1">Descending</Option>
//                   </Select>
//                 </div>

//                 <Divider className="my-2" />

//                 {/* Filters Section */}
//                 <div>
//                   <h4 className="text-base font-semibold mb-3">Filters</h4>
//                   <div className="space-y-4">
//                     {/* Parliamentary Constituency */}
//                     <div>
//                       <label className="block text-sm font-medium mb-2">
//                         Parliamentary Constituency
//                       </label>
//                       <Select
//                         placeholder="Select Parliamentary Constituency"
//                         allowClear
//                         style={{ width: "100%" }}
//                         size="large"
//                         value={selectedParlimentaryConstituency || null}
//                         onChange={(value) => {
//                           setSelectedParlimentaryConstituency(value || null);
//                           setCurrentPage(1);
//                         }}
//                       >
//                         {parlimentaryConstituencies.map((pc) => (
//                           <Option key={pc._id} value={pc._id}>
//                             {pc.name}
//                           </Option>
//                         ))}
//                       </Select>
//                     </div>

//                     {/* State */}
//                     <div>
//                       <label className="block text-sm font-medium mb-2">
//                         State
//                       </label>
//                       <Select
//                         placeholder="Select State"
//                         allowClear
//                         style={{ width: "100%" }}
//                         size="large"
//                         value={selectedState || null}
//                         onChange={(value) => {
//                           setSelectedState(value || null);
//                           setCurrentPage(1);
//                         }}
//                       >
//                         {states.map((state) => (
//                           <Option key={state._id} value={state._id}>
//                             {state.name}
//                           </Option>
//                         ))}
//                       </Select>
//                     </div>
//                   </div>
//                 </div>
//               </Space>
//             </div>
//             <div className="border-t pt-4 mt-4">
//               <Space className="w-full justify-end">
//                 {hasActiveFilters() && (
//                   <Button
//                     type="default"
//                     icon={<ClearOutlined />}
//                     onClick={handleClearFilters}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     Clear All
//                   </Button>
//                 )}
//                 <Button
//                   type="primary"
//                   onClick={() => setFilterDrawerVisible(false)}
//                 >
//                   Apply Filters
//                 </Button>
//               </Space>
//             </div>
//           </div>
//         </Drawer>

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

// export default AssemblyConstituency;
