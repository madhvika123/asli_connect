// import React, { useEffect, useState } from "react";
// import moment from "moment";
// import {
//   Button,
//   message,
//   Modal,
//   Spin,
//   Table,
//   DatePicker,
//   Select,
//   Drawer,
//   Space,
//   Divider,
//   Checkbox,
//   Radio,
//   InputNumber,
// } from "antd";

// const { RangePicker } = DatePicker;
// import { InputAdornment, TextField } from "@mui/material";
// import {
//   SearchOutlined,
//   DownloadOutlined,
//   FilterOutlined,
//   ClearOutlined,
// } from "@ant-design/icons";
// import { postData } from "../../api/apiService";
// import jsPDF from "jspdf";
// import * as XLSX from "xlsx";
// import autoTable from "jspdf-autotable";

// const { Option } = Select;

// const Donations = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [total, setTotal] = useState(1);
//   const [searchInput, setSearchInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedFilter, setSelectedFilter] = useState("0");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [donation, setDonations] = useState([]);
//   const [dateRange, setDateRange] = useState(null);
//   const [selectedGender, setSelectedGender] = useState(null);
//   const [minAmount, setMinAmount] = useState(null);
//   const [maxAmount, setMaxAmount] = useState(null);
//   const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
//   const [downloadModalVisible, setDownloadModalVisible] = useState(false);
//   const [selectedColumns, setSelectedColumns] = useState([]);
//   const [downloadFormat, setDownloadFormat] = useState("excel");

//   // Debounce search input to reduce API calls
//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       setSearchQuery(searchInput.trim());
//       setCurrentPage(1); // reset to first page on new search
//     }, 500); // 500ms delay

//     return () => clearTimeout(delayDebounceFn);
//   }, [searchInput]);

//   // Clear search when any filter is applied
//   useEffect(() => {
//     if (
//       dateRange ||
//       selectedGender ||
//       minAmount !== null ||
//       maxAmount !== null
//     ) {
//       setSearchInput("");
//       setSearchQuery("");
//     }
//   }, [dateRange, selectedGender, minAmount, maxAmount]);

//   const donationColumns = [
//     {
//       title: "S.No",
//       align: "center",
//       key: "index",
//       render: (_, __, index) => index + 1,
//     },
//     {
//       title: "Donor Name",
//       dataIndex: ["user", "name"],
//       key: "name",
//       align: "center",
//       render: (name) => <span className="capitalize">{name || "N/A"}</span>,
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
//       dataIndex: ["user", "phone"],
//       key: "phone",
//       align: "center",
//       render: (phone) => <span>{phone || "N/A"}</span>,
//     },
//     {
//       title: "Gender",
//       dataIndex: ["user", "gender"],
//       key: "gender",
//       align: "center",
//       render: (gender) => <span>{gender || "N/A"}</span>,
//     },
//     {
//       title: "Amount",
//       dataIndex: "amount",
//       key: "amount",
//       align: "center",
//       render: (amount, record) => (
//         <span>
//           {record.currency || ""} {amount || "0"}
//         </span>
//       ),
//     },
//     {
//       title: "Purpose",
//       dataIndex: "purpose",
//       key: "purpose",
//       align: "center",
//       // render: (purpose) => <span>{purpose || "N/A"}</span>,
//       render: (purpose) => {
//         const displayName = purpose ? purpose.slice(0, 16) : "User";
//         return (
//           <span className="capitalize" title={purpose || "User"}>
//             {displayName}
//             {purpose && purpose.length > 16 ? "..." : ""}
//           </span>
//         );
//       },
//     },
//     {
//       title: "Date",
//       dataIndex: "createdAt",
//       key: "createdAt",
//       align: "center",
//       render: (createdAt) =>
//         createdAt ? moment(createdAt).format("DD/MM/YYYY") : "N/A",
//     },
//   ];

//   const availableColumns = [
//     { key: "sno", title: "S.No", dataKey: "index" },
//     { key: "name", title: "Donor Name", dataKey: ["user", "name"] },
//     { key: "email", title: "Email", dataKey: ["user", "email"] },
//     { key: "phone", title: "Phone", dataKey: ["user", "phone"] },
//     { key: "gender", title: "Gender", dataKey: ["user", "gender"] },
//     { key: "amount", title: "Amount", dataKey: "amount" },
//     { key: "purpose", title: "Purpose", dataKey: "purpose" },
//     { key: "date", title: "Date", dataKey: "createdAt" },
//   ];

//   const fetchUserList = async () => {
//     const payload = {
//       page: currentPage,
//       pageSize: pageSize,
//       search: searchQuery || undefined,
//       sortBy: selectedFilter,
//       minAmount: minAmount !== null ? minAmount : undefined,
//       maxAmount: maxAmount !== null ? maxAmount : undefined,
//       startDate:
//         dateRange && dateRange[0]
//           ? dateRange[0].format("YYYY-MM-DD")
//           : undefined,
//       endDate:
//         dateRange && dateRange[1]
//           ? dateRange[1].format("YYYY-MM-DD")
//           : undefined,
//       gender: selectedGender ? selectedGender.toLowerCase() : undefined,
//     };
//     try {
//       setLoading(true);
//       const response = await postData("/api/admin/list-of-donations", payload);
//       if (response?.responseCode == 200) {
//         setDonations(response?.data?.donations || []);
//         setTotal(response?.data?.totalDonations || 1);
//       } else if (response?.responseCode == 400) {
//         message.error(response?.message || "Something went wrong");
//       } else {
//         message.error(response?.message || "Something went wrong");
//       }
//     } catch (error) {
//       message.error(error?.message || "Failed to fetch donations list");
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
//     dateRange,
//     selectedGender,
//     minAmount,
//     maxAmount,
//   ]);

//   // Initialize selected columns when modal opens
//   useEffect(() => {
//     if (downloadModalVisible) {
//       setSelectedColumns(availableColumns.map((col) => col.key));
//     }
//   }, [downloadModalVisible]);

//   const handleSearch = () => {
//     setCurrentPage(1);
//     setSearchQuery(searchInput.trim());
//   };

//   const handleClearFilters = () => {
//     setDateRange(null);
//     setSelectedGender(null);
//     setMinAmount(null);
//     setMaxAmount(null);
//     setSelectedFilter("0");
//     setSearchInput("");
//     setSearchQuery("");
//     setCurrentPage(1);
//   };

//   const hasActiveFilters = () => {
//     return (
//       dateRange ||
//       selectedGender ||
//       minAmount !== null ||
//       maxAmount !== null ||
//       selectedFilter !== "0"
//     );
//   };

//   // Get column value helper
//   const getColumnValue = (item, columnKey, index) => {
//     switch (columnKey) {
//       case "sno":
//         return index + 1;
//       case "name":
//         return item?.user?.name || "N/A";
//       case "email":
//         return item?.user?.email || "N/A";
//       case "phone":
//         return item?.user?.phone || "N/A";
//       case "gender":
//         return item?.user?.gender || "N/A";
//       case "amount":
//         return `${item?.currency || ""} ${item?.amount || "0"}`;
//       case "purpose":
//         return item?.purpose || "N/A";
//       case "date":
//         return item?.createdAt
//           ? moment(item.createdAt).format("DD/MM/YYYY")
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
//     XLSX.utils.book_append_sheet(wb, ws, "Donations");

//     // Generate Excel file
//     XLSX.writeFile(
//       wb,
//       `donations_${moment().format("YYYY-MM-DD_HH-mm-ss")}.xlsx`
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
//     doc.text("Donations List", 14, 15);

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

//     doc.save(`donations_${moment().format("YYYY-MM-DD_HH-mm-ss")}.pdf`);
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
//         pageSize: total,
//         search: searchQuery || undefined,
//         sortBy: selectedFilter,
//         minAmount: minAmount !== null ? minAmount : undefined,
//         maxAmount: maxAmount !== null ? maxAmount : undefined,
//         startDate:
//           dateRange && dateRange[0]
//             ? dateRange[0].format("YYYY-MM-DD")
//             : undefined,
//         endDate:
//           dateRange && dateRange[1]
//             ? dateRange[1].format("YYYY-MM-DD")
//             : undefined,
//         gender: selectedGender ? selectedGender.toLowerCase() : undefined,
//       };

//       const response = await postData("/api/admin/list-of-donations", payload);

//       if (response?.responseCode === 200) {
//         const data = response?.data?.donations || [];

//         if (data.length === 0) {
//           message.warning("No donation data available to download.");
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
//       message.error(error?.message || "Failed to download donations");
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
//               onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//               type="search"
//               className="w-[350px]"
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <SearchOutlined
//                       className="cursor-pointer"
//                       onClick={handleSearch}
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
//                       dateRange,
//                       selectedGender,
//                       minAmount !== null,
//                       maxAmount !== null,
//                       selectedFilter !== "0",
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
//                     <Option value="0">Newest First</Option>
//                     <Option value="1">Oldest First</Option>
//                   </Select>
//                 </div>

//                 <Divider className="my-2" />

//                 {/* Filters Section */}
//                 <div>
//                   <h4 className="text-base font-semibold mb-3">Filters</h4>
//                   <div className="grid grid-cols-2 gap-4">
//                     {/* Date Range */}
//                     <div className="col-span-2">
//                       <label className="block text-sm font-medium mb-2">
//                         Date Range
//                       </label>
//                       <RangePicker
//                         placeholder={["Start Date", "End Date"]}
//                         allowClear
//                         style={{ width: "100%" }}
//                         size="large"
//                         format="YYYY-MM-DD"
//                         value={dateRange}
//                         onChange={(dates) => {
//                           setDateRange(dates);
//                           setCurrentPage(1);
//                         }}
//                       />
//                     </div>

//                     {/* Gender Filter */}
//                     <div>
//                       <label className="block text-sm font-medium mb-2">
//                         Gender
//                       </label>
//                       <Select
//                         placeholder="Select Gender"
//                         allowClear
//                         style={{ width: "100%" }}
//                         size="large"
//                         value={selectedGender}
//                         onChange={(value) => {
//                           setSelectedGender(value);
//                           setCurrentPage(1);
//                         }}
//                       >
//                         <Option value="male">Male</Option>
//                         <Option value="female">Female</Option>
//                         <Option value="other">Other</Option>
//                       </Select>
//                     </div>

//                     {/* Amount Range Filter */}
//                     <div className="col-span-2">
//                       <label className="block text-sm font-medium mb-2">
//                         Amount Range
//                       </label>
//                       <div className="flex items-center gap-2">
//                         <InputNumber
//                           placeholder="Min Amount"
//                           min={0}
//                           style={{ width: "100%" }}
//                           size="large"
//                           value={minAmount}
//                           onChange={(value) => {
//                             setMinAmount(value);
//                             setCurrentPage(1);
//                           }}
//                         />
//                         <span className="text-gray-500">to</span>
//                         <InputNumber
//                           placeholder="Max Amount"
//                           min={0}
//                           style={{ width: "100%" }}
//                           size="large"
//                           value={maxAmount}
//                           onChange={(value) => {
//                             setMaxAmount(value);
//                             setCurrentPage(1);
//                           }}
//                         />
//                       </div>
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

//         <div className="text-black [&_*]:text-black">
//           <Table
//             columns={donationColumns}
//             dataSource={donation}
//             locale={{
//               emptyText: (
//                 <div style={{ color: "black" }}>
//                   {searchQuery || hasActiveFilters()
//                     ? "No Donations Found"
//                     : "No Donations available"}
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
//       </div>

//       {/* Download Modal */}
//       <Modal
//         title="Download Options"
//         open={downloadModalVisible}
//         onOk={handleDownload}
//         onCancel={() => setDownloadModalVisible(false)}
//         okText="Download"
//         cancelText="Cancel"
//         width={500}
//       >
//         <Space direction="vertical" size="large" className="w-full">
//           {/* Format Selection */}
//           <div>
//             <h4 className="text-base font-semibold mb-3">Select Format</h4>
//             <Radio.Group
//               value={downloadFormat}
//               onChange={(e) => setDownloadFormat(e.target.value)}
//             >
//               <Radio value="excel">Excel (.xlsx)</Radio>
//               <Radio value="pdf">PDF (.pdf)</Radio>
//             </Radio.Group>
//           </div>

//           <Divider />

//           {/* Column Selection */}
//           <div>
//             <div className="flex items-center justify-between mb-3">
//               <h4 className="text-base font-semibold">Select Columns</h4>
//               <Space>
//                 <Button
//                   type="link"
//                   size="small"
//                   onClick={() =>
//                     setSelectedColumns(availableColumns.map((col) => col.key))
//                   }
//                 >
//                   Select All
//                 </Button>
//                 <Button
//                   type="link"
//                   size="small"
//                   onClick={() => setSelectedColumns([])}
//                 >
//                   Clear All
//                 </Button>
//               </Space>
//             </div>
//             <Checkbox.Group
//               value={selectedColumns}
//               onChange={setSelectedColumns}
//               className="w-full"
//             >
//               <Space direction="vertical" className="w-full">
//                 {availableColumns.map((col) => (
//                   <Checkbox key={col.key} value={col.key}>
//                     {col.title}
//                   </Checkbox>
//                 ))}
//               </Space>
//             </Checkbox.Group>
//           </div>
//         </Space>
//       </Modal>
//     </Spin>
//   );
// };

// export default Donations;
