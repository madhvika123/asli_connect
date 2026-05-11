// import React, { useEffect, useState } from "react";
// import moment from "moment";
// import { Button, message, Modal, Spin, Switch, Table } from "antd";
// import { InputAdornment, MenuItem, TextField } from "@mui/material";
// import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
// import { fetchData, postData } from "../../api/apiService";
// import { MdEdit } from "react-icons/md";
// import { FaUserDoctor } from "react-icons/fa6";
// import AddDoctor from "./AddDoctor";
// import { PiGitBranchFill } from "react-icons/pi";

// const Doctors = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [total, setTotal] = useState(1);
//   const [searchInput, setSearchInput] = useState("");
//   const [doctorDrawer, setDoctorDrawer] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [doctorData, setDoctorData] = useState({});
//   const [doctorRecord, setDoctorRecord] = useState(null);
//   const [warningModal, setWarningModal] = useState(false);
//   const [modalLoad, setModalLoad] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [doctors, setDoctors] = useState([]);
//   const [branchData, setBranchData] = useState("");
//   const [selectedFilter, setSelectedFilter] = useState("0");
//   const [selectedBranch, setSelectedBranch] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [departmentData, setDepartmentData] = useState([]);

//   const columns = [
//     {
//       title: "S.No",
//       align: "center",
//       key: "index",
//       rowScope: "row",
//       render: (_, record, index) => index + 1,
//     },
//     {
//       title: "Doctor Name",
//       dataIndex: "name",
//       align: "center",
//       key: "name",
//       render: (name) => <span className="capitalize">{name || "N/A"}</span>,
//     },
//     {
//       title: "Phone",
//       dataIndex: "phone",
//       align: "center",
//       key: "phone",
//       render: (phone) => <span>{phone || "N/A"}</span>,
//     },
//     {
//       title: "Doctor Id",
//       dataIndex: "doctorId",
//       align: "center",
//       key: "doctorId",
//       render: (doctorId) => (
//         <span className="capitalize">{doctorId || "N/A"}</span>
//       ),
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       align: "center",
//       key: "email",
//       render: (email) => <span className="capitalize">{email || "N/A"}</span>,
//     },
//     {
//       title: "Consultation Fee",
//       dataIndex: "consultationFee",
//       align: "center",
//       key: "consultationFee",
//       render: (consultationFee) => <span>{consultationFee || "N/A"}</span>,
//     },
//     {
//       title: "Specialization",
//       dataIndex: "specialization",
//       key: "specialization",
//       align: "center",
//       render: (specialization) => specialization.join(", "),
//     },
//     {
//       title: "Qualifications",
//       dataIndex: "qualifications",
//       key: "qualifications",
//       align: "center",
//       render: (qualifications) => qualifications.join(", "),
//     },
//     {
//       title: "Registration Date",
//       dataIndex: "createdAt",
//       align: "center",
//       key: "createdAt",
//       render: (createdAt) =>
//         createdAt ? moment(createdAt).format("DD/MM/YYYY") : "N/A",
//     },

//     {
//       title: "Branches",
//       dataIndex: "branches",
//       align: "center",
//       key: "branches",
//       render: (branches) => (
//         <div className="flex items-center justify-center gap-1">
//           <PiGitBranchFill size={20} />
//           <span>({branches?.length || 0})</span>{" "}
//         </div>
//       ),
//     },

//     {
//       title: "Status",
//       dataIndex: "status",
//       align: "center",
//       key: "status",
//       render: (status, record) => (
//         <Switch
//           checked={status === "active"}
//           onChange={(checked) => {
//             setDoctorRecord(record);
//             setWarningModal(true);
//           }}
//         />
//       ),
//     },
//     {
//       title: "Action",
//       align: "center",
//       key: "edit",
//       render: (_, record) => (
//         <Button
//           type="button"
//           disabled={record?.status === "inactive"}
//           icon={<MdEdit className="text-lg" />}
//           onClick={() => {
//             setEditId(record?._id);
//             setDoctorDrawer(true);
//           }}
//           className={`${
//             record?.status === "inactive"
//               ? "!bg-gray-300 !text-gray-500 !cursor-not-allowed"
//               : ""
//           }`}
//         />
//       ),
//     },
//   ];

//   const fetchDoctorsList = async () => {
//     const payload = {
//       page: currentPage,
//       pageSize: pageSize,
//       search: searchQuery,
//       branch: selectedBranch,
//       sort: selectedFilter, /// 1 --- old or 0 -- latest
//     };
//     try {
//       setLoading(true);
//       const response = await postData("/api/admin/list-of-doctors", payload);
//       if (response?.responseCode == 200) {
//         setDoctorData(response?.data || {});
//         setDoctors(response?.data?.doctors || []);
//         setTotal(response?.data?.length || 1);
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

//   const doctorChangeStatus = async () => {
//     try {
//       const payload = {
//         doctorId: doctorRecord?._id,
//       };
//       setModalLoad(true);
//       const response = await postData("/api/admin/toggle-doctor", payload);
//       if (response?.responseCode == 200) {
//         setWarningModal(false);
//         fetchDoctorsList();
//       } else if (response?.responseCode == 400) {
//         message.error(response?.message || "Something went wrong");
//       } else {
//         message.error(response?.message || "Something went wrong");
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to change the status");
//     } finally {
//       setModalLoad(false);
//     }
//   };

//   const fetchBranchesList = async () => {
//     try {
//       setLoading(true);
//       const response = await postData("/api/admin/list-of-hospitalbranch");
//       if (response?.responseCode == 200) {
//         setBranchData(response?.data?.branches || []);
//       } else if (response?.responseCode == 400) {
//         message.error(response?.message || "Something went wrong");
//       } else {
//         message.error(response?.message || "Something went wrong");
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to fetch hospitals List");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDoctorsList();
//   }, [selectedFilter, currentPage, pageSize, selectedBranch, searchQuery]);

//   useEffect(() => {
//     fetchBranchesList();
//   }, []);

//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const response = await fetchData("/api/admin/list-of-department");
//         if (response?.responseCode === 200) {
//           setDepartmentData(response?.data || []);
//         }
//       } catch (error) {
//         message.error("Failed to fetch departments");
//       }
//     };
//     fetchDepartments();
//   }, []);

//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       setSearchQuery(searchInput);
//     }, 500);

//     return () => clearTimeout(delayDebounce);
//   }, [searchInput]);

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
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <SearchOutlined className="search-icon" />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//             <TextField
//               select
//               fullWidth
//               size="small"
//               label="Select Branch"
//               placeholder="Select one branch"
//               className="max-w-[30%]"
//               value={selectedBranch}
//               onChange={(e) => setSelectedBranch(e.target.value)}
//             >
//               <MenuItem value={""}>All</MenuItem>
//               {(Array.isArray(branchData) ? branchData : []).map((item) => (
//                 <MenuItem value={item?._id} key={item?._id}>
//                   {item?.branchName}
//                 </MenuItem>
//               ))}
//             </TextField>
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
//                 setDoctorDrawer(true);
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
//             dataSource={doctors}
//             locale={{ emptyText: "No doctors available" }}
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
//         <Modal visible={warningModal} footer={null} centered closeIcon={false}>
//           <Spin spinning={modalLoad}>
//             <div className="dashboard m-2">
//               <h4 className="text-xl font-semibold text-center py-2">
//                 Are you sure you want to{" "}
//                 {doctorRecord?.status === "active" ? "Deactivate" : "Activate"}{" "}
//                 <br /> this doctor status
//               </h4>
//               <footer className="flex justify-center items-center pt-2 space-x-4">
//                 <Button
//                   type="default"
//                   onClick={() => {
//                     setDoctorRecord(null);
//                     setWarningModal(false);
//                   }}
//                   className="min-w-[100px]"
//                 >
//                   No
//                 </Button>
//                 <Button
//                   type="primary"
//                   className="min-w-[100px]"
//                   onClick={() => doctorChangeStatus()}
//                 >
//                   Yes
//                 </Button>
//               </footer>
//             </div>
//           </Spin>
//         </Modal>
//         <AddDoctor
//           doctorDrawer={doctorDrawer}
//           setDoctorDrawer={setDoctorDrawer}
//           fetchDoctorsList={fetchDoctorsList}
//           editId={editId}
//           setEditId={setEditId}
//           branchData={branchData}
//           setBranchData={setBranchData}
//           departmentData={departmentData}
//         />
//       </div>
//     </Spin>
//   );
// };

// export default Doctors;
