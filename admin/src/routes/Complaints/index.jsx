// import React, { useEffect, useState, useMemo } from "react";
// import moment from "moment";

// import {
//   Button,
//   message,
//   Modal,
//   Spin,
//   Switch,
//   Table,
//   DatePicker,
//   Select,
//   Drawer,
//   Space,
//   Divider,
//   Checkbox,
//   Radio,
//   Card,
//   Tag,
//   InputNumber,
//   Form,
//   Rate,
//   Tooltip,
// } from "antd";
// const { RangePicker } = DatePicker;
// const { Option } = Select;
// import { InputAdornment, MenuItem, TextField } from "@mui/material";
// import {
//   PlusOutlined,
//   SearchOutlined,
//   DownloadOutlined,
//   FilterOutlined,
//   ClearOutlined,
//   MessageOutlined,
//   EditOutlined,
//   CalendarOutlined,
//   CheckCircleOutlined,
//   ExclamationCircleOutlined,
// } from "@ant-design/icons";
// import { fetchData, postData } from "../../api/apiService";
// import { MdEdit } from "react-icons/md";
// import { FaUserDoctor } from "react-icons/fa6";
// // import AddDoctor from "./AddDoctor";
// import { PiGitBranchFill } from "react-icons/pi";
// import jsPDF from "jspdf";
// import * as XLSX from "xlsx";
// import autoTable from "jspdf-autotable";
// import TruncatedTextWithTooltip from "../../utils/TruncatedTextWithTooltip";
// import DocumentViewer from "../../utils/DocumentViewer";

// const Complaint = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [total, setTotal] = useState(1);
//   const [searchInput, setSearchInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedFilter, setSelectedFilter] = useState("-1");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [donation, setDonations] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [selectedDepartment, setSelectedDepartment] = useState(null);
//   const [selectedStatus, setSelectedStatus] = useState(null);
//   const [createdAtDateRange, setCreatedAtDateRange] = useState(null);
//   const [nextSyncDateRange, setNextSyncDateRange] = useState(null);
//   const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
//   const [downloadModalVisible, setDownloadModalVisible] = useState(false);
//   const [selectedColumns, setSelectedColumns] = useState([]);
//   const [downloadFormat, setDownloadFormat] = useState("excel");
//   const [messagesDrawerVisible, setMessagesDrawerVisible] = useState(false);
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [followupDays, setFollowupDays] = useState(null);
//   const [followupDaysModalVisible, setFollowupDaysModalVisible] =
//     useState(false);
//   const [followupDaysForm] = Form.useForm();
//   const [updatingFollowupDays, setUpdatingFollowupDays] = useState(false);

//   // Edit Next Follow-up Date (per complaint)
//   const UPDATE_NEXT_FOLLOW_UP_DATE_ENDPOINT =
//     "/api/complaint/updateNextFollowUpDate";
//   const [editNextFollowUpModalVisible, setEditNextFollowUpModalVisible] =
//     useState(false);
//   const [editNextFollowUpForm] = Form.useForm();
//   const [updatingNextFollowUpDate, setUpdatingNextFollowUpDate] =
//     useState(false);
//   const [
//     selectedComplaintForNextFollowUp,
//     setSelectedComplaintForNextFollowUp,
//   ] = useState(null);
//   const [defaultPickerDate, setDefaultPickerDate] = useState(moment());

//   // Escalate complaint to higher authority
//   const ESCALATE_COMPLAINT_ENDPOINT = "/api/admin/escalate-complaint";
//   const [escalatingComplaintId, setEscalatingComplaintId] = useState(null);
//   const [escalateModalVisible, setEscalateModalVisible] = useState(false);
//   const [selectedComplaintForEscalation, setSelectedComplaintForEscalation] =
//     useState(null);
//   const [authorities, setAuthorities] = useState([]);
//   const [loadingAuthorities, setLoadingAuthorities] = useState(false);
//   const [escalateForm] = Form.useForm();
//   const [approvingMessageId, setApprovingMessageId] = useState(null);

//   // Fetch departments
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const response = await postData("/api/admin/list-of-departments", {
//           page: "1",
//           pageSize: "100",
//         });
//         if (response?.responseCode === 200) {
//           // Handle both possible response structures
//           const departmentsData =
//             response?.data?.departments || response?.data || [];
//           setDepartments(Array.isArray(departmentsData) ? departmentsData : []);
//         }
//       } catch (error) {
//         message.error("Failed to fetch departments");
//         setDepartments([]);
//       }
//     };
//     fetchDepartments();
//   }, []);

//   // Fetch follow-up days
//   const fetchFollowupDays = async () => {
//     try {
//       // Assuming there's a GET endpoint, or we can fetch from a config endpoint
//       // For now, we'll try to fetch it. If endpoint doesn't exist, we'll handle it gracefully
//       const response = await fetchData("/api/admin/get-follow-up-days");
//       if (response?.responseCode === 200) {
//         const days = response?.data?.followUpDays || null;
//         setFollowupDays(days);
//         followupDaysForm.setFieldsValue({ followUpDays: days });
//       }
//     } catch (error) {
//       // If endpoint doesn't exist, we'll just set null and allow user to set it
//       console.log("Follow-up days endpoint may not exist yet");
//     }
//   };

//   // Update follow-up days
//   const handleUpdateFollowupDays = async (values) => {
//     try {
//       setUpdatingFollowupDays(true);
//       const response = await postData("/api/admin/update-follow-up-days", {
//         followUpDays: values.followUpDays,
//       });
//       if (response?.responseCode === 200) {
//         message.success("Follow-up days updated successfully!");
//         setFollowupDays(values.followUpDays);
//         setFollowupDaysModalVisible(false);
//       } else {
//         message.error(response?.message || "Failed to update follow-up days");
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to update follow-up days");
//     } finally {
//       setUpdatingFollowupDays(false);
//     }
//   };

//   // Open follow-up days modal and fetch current value
//   const handleOpenFollowupDaysModal = () => {
//     setFollowupDaysModalVisible(true);
//     followupDaysForm.setFieldsValue({ followUpDays: followupDays });
//     fetchFollowupDays();
//   };

//   const handleOpenNextFollowUpDateModal = (record) => {
//     setSelectedComplaintForNextFollowUp(record);

//     // Parse and set the date immediately
//     let dateValue = null;
//     let pickerDate = moment();

//     if (record?.nextFollowUpDate) {
//       // Parse the ISO string - moment handles ISO strings correctly
//       const parsedDate = moment(record.nextFollowUpDate);
//       if (parsedDate.isValid()) {
//         // Convert to YYYY-MM-DD format for native date input
//         dateValue = parsedDate.format("YYYY-MM-DD");
//         pickerDate = moment(parsedDate);
//       } else {
//         console.warn("Invalid date:", record.nextFollowUpDate);
//       }
//     }

//     setDefaultPickerDate(pickerDate);
//     setEditNextFollowUpModalVisible(true);

//     // Set form value immediately
//     editNextFollowUpForm.setFieldsValue({
//       date: dateValue,
//     });
//   };

//   // Reset form when modal closes
//   useEffect(() => {
//     if (!editNextFollowUpModalVisible) {
//       editNextFollowUpForm.resetFields();
//       setDefaultPickerDate(moment());
//       setSelectedComplaintForNextFollowUp(null);
//     }
//   }, [editNextFollowUpModalVisible, editNextFollowUpForm]);

//   const handleUpdateNextFollowUpDate = async (values) => {
//     const complaintId = selectedComplaintForNextFollowUp?._id;
//     if (!complaintId) {
//       message.error("Complaint ID not found");
//       return;
//     }

//     try {
//       setUpdatingNextFollowUpDate(true);

//       // Convert string date (YYYY-MM-DD) to ISO string
//       const dateISO = values?.date
//         ? moment(values.date).startOf("day").toISOString()
//         : null;

//       const response = await postData(UPDATE_NEXT_FOLLOW_UP_DATE_ENDPOINT, {
//         complaintId,
//         date: dateISO,
//       });

//       if (response?.responseCode === 200) {
//         message.success(response?.message || "Next follow-up date updated");

//         // Update current table data locally
//         setDonations((prev) =>
//           Array.isArray(prev)
//             ? prev.map((c) =>
//                 c?._id === complaintId ? { ...c, nextFollowUpDate: dateISO } : c
//               )
//             : prev
//         );

//         setEditNextFollowUpModalVisible(false);
//         editNextFollowUpForm.resetFields();
//         setSelectedComplaintForNextFollowUp(null);
//       } else {
//         message.error(
//           response?.message || "Failed to update next follow-up date"
//         );
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to update next follow-up date");
//     } finally {
//       setUpdatingNextFollowUpDate(false);
//     }
//   };

//   // Fetch authorities based on department
//   const fetchAuthorities = async (departmentId) => {
//     if (!departmentId) {
//       setAuthorities([]);
//       return;
//     }

//     try {
//       setLoadingAuthorities(true);
//       const response = await postData("/api/admin/list-of-authorities", {
//         departmentId,
//       });

//       if (response?.responseCode === 200) {
//         setAuthorities(response?.data?.authorities || []);
//       } else {
//         message.error(response?.message || "Failed to fetch authorities");
//         setAuthorities([]);
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to fetch authorities");
//       setAuthorities([]);
//     } finally {
//       setLoadingAuthorities(false);
//     }
//   };

//   const handleEscalateComplaint = (record) => {
//     const complaintId = record?._id;
//     if (!complaintId) {
//       message.error("Complaint ID not found");
//       return;
//     }

//     setSelectedComplaintForEscalation(record);
//     setEscalateModalVisible(true);

//     // Set default values
//     const defaultDepartmentId = record?.department?._id;
//     const defaultAuthorityId = record?.authorityId || record?.authority?._id;

//     // Set form values
//     escalateForm.setFieldsValue({
//       departmentId: defaultDepartmentId,
//       authorityId: defaultAuthorityId,
//     });

//     // Fetch authorities if department is available
//     if (defaultDepartmentId) {
//       fetchAuthorities(defaultDepartmentId);
//     } else {
//       setAuthorities([]);
//     }
//   };

//   const handleEscalateSubmit = async (values) => {
//     const complaintId = selectedComplaintForEscalation?._id;
//     if (!complaintId) {
//       message.error("Complaint ID not found");
//       return;
//     }

//     try {
//       setEscalatingComplaintId(complaintId);
//       const response = await postData(ESCALATE_COMPLAINT_ENDPOINT, {
//         complaintId,
//         departmentId: values.departmentId,
//         authorityId: values.authorityId,
//       });

//       if (response?.responseCode === 200) {
//         message.success(
//           response?.message || "Complaint escalated successfully"
//         );
//         setEscalateModalVisible(false);
//         escalateForm.resetFields();
//         setSelectedComplaintForEscalation(null);
//         setAuthorities([]);
//         await fetchUserList();
//       } else {
//         message.error(response?.message || "Failed to escalate complaint");
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to escalate complaint");
//     } finally {
//       setEscalatingComplaintId(null);
//     }
//   };

//   const handleDepartmentChange = (departmentId) => {
//     // Reset authority when department changes
//     escalateForm.setFieldsValue({ authorityId: undefined });
//     // Fetch authorities for the new department
//     fetchAuthorities(departmentId);
//   };

//   // Approve complaint message
//   const handleApproveMessage = async (complaintId, messageId) => {
//     if (!complaintId || !messageId) {
//       message.error("Complaint ID and Message ID are required");
//       return;
//     }

//     try {
//       setApprovingMessageId(messageId);
//       const response = await postData("/api/admin/approve-complaint-message", {
//         complaintId,
//         messageId,
//       });

//       if (response?.responseCode === 200) {
//         message.success(response?.message || "Message approved successfully");
//         // Update the selected complaint with the updated data
//         if (response?.data) {
//           setSelectedComplaint(response.data);
//         }
//         // Refresh the complaints list
//         await fetchUserList();
//       } else if (response?.responseCode === 400) {
//         message.error(response?.message || "complaintId is required");
//       } else if (response?.responseCode === 404) {
//         message.error(
//           response?.message || "Message not found in this complaint"
//         );
//       } else if (response?.responseCode === 403) {
//         message.error(response?.message || "Admin authorization required");
//       } else {
//         message.error(response?.message || "Failed to approve message");
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to approve message");
//     } finally {
//       setApprovingMessageId(null);
//     }
//   };

//   // Debounce search input to reduce API calls
//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       setSearchQuery(searchInput.trim());
//       setCurrentPage(1); // reset to first page on new search
//     }, 300); // 300ms delay

//     return () => clearTimeout(delayDebounceFn);
//   }, [searchInput]);

//   // Clear search when any filter is applied
//   useEffect(() => {
//     if (
//       selectedDepartment ||
//       selectedStatus ||
//       createdAtDateRange ||
//       nextSyncDateRange
//     ) {
//       setSearchInput("");
//       setSearchQuery("");
//     }
//   }, [
//     selectedDepartment,
//     selectedStatus,
//     createdAtDateRange,
//     nextSyncDateRange,
//   ]);

//   const complaintColumns = [
//     {
//       title: "S.No",
//       align: "center",
//       key: "index",
//       render: (_, __, index) => index + 1,
//     },
//     {
//       title: "User Name",
//       dataIndex: ["userId", "name"],
//       key: "name",
//       align: "center",
//       render: (name) => <span className="capitalize">{name || "N/A"}</span>,
//     },
//     {
//       title: "Email",
//       dataIndex: ["userId", "email"],
//       key: "email",
//       align: "center",
//       render: (email) => <span>{email || "N/A"}</span>,
//     },
//     {
//       title: "Phone",
//       dataIndex: ["userId", "phone"],
//       key: "phone",
//       align: "center",
//       render: (phone) => <span>{phone || "N/A"}</span>,
//     },
//     {
//       title: "Subject",
//       key: "subject",
//       align: "center",
//       render: (_, record) => (
//         <TruncatedTextWithTooltip
//           text={record?.messages?.[0]?.subject}
//           maxLength={30}
//           placeholder="N/A"
//         />
//       ),
//     },
//     {
//       title: "Department",
//       dataIndex: ["department", "name"],
//       key: "departmentName",
//       align: "center",
//       render: (departmentName) => departmentName || "N/A",
//     },
//     //authority name
//     {
//       title: "Authority Name",
//       dataIndex: ["authority", "name"],
//       key: "authorityName",
//       align: "center",
//       render: (authorityName) => authorityName || "N/A",
//     },
//     {
//       title: "Description",
//       key: "description",
//       align: "center",
//       render: (_, record) => (
//         <TruncatedTextWithTooltip
//           text={record?.messages?.[0]?.normalizedBody}
//           maxLength={30}
//           placeholder="N/A"
//         />
//       ),
//     },
//     {
//       title: "Total Messages",
//       key: "messageCount",
//       align: "center",
//       render: (_, record) => {
//         const messageCount = record?.messages?.length || 0;
//         const hasUnapproved = record?.hasUnapprovedMessages === true;

//         return (
//           <Tooltip
//             title={
//               hasUnapproved
//                 ? "This complaint has unapproved messages that need admin approval"
//                 : null
//             }
//             placement="top"
//           >
//             <Space>
//               <span
//                 style={{
//                   color: hasUnapproved ? "#ff4d4f" : "inherit",
//                   fontWeight: hasUnapproved ? 600 : "normal",
//                   backgroundColor: hasUnapproved ? "#fff1f0" : "transparent",
//                   padding: hasUnapproved ? "4px 8px" : "0",
//                   borderRadius: hasUnapproved ? "4px" : "0",
//                   border: hasUnapproved ? "1px solid #ffccc7" : "none",
//                 }}
//               >
//                 {messageCount}
//               </span>
//               {hasUnapproved && (
//                 <ExclamationCircleOutlined
//                   style={{
//                     color: "#ff4d4f",
//                     fontSize: "16px",
//                   }}
//                 />
//               )}
//             </Space>
//           </Tooltip>
//         );
//       },
//     },
//     {
//       title: "Department",
//       dataIndex: ["department", "name"],
//       key: "department",
//       align: "center",
//       render: (dept) => dept || "N/A",
//     },
//     {
//       title: "Officer",
//       dataIndex: "authorityName",
//       key: "officer",
//       align: "center",
//       render: (_, record) => {
//         // Get authority history from backend
//         const authorityHistory = record?.authorityHistory;

//         // If no authority history, return N/A
//         if (!Array.isArray(authorityHistory) || authorityHistory.length === 0) {
//           return "N/A";
//         }

//         // Sort authority history by level to ensure correct order
//         const sortedHistory = [...authorityHistory].sort(
//           (a, b) => (a?.level || 0) - (b?.level || 0)
//         );

//         // Get current officer name (from the latest/highest level)
//         const currentOfficer =
//           sortedHistory[sortedHistory.length - 1]?.levelName || "N/A";

//         // Get complaint level
//         const complaintLevel = record?.level;

//         // If level is 2 or 3, show history in tooltip
//         if (complaintLevel >= 2 && sortedHistory.length > 1) {
//           const historyText = sortedHistory
//             .map(
//               (history) =>
//                 `Level ${history.level}: ${history.levelName || "N/A"}`
//             )
//             .join("\n");

//           return (
//             <Tooltip
//               title={
//                 <div style={{ whiteSpace: "pre-line" }}>
//                   <strong>Officer History:</strong>
//                   <br />
//                   {historyText}
//                 </div>
//               }
//               placement="top"
//             >
//               <span style={{ cursor: "help", textDecoration: "underline" }}>
//                 {currentOfficer}
//               </span>
//             </Tooltip>
//           );
//         }

//         // For level 1, just show the officer name
//         return currentOfficer;
//       },
//     },
//     {
//       title: "Current Status",
//       dataIndex: "currentCase",
//       key: "currentCase",
//       align: "center",
//       render: (currentCase) => {
//         if (!currentCase) return "N/A";
//         // Replace underscores with spaces and capitalize each word
//         return currentCase
//           .replace(/_/g, " ")
//           .split(" ")
//           .map(
//             (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//           )
//           .join(" ");
//       },
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       align: "center",
//       render: (status) => status || "N/A",
//     },
//     // {
//     //   title: "Last Sync Time",
//     //   dataIndex: "lastSyncedAt",
//     //   key: "lastSyncedAt",
//     //   align: "center",
//     //   render: (date) =>
//     //     date ? moment(date).format("DD/MM/YYYY HH:mm") : "N/A",
//     // },
//     //updated at
//     {
//       title: "Last Updated",
//       dataIndex: "updatedAt",
//       key: "updatedAt",
//       align: "center",
//       render: (date) =>
//         date ? moment(date).format("DD/MM/YYYY HH:mm") : "N/A",
//     },
//     //next sync at
//     {
//       title: "Next Follow-up Date",
//       dataIndex: "nextFollowUpDate",
//       key: "nextFollowUpDate",
//       align: "center",
//       render: (_, record) => (
//         <Space direction="vertical" size={0} align="center">
//           <div>
//             {record?.nextFollowUpDate
//               ? moment(record.nextFollowUpDate).format("DD/MM/YYYY HH:mm")
//               : "N/A"}
//           </div>
//           <Button
//             type="link"
//             icon={<EditOutlined />}
//             onClick={() => handleOpenNextFollowUpDateModal(record)}
//           >
//             Edit
//           </Button>
//         </Space>
//       ),
//     },
//     {
//       title: "Created At",
//       dataIndex: "createdAt",
//       key: "createdAt",
//       align: "center",
//       render: (date) =>
//         date ? moment(date).format("DD/MM/YYYY HH:mm") : "N/A",
//     },
//     {
//       title: "Escalate",
//       key: "escalate",
//       align: "center",
//       render: (_, record) =>
//         record?.currentCase === "forwarded_to_higher_authority" ? (
//           <Button
//             type="primary"
//             danger
//             loading={escalatingComplaintId === record?._id}
//             onClick={() => handleEscalateComplaint(record)}
//           >
//             Escalate
//           </Button>
//         ) : (
//           "—"
//         ),
//     },
//     // Feedback column - display only rating as stars, details in tooltip
//     {
//       title: "Feedback",
//       key: "feedback",
//       align: "center",
//       render: (_, record) => {
//         const feedback = record?.feedback;
//         const rating = feedback?.rating || 0;

//         // Build tooltip content with all feedback details
//         const tooltipContent = feedback ? (
//           <div style={{ textAlign: "left" }}>
//             {feedback.rating > 0 && (
//               <div>
//                 <strong>Rating:</strong> {feedback.rating}/5
//               </div>
//             )}
//             {feedback.feedbackType && (
//               <div>
//                 <strong>Type:</strong> {feedback.feedbackType}
//               </div>
//             )}
//             {feedback.message && (
//               <div>
//                 <strong>Message:</strong> {feedback.message}
//               </div>
//             )}
//             {feedback.feedbackAt && (
//               <div>
//                 <strong>Date:</strong>{" "}
//                 {moment(feedback.feedbackAt).format("DD/MM/YYYY HH:mm")}
//               </div>
//             )}
//           </div>
//         ) : (
//           "No feedback"
//         );

//         return (
//           <Tooltip title={tooltipContent} placement="top">
//             <span style={{ fontSize: 16, fontWeight: 500 }}>{rating} ⭐</span>
//           </Tooltip>
//         );
//       },
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       align: "center",
//       render: (_, record) => {
//         const hasUnapproved = record?.hasUnapprovedMessages === true;

//         return (
//           <Tooltip
//             title={
//               hasUnapproved
//                 ? "This complaint has unapproved messages. Click to view and approve them."
//                 : "View Messages"
//             }
//             placement="top"
//           >
//             <Button
//               type="link"
//               icon={<MessageOutlined />}
//               onClick={() => {
//                 setSelectedComplaint(record);
//                 setMessagesDrawerVisible(true);
//               }}
//               style={{
//                 color: hasUnapproved ? "#ff4d4f" : undefined,
//                 fontWeight: hasUnapproved ? 600 : "normal",
//               }}
//             >
//               View Messages
//               {hasUnapproved && (
//                 <ExclamationCircleOutlined
//                   style={{
//                     color: "#ff4d4f",
//                     marginLeft: "4px",
//                     fontSize: "12px",
//                   }}
//                 />
//               )}
//             </Button>
//           </Tooltip>
//         );
//       },
//     },
//   ];

//   const availableColumns = useMemo(
//     () => [
//       { key: "sno", title: "S.No", dataKey: "index" },
//       { key: "name", title: "User Name", dataKey: "name" },
//       { key: "email", title: "Email", dataKey: "email" },
//       { key: "phone", title: "Phone", dataKey: "phone" },
//       { key: "subject", title: "Subject", dataKey: "subject" },
//       { key: "description", title: "Description", dataKey: "description" },
//       { key: "messageCount", title: "Total Messages", dataKey: "messageCount" },
//       { key: "department", title: "Department", dataKey: "department" },
//       { key: "officer", title: "Officer", dataKey: "officer" },
//       { key: "lastSynced", title: "Last Sync Time", dataKey: "lastSyncedAt" },
//       { key: "updatedAt", title: "Last Updated", dataKey: "updatedAt" },
//       {
//         key: "nextSyncAt",
//         title: "Next Follow-up Date",
//         dataKey: "nextFollowUpDate",
//       },
//       { key: "createdAt", title: "Created At", dataKey: "createdAt" },
//     ],
//     []
//   );

//   // Initialize selected columns when modal opens
//   useEffect(() => {
//     if (downloadModalVisible) {
//       setSelectedColumns(availableColumns.map((col) => col.key));
//     }
//   }, [downloadModalVisible, availableColumns]);

//   const fetchUserList = async () => {
//     const payload = {
//       page: currentPage,
//       pageSize: pageSize,
//       search: searchQuery || undefined,
//       sortBy: selectedFilter,
//       department: selectedDepartment?._id || undefined,
//       status: selectedStatus || undefined,
//       createdAtFrom:
//         createdAtDateRange && createdAtDateRange[0]
//           ? createdAtDateRange[0].format("YYYY-MM-DD")
//           : undefined,
//       createdAtTo:
//         createdAtDateRange && createdAtDateRange[1]
//           ? createdAtDateRange[1].format("YYYY-MM-DD")
//           : undefined,
//       nextSyncFrom:
//         nextSyncDateRange && nextSyncDateRange[0]
//           ? nextSyncDateRange[0].format("YYYY-MM-DD")
//           : undefined,
//       nextSyncTo:
//         nextSyncDateRange && nextSyncDateRange[1]
//           ? nextSyncDateRange[1].format("YYYY-MM-DD")
//           : undefined,
//     };
//     try {
//       setLoading(true);
//       const response = await postData("/api/admin/list-of-complaints", payload);
//       if (response?.responseCode == 200) {
//         setDonations(response?.data?.complaints || []);
//         setTotal(response?.data?.totalComplaints || 1);
//       } else if (response?.responseCode == 400) {
//         message.error(response?.message || "Something went wrong");
//       } else {
//         message.error(response?.message || "Something went wrong");
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to fetch complaints List");
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
//     selectedDepartment,
//     selectedStatus,
//     createdAtDateRange,
//     nextSyncDateRange,
//   ]);

//   const handleClearFilters = () => {
//     setSelectedDepartment(null);
//     setSelectedStatus(null);
//     setCreatedAtDateRange(null);
//     setNextSyncDateRange(null);
//     setSelectedFilter("-1");
//     setSearchInput("");
//     setSearchQuery("");
//     setCurrentPage(1);
//   };

//   const hasActiveFilters = () => {
//     return (
//       selectedDepartment ||
//       selectedStatus ||
//       createdAtDateRange ||
//       nextSyncDateRange ||
//       selectedFilter !== "-1"
//     );
//   };

//   // Get column value helper
//   const getColumnValue = (complaint, columnKey, index) => {
//     switch (columnKey) {
//       case "sno":
//         return index + 1;
//       case "name":
//         return complaint?.userId?.name || "N/A";
//       case "email":
//         return complaint?.userId?.email || "N/A";
//       case "phone":
//         return complaint?.userId?.phone || "N/A";
//       case "subject":
//         return complaint?.messages?.[0]?.subject || "N/A";
//       case "description":
//         return complaint?.messages?.[0]?.body || "N/A";
//       case "messageCount":
//         return complaint?.messages?.length || 0;
//       case "department":
//         return complaint?.department?.name || "N/A";
//       case "officer":
//         return complaint?.authorityName || "N/A";
//       case "lastSynced":
//         return complaint?.lastSyncedAt
//           ? moment(complaint.lastSyncedAt).format("DD/MM/YYYY HH:mm")
//           : "N/A";
//       case "updatedAt":
//         return complaint?.updatedAt
//           ? moment(complaint.updatedAt).format("DD/MM/YYYY HH:mm")
//           : "N/A";
//       case "nextSyncAt":
//         return complaint?.nextFollowUpDate
//           ? moment(complaint.nextFollowUpDate).format("DD/MM/YYYY HH:mm")
//           : "N/A";
//       case "createdAt":
//         return complaint?.createdAt
//           ? moment(complaint.createdAt).format("DD/MM/YYYY HH:mm")
//           : "N/A";
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
//     XLSX.utils.book_append_sheet(wb, ws, "Complaints");

//     // Generate Excel file
//     XLSX.writeFile(
//       wb,
//       `complaints_${moment().format("YYYY-MM-DD_HH-mm-ss")}.xlsx`
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
//     doc.text("Complaints List", 14, 15);

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

//     doc.save(`complaints_${moment().format("YYYY-MM-DD_HH-mm-ss")}.pdf`);
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
//         search: searchQuery || undefined,
//         sortBy: selectedFilter,
//         department: selectedDepartment?.departmentId || undefined,
//         status: selectedStatus || undefined,
//         createdAtFrom:
//           createdAtDateRange && createdAtDateRange[0]
//             ? createdAtDateRange[0].format("YYYY-MM-DD")
//             : undefined,
//         createdAtTo:
//           createdAtDateRange && createdAtDateRange[1]
//             ? createdAtDateRange[1].format("YYYY-MM-DD")
//             : undefined,
//         nextSyncFrom:
//           nextSyncDateRange && nextSyncDateRange[0]
//             ? nextSyncDateRange[0].format("YYYY-MM-DD")
//             : undefined,
//         nextSyncTo:
//           nextSyncDateRange && nextSyncDateRange[1]
//             ? nextSyncDateRange[1].format("YYYY-MM-DD")
//             : undefined,
//       };

//       const response = await postData("/api/admin/list-of-complaints", payload);

//       if (response?.responseCode === 200) {
//         const data = response?.data?.complaints || [];

//         if (data.length === 0) {
//           message.warning("No complaint data available to download.");
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
//       message.error(error?.message || "Failed to download complaints");
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
//               onKeyDown={(e) =>
//                 e.key === "Enter" && setSearchQuery(searchInput.trim())
//               }
//               type="search"
//               className="w-[350px]"
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <SearchOutlined
//                       className="cursor-pointer"
//                       onClick={() => setSearchQuery(searchInput.trim())}
//                     />
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
//                       selectedDepartment,
//                       selectedStatus,
//                       createdAtDateRange,
//                       nextSyncDateRange,
//                       selectedFilter !== "-1",
//                     ].filter(Boolean).length
//                   }
//                 </span>
//               )}
//             </div>

//             <Button
//               type="default"
//               icon={<CalendarOutlined />}
//               onClick={handleOpenFollowupDaysModal}
//               className="h-[36px] w-[36px] p-0"
//               title="Follow-up Days"
//             />

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
//                   <div className="grid grid-cols-2 gap-4">
//                     {/* Department Filter */}
//                     <div>
//                       <label className="block text-sm font-medium mb-2">
//                         Department
//                       </label>
//                       <Select
//                         placeholder="Select Department"
//                         allowClear
//                         style={{ width: "100%" }}
//                         size="large"
//                         value={selectedDepartment?.departmentId || null}
//                         onChange={(value) => {
//                           const selected = departments.find(
//                             (dept) => dept.departmentId === value
//                           );
//                           setSelectedDepartment(selected || null);
//                           setCurrentPage(1);
//                         }}
//                       >
//                         {Array.isArray(departments) &&
//                           departments.map((dept) => (
//                             <Option key={dept._id} value={dept.departmentId}>
//                               {dept.name}
//                             </Option>
//                           ))}
//                       </Select>
//                     </div>

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
//                         <Option value="in-progress">In Progress</Option>
//                         <Option value="resolved">Resolved</Option>
//                         <Option value="closed">Closed</Option>
//                         <Option value="escalated">Escalated</Option>
//                       </Select>
//                     </div>

//                     {/* Created At Date Range */}
//                     <div className="col-span-2">
//                       <label className="block text-sm font-medium mb-2">
//                         Created At (Date Range)
//                       </label>
//                       <RangePicker
//                         placeholder={["Start Date", "End Date"]}
//                         allowClear
//                         style={{ width: "100%" }}
//                         size="large"
//                         format="YYYY-MM-DD"
//                         value={createdAtDateRange}
//                         onChange={(dates) => {
//                           setCreatedAtDateRange(dates);
//                           setCurrentPage(1);
//                         }}
//                       />
//                     </div>

//                     {/* Next Sync Date Range */}
//                     <div className="col-span-2">
//                       <label className="block text-sm font-medium mb-2">
//                         Next Sync Date (Date Range)
//                       </label>
//                       <RangePicker
//                         placeholder={["Start Date", "End Date"]}
//                         allowClear
//                         style={{ width: "100%" }}
//                         size="large"
//                         format="YYYY-MM-DD"
//                         value={nextSyncDateRange}
//                         onChange={(dates) => {
//                           setNextSyncDateRange(dates);
//                           setCurrentPage(1);
//                         }}
//                       />
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
//         <div className="max-h-[80dvh] overflow-y-auto pr-1">
//           <Table
//             columns={complaintColumns}
//             dataSource={donation}
//             locale={{
//               emptyText: (
//                 <div style={{ color: "black" }}>
//                   {searchQuery
//                     ? "No Complaints Found"
//                     : "No Complaints available"}
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

//         {/* Messages Drawer */}
//         <Drawer
//           title={
//             <div>
//               <span className="text-lg font-semibold">Complaint Messages</span>
//               {selectedComplaint && (
//                 <div
//                   style={{
//                     marginTop: "8px",
//                     fontSize: "14px",
//                     color: "#8c8c8c",
//                   }}
//                 >
//                   <div>
//                     <strong>User:</strong>{" "}
//                     {selectedComplaint?.userId?.name || "N/A"}
//                   </div>
//                   <div>
//                     <strong>Department:</strong>{" "}
//                     {selectedComplaint?.department?.name || "N/A"}
//                   </div>
//                   <div>
//                     <strong>Authority:</strong>{" "}
//                     {selectedComplaint?.authority?.name || "N/A"}
//                   </div>
//                   <div>
//                     <strong>Status:</strong>{" "}
//                     <Tag
//                       color={
//                         selectedComplaint?.status === "resolved"
//                           ? "green"
//                           : "orange"
//                       }
//                     >
//                       {selectedComplaint?.status || "N/A"}
//                     </Tag>
//                   </div>
//                 </div>
//               )}
//             </div>
//           }
//           placement="right"
//           onClose={() => {
//             setMessagesDrawerVisible(false);
//             setSelectedComplaint(null);
//           }}
//           open={messagesDrawerVisible}
//           width={600}
//         >
//           <div style={{ padding: "8px 0" }}>
//             {selectedComplaint?.messages &&
//             selectedComplaint.messages.length > 0 ? (
//               <Space
//                 direction="vertical"
//                 size="middle"
//                 style={{ width: "100%" }}
//               >
//                 {selectedComplaint.messages.map((msg, index) => (
//                   <Card
//                     key={msg._id}
//                     size="small"
//                     style={{
//                       backgroundColor: index % 2 === 0 ? "#fafafa" : "#ffffff",
//                       border: "1px solid #e8e8e8",
//                       borderRadius: "8px",
//                     }}
//                   >
//                     <Space
//                       direction="vertical"
//                       size="small"
//                       style={{ width: "100%" }}
//                     >
//                       {/* Header Row - To, Date, and Approve Button */}
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "flex-start",
//                           flexWrap: "wrap",
//                           gap: "8px",
//                         }}
//                       >
//                         <div style={{ flex: 1, minWidth: "200px" }}>
//                           <div>
//                             <span
//                               style={{
//                                 fontWeight: 600,
//                                 color: "#595959",
//                                 fontSize: "13px",
//                               }}
//                             >
//                               To:{" "}
//                             </span>
//                             <span style={{ fontSize: "13px" }}>
//                               {msg.to || "N/A"}
//                             </span>
//                           </div>
//                         </div>
//                         <Space>
//                           {msg.isAdminApproved === false && (
//                             <Button
//                               type="primary"
//                               size="small"
//                               icon={<CheckCircleOutlined />}
//                               loading={
//                                 approvingMessageId ===
//                                 (msg.messageId || msg._id)
//                               }
//                               onClick={() =>
//                                 handleApproveMessage(
//                                   selectedComplaint._id,
//                                   msg.messageId || msg._id
//                                 )
//                               }
//                               style={{ fontSize: "12px" }}
//                             >
//                               Approve
//                             </Button>
//                           )}
//                           {msg.isAdminApproved === true && (
//                             <Tag color="green" style={{ fontSize: "12px" }}>
//                               Approved
//                             </Tag>
//                           )}
//                           <Tag color="blue" style={{ fontSize: "12px" }}>
//                             {moment(msg.date).format("DD/MM/YYYY HH:mm")}
//                           </Tag>
//                         </Space>
//                       </div>

//                       <Divider style={{ margin: "8px 0" }} />

//                       {/* Body */}
//                       {msg.normalizedBody && (
//                         <div>
//                           <span
//                             style={{
//                               fontWeight: 600,
//                               color: "#595959",
//                               fontSize: "13px",
//                               display: "block",
//                               marginBottom: "4px",
//                             }}
//                           >
//                             Body:
//                           </span>
//                           <div
//                             style={{
//                               fontSize: "13px",
//                               color: "#262626",
//                               whiteSpace: "pre-wrap",
//                               wordBreak: "break-word",
//                             }}
//                           >
//                             {msg.normalizedBody || msg.body}
//                           </div>
//                         </div>
//                       )}

//                       {/* Attachments */}
//                       {msg.attachments && msg.attachments.length > 0 && (
//                         <div>
//                           <span
//                             style={{
//                               fontWeight: 600,
//                               color: "#595959",
//                               fontSize: "13px",
//                               display: "block",
//                               marginBottom: "8px",
//                             }}
//                           >
//                             Attachments:
//                           </span>
//                           <DocumentViewer
//                             documents={msg.attachments.map(
//                               (att) => att.url || att.link || att
//                             )}
//                             size="small"
//                             showActions={true}
//                             emptyMessage="No attachments available"
//                             filterInvalidUrls={true}
//                           />
//                         </div>
//                       )}
//                     </Space>
//                   </Card>
//                 ))}
//               </Space>
//             ) : (
//               <div
//                 style={{
//                   padding: "40px",
//                   textAlign: "center",
//                   color: "#999",
//                 }}
//               >
//                 No messages available
//               </div>
//             )}
//           </div>
//         </Drawer>

//         {/* Follow-up Days Modal */}
//         <Modal
//           title={
//             <div className="flex items-center gap-2">
//               <CalendarOutlined className="text-blue-500" />
//               <span>Follow-up Days Configuration</span>
//             </div>
//           }
//           centered
//           open={followupDaysModalVisible}
//           onCancel={() => {
//             setFollowupDaysModalVisible(false);
//             followupDaysForm.resetFields();
//           }}
//           footer={null}
//           width={500}
//         >
//           <Form
//             form={followupDaysForm}
//             layout="vertical"
//             onFinish={handleUpdateFollowupDays}
//             className="mt-4"
//           >
//             <Form.Item
//               label="Follow-up Days"
//               name="followUpDays"
//               rules={[
//                 { required: true, message: "Please enter follow-up days!" },
//                 {
//                   type: "number",
//                   min: 1,
//                   message: "Follow-up days must be at least 1",
//                 },
//                 {
//                   type: "number",
//                   max: 365,
//                   message: "Follow-up days cannot exceed 365",
//                 },
//               ]}
//               help="Number of days before the next follow-up is scheduled"
//             >
//               <InputNumber
//                 placeholder="Enter follow-up days (e.g., 10)"
//                 min={1}
//                 max={365}
//                 style={{ width: "100%" }}
//                 size="large"
//               />
//             </Form.Item>

//             {followupDays !== null && (
//               <div className="mb-4 p-3 bg-gray-50 rounded-lg">
//                 <div className="text-sm text-gray-600">
//                   Current Value: <strong>{followupDays} days</strong>
//                 </div>
//               </div>
//             )}

//             <div className="flex justify-end gap-3 mt-6">
//               <Button
//                 onClick={() => {
//                   setFollowupDaysModalVisible(false);
//                   followupDaysForm.resetFields();
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 loading={updatingFollowupDays}
//                 icon={<EditOutlined />}
//               >
//                 Update
//               </Button>
//             </div>
//           </Form>
//         </Modal>

//         {/* Edit Next Follow-up Date Modal */}
//         <Modal
//           title={
//             <div className="flex items-center gap-2">
//               <EditOutlined className="text-blue-500" />
//               <span>Edit Next Follow-up Date</span>
//             </div>
//           }
//           centered
//           open={editNextFollowUpModalVisible}
//           onCancel={() => {
//             setEditNextFollowUpModalVisible(false);
//             editNextFollowUpForm.resetFields();
//             setSelectedComplaintForNextFollowUp(null);
//           }}
//           footer={null}
//           width={520}
//         >
//           <div className="mb-3 text-sm text-gray-600">
//             <div>
//               <strong>Complaint:</strong>{" "}
//               {selectedComplaintForNextFollowUp?._id || "N/A"}
//             </div>
//             <div>
//               <strong>User:</strong>{" "}
//               {selectedComplaintForNextFollowUp?.userId?.name || "N/A"}
//             </div>
//           </div>

//           <Form
//             form={editNextFollowUpForm}
//             layout="vertical"
//             onFinish={handleUpdateNextFollowUpDate}
//           >
//             <Form.Item
//               label="Next Follow-up Date"
//               name="date"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please select next follow-up date!",
//                 },
//               ]}
//             >
//               <input
//                 type="date"
//                 style={{
//                   width: "100%",
//                   padding: "8px 12px",
//                   border: "1px solid #d9d9d9",
//                   borderRadius: "6px",
//                   fontSize: "14px",
//                 }}
//                 placeholder="Select Next Follow-up Date"
//               />
//             </Form.Item>

//             <div className="flex justify-end gap-3 mt-6">
//               <Button
//                 onClick={() => {
//                   setEditNextFollowUpModalVisible(false);
//                   editNextFollowUpForm.resetFields();
//                   setSelectedComplaintForNextFollowUp(null);
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 loading={updatingNextFollowUpDate}
//               >
//                 Save
//               </Button>
//             </div>
//           </Form>
//         </Modal>

//         {/* Escalate Complaint Modal */}
//         <Modal
//           title={
//             <div className="flex items-center gap-2">
//               <EditOutlined className="text-red-500" />
//               <span>Escalate Complaint to Higher Authority</span>
//             </div>
//           }
//           centered
//           open={escalateModalVisible}
//           onCancel={() => {
//             setEscalateModalVisible(false);
//             escalateForm.resetFields();
//             setSelectedComplaintForEscalation(null);
//             setAuthorities([]);
//           }}
//           footer={null}
//           width={700}
//         >
//           {/* Complaint Details */}
//           {selectedComplaintForEscalation && (
//             <div className="mb-4 p-4 bg-gray-50 rounded-lg">
//               <h4 className="text-base font-semibold mb-3">
//                 Complaint Details
//               </h4>
//               <div className="grid grid-cols-2 gap-3 text-sm">
//                 <div>
//                   <strong>Complaint ID:</strong>{" "}
//                   {selectedComplaintForEscalation?._id || "N/A"}
//                 </div>
//                 <div>
//                   <strong>User Name:</strong>{" "}
//                   {selectedComplaintForEscalation?.userId?.name || "N/A"}
//                 </div>
//                 <div>
//                   <strong>Email:</strong>{" "}
//                   {selectedComplaintForEscalation?.userId?.email || "N/A"}
//                 </div>
//                 <div>
//                   <strong>Phone:</strong>{" "}
//                   {selectedComplaintForEscalation?.userId?.phone || "N/A"}
//                 </div>
//                 <div>
//                   <strong>Subject:</strong>{" "}
//                   {selectedComplaintForEscalation?.messages?.[0]?.subject ||
//                     "N/A"}
//                 </div>
//                 <div>
//                   <strong>Current Department:</strong>{" "}
//                   {selectedComplaintForEscalation?.department?.name || "N/A"}
//                 </div>
//                 <div>
//                   <strong>Current Officer:</strong>{" "}
//                   {selectedComplaintForEscalation?.authorityName || "N/A"}
//                 </div>
//                 <div>
//                   <strong>Status:</strong>{" "}
//                   <Tag
//                     color={
//                       selectedComplaintForEscalation?.status === "resolved"
//                         ? "green"
//                         : "orange"
//                     }
//                   >
//                     {selectedComplaintForEscalation?.status || "N/A"}
//                   </Tag>
//                 </div>
//               </div>
//             </div>
//           )}

//           <Form
//             form={escalateForm}
//             layout="vertical"
//             onFinish={handleEscalateSubmit}
//           >
//             <Form.Item
//               label="Department"
//               name="departmentId"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please select a department!",
//                 },
//               ]}
//             >
//               <Select
//                 placeholder="Select Department"
//                 size="large"
//                 onChange={handleDepartmentChange}
//                 loading={loading}
//               >
//                 {Array.isArray(departments) &&
//                   departments.map((dept) => (
//                     <Option key={dept._id} value={dept._id}>
//                       {dept.name}
//                     </Option>
//                   ))}
//               </Select>
//             </Form.Item>

//             <Form.Item
//               label="Authority"
//               name="authorityId"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please select an authority!",
//                 },
//               ]}
//             >
//               <Select
//                 placeholder="Select Authority"
//                 size="large"
//                 loading={loadingAuthorities}
//                 disabled={!escalateForm.getFieldValue("departmentId")}
//               >
//                 {Array.isArray(authorities) &&
//                   authorities.map((authority) => (
//                     <Option key={authority._id} value={authority._id}>
//                       {authority.name || "N/A"}
//                     </Option>
//                   ))}
//               </Select>
//             </Form.Item>

//             <div className="flex justify-end gap-3 mt-6">
//               <Button
//                 onClick={() => {
//                   setEscalateModalVisible(false);
//                   escalateForm.resetFields();
//                   setSelectedComplaintForEscalation(null);
//                   setAuthorities([]);
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="primary"
//                 danger
//                 htmlType="submit"
//                 loading={
//                   escalatingComplaintId === selectedComplaintForEscalation?._id
//                 }
//               >
//                 Escalate
//               </Button>
//             </div>
//           </Form>
//         </Modal>
//       </div>
//     </Spin>
//   );
// };

// export default Complaint;
