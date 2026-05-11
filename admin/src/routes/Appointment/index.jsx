// import React, { useEffect, useState, useMemo } from "react";
// import moment from "moment";
// import {
//   Button,
//   message,
//   Modal,
//   Spin,
//   Switch,
//   Table,
//   Tag,
//   Form,
//   Descriptions,
//   DatePicker,
//   Select,
//   Drawer,
//   Space,
//   Divider,
//   Checkbox,
//   Radio,
// } from "antd";
// import { InputAdornment, MenuItem, TextField } from "@mui/material";
// import {
//   PlusOutlined,
//   SearchOutlined,
//   DownloadOutlined,
//   FilterOutlined,
//   ClearOutlined,
//   FileImageOutlined,
// } from "@ant-design/icons";
// import { fetchData, postData } from "../../api/apiService";
// import { MdEdit } from "react-icons/md";
// import { FaUserDoctor } from "react-icons/fa6";
// // import AddDoctor from "./AddDoctor";
// import { PiGitBranchFill } from "react-icons/pi";
// import AddUser from "./addUser";
// import jsPDF from "jspdf";
// import * as XLSX from "xlsx";
// import autoTable from "jspdf-autotable";
// import TruncatedTextWithTooltip, {
//   createTruncatedTextRenderer,
// } from "../../utils/TruncatedTextWithTooltip";
// import {
//   useDocumentButton,
//   filterValidUrlsSync,
//   getFileName,
//   default as DocumentViewer,
// } from "../../utils/DocumentViewer";

// const { RangePicker } = DatePicker;
// const { Option } = Select;

// const Appointments = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [total, setTotal] = useState(1);
//   const [searchInput, setSearchInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedFilter, setSelectedFilter] = useState("-1");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [users, setUsers] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [userModelFlag, setUserModelFlag] = useState(false);
//   const [warningModal, setWarningModal] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [newStatus, setNewStatus] = useState(false);
//   const [modalLoad, setModalLoad] = useState(false);
//   const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
//   const [sheduleModelStatus, setSheduleModelStatus] = useState("reshedule");
//   const [dateRange, setDateRange] = useState(null);
//   const [timeSlot, setTimeSlot] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState(null);
//   const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
//   const [downloadModalVisible, setDownloadModalVisible] = useState(false);
//   const [selectedColumns, setSelectedColumns] = useState([]);
//   const [downloadFormat, setDownloadFormat] = useState("excel");

//   // Document button helper hook
//   const { renderDocuments, DocumentModal } = useDocumentButton({
//     buttonText: "View",
//     emptyText: "No documents",
//     modalTitle: "View Documents",
//   });

//   const handleReschedule = (record, status) => {
//     setSelectedRecord(record);
//     setRescheduleModalVisible(true);
//     setSheduleModelStatus(status);
//   };

//   const handleSuccess = () => {
//     // optionally refresh your data table here
//     setRescheduleModalVisible(false);
//     setSelectedRecord(null);
//     fetchUserList();
//   };

//   // const toggleUser

//   const userChangeStatus = async () => {
//     setModalLoad(true);

//     const payload = {
//       userId: selectedRecord._id,
//     };
//     try {
//       setLoading(true);
//       const response = await postData("/api/admin/toggle-user", payload);
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

//   const handleStatusChange = async (record, status) => {
//     try {
//       const payload = {
//         appointmentId: record._id,
//         status: status,
//       };
//       setLoading(true);
//       const response = await postData(
//         "/api/mla/change-appointment-status",
//         payload
//       );
//       if (response?.responseCode === 200) {
//         message.success(response?.message || "Status updated successfully");
//         // fetchUserList();
//       } else {
//         message.error(response?.message || "Something went wrong");
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to update status");
//     } finally {
//       setLoading(false);
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
//       title: "Book For",
//       dataIndex: "bookFor",
//       key: "bookFor",
//       align: "center",
//       render: (bookFor) => (
//         <span className="capitalize">{bookFor || "N/A"}</span>
//       ),
//     },
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//       align: "center",
//       render: (name, record) => (
//         <div className="flex flex-row items-center gap-3">
//           <span className="capitalize font-medium">{name || "N/A"}</span>
//           {record.isPartyMember && (
//             <Tag color="blue" style={{ marginTop: 4 }}>
//               Party Member
//             </Tag>
//           )}
//         </div>
//       ),
//     },
//     {
//       title: "Membership ID",
//       dataIndex: "memberShipId",
//       key: "memberShipId",
//       align: "center",
//       render: (memberShipId) => <span>{memberShipId || "N/A"}</span>,
//     },
//     {
//       title: "Email",
//       dataIndex: ["user", "email"],
//       key: "email",
//       align: "center",
//       render: (email) => <span>{email || "N/A"}</span>,
//     },
//     {
//       title: "Phone",
//       dataIndex: "phone",
//       key: "phone",
//       align: "center",
//       render: (phone) => <span>{phone || "N/A"}</span>,
//     },
//     {
//       title: "Date & Time",
//       dataIndex: "date",
//       key: "dateAndTime",
//       align: "center",
//       render: (date, record) =>
//         date && record.timeSlot
//           ? moment(`${date} ${record.timeSlot}`).format("DD/MM/YYYY hh:mm A")
//           : "N/A",
//     },
//     {
//       title: "Purpose",
//       dataIndex: "purpose",
//       key: "purpose",
//       align: "center",
//       render: (purpose) => <span>{purpose || "N/A"}</span>,
//     },
//     {
//       title: "Description",
//       dataIndex: "reason",
//       key: "reason",
//       align: "center",
//       render: createTruncatedTextRenderer({ maxLength: 30 }),
//     },

//     {
//       title: "Documents",
//       dataIndex: "documents",
//       key: "documents",
//       align: "center",
//       render: renderDocuments,
//     },

//     {
//       title: "Reshedule Date & Time",
//       dataIndex: "resheduledDate",
//       key: "dateAndTime",
//       align: "center",
//       render: (resheduledDate, record) =>
//         resheduledDate && record.timeSlot
//           ? moment(`${resheduledDate} ${record.timeSlot}`).format(
//               "DD/MM/YYYY hh:mm A"
//             )
//           : "N/A",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       align: "center",
//       render: (status) => {
//         const getStatusColor = (status) => {
//           switch (status) {
//             case "approved":
//               return "green";
//             case "rejected":
//               return "red";
//             case "completed":
//               return "blue";
//             case "rescheduled":
//               return "purple";
//             case "cancelled":
//               return "default";
//             case "pending":
//             default:
//               return "orange";
//           }
//         };
//         return (
//           <Tag color={getStatusColor(status)}>
//             {status?.toUpperCase() || "N/A"}
//           </Tag>
//         );
//       },
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       align: "center",
//       render: (record) => {
//         const isCancelled = record.status === "cancelled";
//         return (
//           <div
//             style={{ display: "flex", justifyContent: "center", gap: "8px" }}
//           >
//             <Button
//               size="small"
//               type="primary"
//               onClick={() => handleReschedule(record, "Approve")}
//               disabled={isCancelled}
//             >
//               Accept
//             </Button>
//             <Button
//               size="small"
//               danger
//               onClick={() => handleStatusChange(record, "rejected")}
//               disabled={isCancelled}
//             >
//               Reject
//             </Button>
//             <Button
//               size="small"
//               onClick={() => handleReschedule(record, "Reschedule")}
//               style={{
//                 backgroundColor: "#faad14",
//                 color: "white",
//                 border: "none",
//               }}
//             >
//               Reschedule
//             </Button>
//           </div>
//         );
//       },
//     },
//   ];

//   // Real-time search debounce
//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       setSearchQuery(searchInput.trim());
//       setCurrentPage(1);
//     }, 300);
//     return () => clearTimeout(delayDebounceFn);
//   }, [searchInput]);

//   // Clear search when any filter is applied
//   useEffect(() => {
//     if (selectedStatus || dateRange || timeSlot) {
//       setSearchInput("");
//       setSearchQuery("");
//     }
//   }, [selectedStatus, dateRange, timeSlot]);

//   // Check if any filters are active
//   const hasActiveFilters = () => {
//     return selectedStatus || dateRange || timeSlot || selectedFilter !== "-1";
//   };

//   // Clear all filters
//   const handleClearFilters = () => {
//     setSelectedStatus(null);
//     setDateRange(null);
//     setTimeSlot("");
//     setSelectedFilter("-1");
//     setSearchInput("");
//     setSearchQuery("");
//     setCurrentPage(1);
//   };

//   const fetchUserList = async () => {
//     const payload = {
//       page: currentPage,
//       pageSize: pageSize,
//     };

//     // Add search only if provided
//     if (searchQuery) {
//       payload.search = searchQuery;
//     }

//     // Add status filter only if selected
//     if (selectedStatus) {
//       payload.status = selectedStatus;
//     }

//     // Add date range filters only if dateRange is set
//     if (dateRange && dateRange[0]) {
//       payload.startDate = dateRange[0].format("YYYY-MM-DD");
//     }
//     if (dateRange && dateRange[1]) {
//       payload.endDate = dateRange[1].format("YYYY-MM-DD");
//     }

//     // Add time slot filter only if selected
//     if (timeSlot) {
//       payload.timeSlot = timeSlot;
//     }

//     // Add sort filter
//     if (selectedFilter !== "-1") {
//       payload.sort = selectedFilter;
//     }

//     try {
//       setLoading(true);
//       const response = await postData("/api/mla/list-of-appointments", payload);
//       if (response?.responseCode === 200) {
//         setUsers(response?.data?.appointments || []);
//         setTotal(response?.data?.totalAppointments || 0);
//       } else {
//         message.error(response?.message || "Something went wrong");
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to fetch appointments");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserList();
//   }, [
//     selectedFilter,
//     currentPage,
//     pageSize,
//     searchQuery,
//     selectedStatus,
//     dateRange,
//     timeSlot,
//   ]);

//   // Available columns for download
//   const availableColumns = useMemo(
//     () => [
//       { key: "sno", title: "S.No", dataKey: "index" },
//       { key: "bookFor", title: "Book For", dataKey: "bookFor" },
//       { key: "name", title: "Name", dataKey: "name" },
//       { key: "memberShipId", title: "Membership ID", dataKey: "memberShipId" },
//       { key: "email", title: "Email", dataKey: "email" },
//       { key: "phone", title: "Phone", dataKey: "phone" },
//       { key: "dateTime", title: "Date & Time", dataKey: "dateAndTime" },
//       { key: "purpose", title: "Purpose", dataKey: "purpose" },
//       { key: "description", title: "Description", dataKey: "reason" },
//       { key: "documents", title: "Documents", dataKey: "documents" },
//       {
//         key: "rescheduleDateTime",
//         title: "Reschedule Date & Time",
//         dataKey: "rescheduleDateTime",
//       },
//       { key: "status", title: "Status", dataKey: "status" },
//     ],
//     []
//   );

//   // Initialize selected columns when modal opens
//   useEffect(() => {
//     if (downloadModalVisible) {
//       setSelectedColumns(availableColumns.map((col) => col.key));
//     }
//   }, [downloadModalVisible, availableColumns]);

//   // Get column value helper
//   const getColumnValue = (appointment, columnKey, index) => {
//     switch (columnKey) {
//       case "sno":
//         return index + 1;
//       case "bookFor":
//         return appointment?.bookFor
//           ? appointment.bookFor.charAt(0).toUpperCase() +
//               appointment.bookFor.slice(1)
//           : "N/A";
//       case "name":
//         return appointment?.name || "N/A";
//       case "memberShipId":
//         return appointment?.memberShipId || "N/A";
//       case "email":
//         return appointment?.user?.email || "N/A";
//       case "phone":
//         return appointment?.phone || appointment?.user?.phone || "N/A";
//       case "dateTime":
//         return appointment?.date && appointment?.timeSlot
//           ? moment(`${appointment.date} ${appointment.timeSlot}`).format(
//               "DD/MM/YYYY hh:mm A"
//             )
//           : "N/A";
//       case "purpose":
//         return appointment?.purpose || "N/A";
//       case "description":
//         const description = appointment?.reason || "N/A";
//         // Truncate description for export (max 100 chars)
//         return description.length > 100
//           ? `${description.substring(0, 100)}...`
//           : description;
//       case "documents":
//         const documents = Array.isArray(appointment?.documents)
//           ? appointment.documents
//           : appointment?.documents
//           ? [appointment.documents]
//           : [];
//         // Filter valid URLs and format as file names
//         const validDocs = filterValidUrlsSync(documents);
//         if (validDocs.length === 0) return "No documents";
//         // Format as: "file1.jpg, file2.pdf, ..."
//         return validDocs.map((url) => getFileName(url)).join(", ");
//       case "rescheduleDateTime":
//         return appointment?.resheduledDate && appointment?.timeSlot
//           ? moment(
//               `${appointment.resheduledDate} ${appointment.timeSlot}`
//             ).format("DD/MM/YYYY hh:mm A")
//           : "N/A";
//       case "status":
//         return appointment?.status?.toUpperCase() || "N/A";
//       default:
//         return "N/A";
//     }
//   };

//   // Download Excel
//   const handleDownloadExcel = async (data) => {
//     const selectedCols = availableColumns.filter((col) =>
//       selectedColumns.includes(col.key)
//     );

//     if (selectedCols.length === 0) {
//       message.warning("Please select at least one column to download.");
//       return;
//     }

//     // Prepare data with selected columns
//     const excelData = data.map((item, index) => {
//       const row = {};
//       selectedCols.forEach((col) => {
//         row[col.title] = getColumnValue(item, col.key, index);
//       });
//       return row;
//     });

//     // Create workbook and worksheet
//     const ws = XLSX.utils.json_to_sheet(excelData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Appointments");

//     // Generate Excel file
//     XLSX.writeFile(
//       wb,
//       `appointments_${moment().format("YYYY-MM-DD_HH-mm-ss")}.xlsx`
//     );

//     message.success("Excel file downloaded successfully!");
//   };

//   // Download PDF
//   const handleDownloadPDF = async (data) => {
//     const selectedCols = availableColumns.filter((col) =>
//       selectedColumns.includes(col.key)
//     );

//     if (selectedCols.length === 0) {
//       message.warning("Please select at least one column to download.");
//       return;
//     }

//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text("Appointments List", 14, 15);

//     // Prepare table data
//     const tableData = data.map((item, index) => {
//       return selectedCols.map((col) => getColumnValue(item, col.key, index));
//     });

//     const headers = selectedCols.map((col) => col.title);

//     autoTable(doc, {
//       head: [headers],
//       body: tableData,
//       startY: 25,
//       styles: { fontSize: 8 },
//       headStyles: { fillColor: [66, 139, 202] },
//     });

//     doc.save(`appointments_${moment().format("YYYY-MM-DD_HH-mm-ss")}.pdf`);
//     message.success("PDF downloaded successfully!");
//   };

//   // Main download handler
//   const handleDownload = async () => {
//     if (selectedColumns.length === 0) {
//       message.warning("Please select at least one column to download.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setDownloadModalVisible(false);

//       const payload = {
//         page: 1,
//         pageSize: total,
//       };

//       // Add all filters to download payload
//       if (searchQuery) {
//         payload.search = searchQuery;
//       }
//       if (selectedStatus) {
//         payload.status = selectedStatus;
//       }
//       if (dateRange && dateRange[0]) {
//         payload.startDate = dateRange[0].format("YYYY-MM-DD");
//       }
//       if (dateRange && dateRange[1]) {
//         payload.endDate = dateRange[1].format("YYYY-MM-DD");
//       }
//       if (timeSlot) {
//         payload.timeSlot = timeSlot;
//       }
//       if (selectedFilter !== "-1") {
//         payload.sort = selectedFilter;
//       }

//       const response = await postData("/api/mla/list-of-appointments", payload);

//       if (response?.responseCode === 200) {
//         const data = response?.data?.appointments || [];

//         if (data.length === 0) {
//           message.warning("No appointment data available to download.");
//           return;
//         }

//         if (downloadFormat === "excel") {
//           await handleDownloadExcel(data);
//         } else {
//           await handleDownloadPDF(data);
//         }
//       } else {
//         message.error(response?.message || "Something went wrong");
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to download appointments");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Spin spinning={loading}>
//       <div className="mt-2 flex flex-col gap-2">
//         {/* Top Bar - Search and Actions */}
//         <div className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg shadow-sm">
//           {/* Search Section */}
//           <div className="flex items-center gap-2 flex-1">
//             <TextField
//               id="outlined-basic"
//               label="Search"
//               variant="outlined"
//               size="small"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               type="search"
//               className="w-[350px]"
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

//           {/* Action Buttons */}
//           <div className="flex items-center gap-2">
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
//                       selectedStatus,
//                       dateRange,
//                       timeSlot,
//                       selectedFilter !== "-1",
//                     ].filter(Boolean).length
//                   }
//                 </span>
//               )}
//             </div>
//             <Button
//               type="default"
//               icon={<DownloadOutlined />}
//               onClick={() => setDownloadModalVisible(true)}
//               className="h-[36px] w-[36px] p-0"
//               title="Download"
//             />
//           </div>
//         </div>

//         {/* Filter Drawer */}
//         <Drawer
//           title={<span className="text-lg font-semibold">Filters & Sort</span>}
//           placement="right"
//           onClose={() => setFilterDrawerVisible(false)}
//           open={filterDrawerVisible}
//           width={700}
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
//                     <Option value="-1">Newest First</Option>
//                     <Option value="1">Oldest First</Option>
//                   </Select>
//                 </div>

//                 <Divider className="my-2" />

//                 {/* Filters Section */}
//                 <div>
//                   <h4 className="text-base font-semibold mb-3">Filters</h4>
//                   <div className="grid grid-cols-1 gap-4">
//                     {/* Status Filter */}
//                     <div>
//                       <label className="block text-sm font-medium mb-2">
//                         Status
//                       </label>
//                       <Select
//                         placeholder="Select Status"
//                         allowClear
//                         style={{ width: "100%" }}
//                         size="large"
//                         value={selectedStatus}
//                         onChange={(value) => {
//                           setSelectedStatus(value);
//                           setCurrentPage(1);
//                         }}
//                       >
//                         <Option value="pending">Pending</Option>
//                         <Option value="approved">Approved</Option>
//                         <Option value="rejected">Rejected</Option>
//                         <Option value="completed">Completed</Option>
//                         <Option value="rescheduled">Rescheduled</Option>
//                         <Option value="cancelled">Cancelled</Option>
//                       </Select>
//                     </div>

//                     {/* Date Range Filter */}
//                     <div>
//                       <label className="block text-sm font-medium mb-2">
//                         Date Range
//                       </label>
//                       <RangePicker
//                         style={{ width: "100%" }}
//                         size="large"
//                         value={dateRange}
//                         onChange={(dates) => {
//                           setDateRange(dates);
//                           setCurrentPage(1);
//                         }}
//                         format="YYYY-MM-DD"
//                         placeholder={["Start Date", "End Date"]}
//                       />
//                     </div>

//                     {/* Time Slot Filter */}
//                     <div>
//                       <label className="block text-sm font-medium mb-2">
//                         Time Slot
//                       </label>
//                       <Select
//                         placeholder="Select Time Slot"
//                         allowClear
//                         style={{ width: "100%" }}
//                         size="large"
//                         value={timeSlot}
//                         onChange={(value) => {
//                           setTimeSlot(value);
//                           setCurrentPage(1);
//                         }}
//                       >
//                         <Option value="morning">Morning (06:00 - 12:00)</Option>
//                         <Option value="afternoon">
//                           Afternoon (12:00 - 18:00)
//                         </Option>
//                         <Option value="evening">Evening (18:00 - 24:00)</Option>
//                         <Option value="night">Night (00:00 - 06:00)</Option>
//                       </Select>
//                     </div>
//                   </div>
//                 </div>
//               </Space>
//             </div>

//             {/* Footer with buttons */}
//             <div className="border-t pt-4 mt-4">
//               <Space className="w-full justify-end">
//                 {hasActiveFilters() && (
//                   <Button
//                     type="default"
//                     icon={<ClearOutlined />}
//                     onClick={handleClearFilters}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     Clear All Filters
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
//         <div className="max-h-[80dvh] overflow-y-auto pr-1">
//           <Table
//             columns={columns}
//             dataSource={users}
//             locale={{
//               emptyText: (
//                 <div style={{ color: "black" }}>
//                   {searchQuery
//                     ? "No Appointments Found"
//                     : "No Appointments available"}
//                 </div>
//               ),
//             }}
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

//         {/* Download Modal */}
//         <Modal
//           title="Download Options"
//           centered
//           open={downloadModalVisible}
//           onOk={handleDownload}
//           onCancel={() => setDownloadModalVisible(false)}
//           okText="Download"
//           cancelText="Cancel"
//           width={500}
//         >
//           <Space direction="vertical" size="large" className="w-full">
//             {/* Format Selection */}
//             <div>
//               <h4 className="text-base font-semibold mb-3">Select Format</h4>
//               <Radio.Group
//                 value={downloadFormat}
//                 onChange={(e) => setDownloadFormat(e.target.value)}
//               >
//                 <Radio value="excel">Excel (.xlsx)</Radio>
//                 <Radio value="pdf">PDF (.pdf)</Radio>
//               </Radio.Group>
//             </div>

//             <Divider />

//             {/* Column Selection */}
//             <div>
//               <div className="flex items-center justify-between mb-3">
//                 <h4 className="text-base font-semibold">Select Columns</h4>
//                 <Space>
//                   <Button
//                     type="link"
//                     size="small"
//                     onClick={() =>
//                       setSelectedColumns(availableColumns.map((col) => col.key))
//                     }
//                   >
//                     Select All
//                   </Button>
//                   <Button
//                     type="link"
//                     size="small"
//                     onClick={() => setSelectedColumns([])}
//                   >
//                     Clear All
//                   </Button>
//                 </Space>
//               </div>
//               <Checkbox.Group
//                 value={selectedColumns}
//                 onChange={setSelectedColumns}
//                 className="w-full"
//               >
//                 <Space direction="vertical" className="w-full">
//                   {availableColumns.map((col) => (
//                     <Checkbox key={col.key} value={col.key}>
//                       {col.title}
//                     </Checkbox>
//                   ))}
//                 </Space>
//               </Checkbox.Group>
//             </div>
//           </Space>
//         </Modal>

//         <AddUser
//           patientDrawer={userModelFlag}
//           setPatientDrawer={setUserModelFlag}
//           fetchPatientsList={fetchUserList}
//           editId={editId}
//           setEditId={setEditId}
//         />
//         <DocumentModal />
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
//       {selectedRecord && (
//         <RescheduleModal
//           record={selectedRecord}
//           visible={rescheduleModalVisible}
//           onCancel={() => setRescheduleModalVisible(false)}
//           onSuccess={handleSuccess}
//           sheduleModelStatus={sheduleModelStatus}
//         />
//       )}
//     </Spin>
//   );
// };

// const RescheduleModal = ({
//   record,
//   visible,
//   onCancel,
//   onSuccess,
//   sheduleModelStatus,
// }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [documentModalVisible, setDocumentModalVisible] = useState(false);

//   const handleFinish = async (values) => {
//     try {
//       setLoading(true);
//       const payload = {
//         appointmentId: record._id,
//         mlaId: record.mla,
//         date: values?.date?.format("YYYY-MM-DD") || record?.date || "",
//         timeSlot: sheduleModelStatus === "Approve" 
//           ? record?.timeSlot || "" 
//           : values?.timeSlot || "",
//         status: sheduleModelStatus === "Approve" ? "approved" : null,
//       };

//       let response;
//       let successMessage = "";

//       if (sheduleModelStatus && sheduleModelStatus === "Reschedule") {
//         response = await postData("/api/mla/reshedule-appointment", payload);
//         successMessage = "Appointment rescheduled successfully!";
//       } else {
//         response = await postData(
//           "/api/mla/change-appointment-status",
//           payload
//         );
//         successMessage = "Appointment Approved successfully!";
//       }

//       if (response.responseCode !== 200) {
//         message.error(response.message || "failed to reshedule");
//         return;
//       }

//       message.success(successMessage);
//       form.resetFields();
//       onSuccess();
//     } catch (error) {
//       message.error(
//         error?.response?.data?.message || "Failed to reschedule appointment"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal
//       title={`${sheduleModelStatus} Appointment`}
//       open={visible}
//       onCancel={onCancel}
//       footer={null}
//       centered
//     >
//       <Descriptions column={1} bordered size="small" className="mb-4">
//         <Descriptions.Item label="Name">
//           {record.user?.name || record.name}
//         </Descriptions.Item>
//         <Descriptions.Item label="Phone">
//           {record.user?.phone || record.phone}
//         </Descriptions.Item>
//         <Descriptions.Item label="Purpose">{record?.purpose}</Descriptions.Item>
//         {record?.description && (
//           <Descriptions.Item label="Description">
//             <TruncatedTextWithTooltip
//               text={record.description}
//               maxLength={50}
//             />
//           </Descriptions.Item>
//         )}
//         {record?.documents &&
//           Array.isArray(record.documents) &&
//           filterValidUrlsSync(record.documents).length > 0 && (
//             <Descriptions.Item label="Documents">
//               <Button
//                 type="link"
//                 onClick={() => setDocumentModalVisible(true)}
//                 icon={<FileImageOutlined />}
//               >
//                 View Documents ({filterValidUrlsSync(record.documents).length})
//               </Button>
//             </Descriptions.Item>
//           )}
//         <Descriptions.Item label="Current Date">
//           {record?.date ? moment(record.date).format("DD/MM/YYYY") : "N/A"}
//         </Descriptions.Item>
//       </Descriptions>

//       <Form layout="vertical" form={form} onFinish={handleFinish}>
//         {sheduleModelStatus !== "Approve" && (
//           <Form.Item
//             label="Select New Date"
//             name="date"
//             rules={
//               sheduleModelStatus !== "Approve"
//                 ? [{ required: true, message: "Please select a new date" }]
//                 : []
//             }
//           >
//             <DatePicker
//               style={{ width: "100%" }}
//               disabledDate={(current) =>
//                 current && current < moment().startOf("day")
//               }
//             />
//           </Form.Item>
//         )}

//         {sheduleModelStatus !== "Approve" && (
//           <Form.Item
//             label="Select Time Slot"
//             name="timeSlot"
//             rules={[
//               { required: true, message: "Please select new time slot" },
//             ]}
//           >
//             <Select placeholder="Choose a time slot" style={{ width: "100%" }}>
//               {[...Array(24)].map((_, i) => {
//                 const value = `${String(i).padStart(2, "0")}:00`;
//                 return (
//                   <Select.Option key={value} value={value}>
//                     {moment(value, "HH:mm").format("hh:mm A")}
//                   </Select.Option>
//                 );
//               })}
//             </Select>
//           </Form.Item>
//         )}

//         <Form.Item>
//           <Button type="primary" htmlType="submit" loading={loading} block>
//             {sheduleModelStatus}
//           </Button>
//         </Form.Item>
//       </Form>

//       {/* Document Modal */}
//       <Modal
//         title="View Documents"
//         open={documentModalVisible}
//         onCancel={() => setDocumentModalVisible(false)}
//         footer={[
//           <Button key="close" onClick={() => setDocumentModalVisible(false)}>
//             Close
//           </Button>,
//         ]}
//         width="80%"
//         centered
//       >
//         <DocumentViewer
//           documents={
//             record?.documents
//               ? filterValidUrlsSync(
//                   Array.isArray(record.documents)
//                     ? record.documents
//                     : [record.documents]
//                 )
//               : []
//           }
//           size="medium"
//           showActions={true}
//           emptyMessage="No documents available"
//           filterInvalidUrls={true}
//         />
//       </Modal>
//     </Modal>
//   );
// };

// export default Appointments;
