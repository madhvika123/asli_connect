import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, message, Modal, Spin, Switch, Table, Tag } from "antd";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import { PlusOutlined, SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { fetchData } from "../../../api/apiService";
import { FaHospital, FaUserDoctor, FaUsers, FaBuilding } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [dashboardData, setDashboardData] = useState({
    totalBranches: 0,
    totalDoctors: 0,
    totalPatients: 0,
    newVisits: [],
    newBranches: [],
    hospitalDetails: {}
  });

  // Fetch hospital dashboard data from API
  const fetchHospitalDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetchData("/api/hospital/hospital-dashboard");
      
      if (response.responseCode === 200) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error fetching hospital dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitalDashboardData();
  }, []);

  // Filter visits and branches based on search input
  const filteredVisits = dashboardData.newVisits?.filter(visit =>
    visit.visitId?.toLowerCase().includes(searchInput.toLowerCase()) ||
    visit.patient?.patientId?.toLowerCase().includes(searchInput.toLowerCase()) ||
    visit.complaints?.toLowerCase().includes(searchInput.toLowerCase()) ||
    visit.department?.toLowerCase().includes(searchInput.toLowerCase()) ||
    visit.visitType?.toLowerCase().includes(searchInput.toLowerCase())
  ) || [];

  const filteredBranches = dashboardData.newBranches?.filter(branch =>
    branch.branchName?.toLowerCase().includes(searchInput.toLowerCase()) ||
    branch.branchCode?.toLowerCase().includes(searchInput.toLowerCase()) ||
    branch.city?.toLowerCase().includes(searchInput.toLowerCase()) ||
    branch.state?.toLowerCase().includes(searchInput.toLowerCase())
  ) || [];

  // Enhanced status rendering function for visits
  const renderVisitStatus = (status) => {
    const statusConfig = {
      pending: { color: '#FFA500', bg: '#FFF3E0', text: '#E65100' },
      completed: { color: '#4CAF50', bg: '#E8F5E8', text: '#2E7D32' },
      cancelled: { color: '#F44336', bg: '#FFEBEE', text: '#C62828' },
      'in-progress': { color: '#2196F3', bg: '#E3F2FD', text: '#1565C0' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <Tag
        style={{
          backgroundColor: config.bg,
          color: config.text,
          border: `1px solid ${config.color}`,
          borderRadius: '6px',
          padding: '4px 12px',
          fontWeight: '500',
          fontSize: '12px'
        }}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending'}
      </Tag>
    );
  };

  // Enhanced status rendering function for branches
  const renderBranchStatus = (status) => {
    const statusConfig = {
      active: { color: '#4CAF50', bg: '#E8F5E8', text: '#2E7D32' },
      inactive: { color: '#F44336', bg: '#FFEBEE', text: '#C62828' },
      pending: { color: '#FFA500', bg: '#FFF3E0', text: '#E65100' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    
    return (
      <Tag
        style={{
          backgroundColor: config.bg,
          color: config.text,
          border: `1px solid ${config.color}`,
          borderRadius: '6px',
          padding: '4px 12px',
          fontWeight: '500',
          fontSize: '12px'
        }}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Active'}
      </Tag>
    );
  };

  // Enhanced Visits table columns
  const visitsColumns = [
    {
      title: "S.No",
      align: "center",
      key: "index",
      width: 70,
      render: (_, __, index) => (
        <span style={{ fontWeight: '500', color: '#666' }}>
          {index + 1}
        </span>
      ),
    },
    {
      title: "Visit ID",
      dataIndex: "visitId",
      align: "center",
      key: "visitId",
      width: 120,
      render: (visitId) => (
        <span style={{ 
          fontWeight: '600', 
          color: '#1976d2',
          backgroundColor: '#E3F2FD',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          {visitId}
        </span>
      ),
    },
    {
      title: "Patient ID",
      dataIndex: ["patient", "patientId"],
      align: "center",
      key: "patientId",
      width: 120,
      render: (patientId) => (
        <span style={{ 
          fontWeight: '500', 
          color: '#333',
          backgroundColor: '#F5F5F5',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          {patientId || "N/A"}
        </span>
      ),
    },
    {
      title: "Visit Date",
      dataIndex: "visitDateTime",
      align: "center",
      key: "visitDateTime",
      width: 140,
      render: (date) => (
        <div style={{ fontSize: '12px', color: '#555' }}>
          <div style={{ fontWeight: '500' }}>
            {date ? moment(date).format("DD/MM/YYYY") : "Not Available"}
          </div>
          <div style={{ color: '#888', fontSize: '11px' }}>
            {date ? moment(date).format("HH:mm") : ""}
          </div>
        </div>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      align: "center",
      key: "department",
      width: 120,
      render: (department) => (
        <span style={{ 
          fontWeight: '500', 
          color: '#6B46C1',
          backgroundColor: '#F3E8FF',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          {department}
        </span>
      ),
    },
    {
      title: "Visit Type",
      dataIndex: "visitType",
      align: "center",
      key: "visitType",
      width: 100,
      render: (visitType) => (
        <span style={{ 
          fontSize: '12px',
          color: '#555',
          fontWeight: '500'
        }}>
          {visitType}
        </span>
      ),
    },
    {
      title: "Complaints",
      dataIndex: "complaints",
      align: "left",
      key: "complaints",
      width: 200,
      ellipsis: true,
      render: (complaints) => (
        <span style={{ 
          fontSize: '12px',
          color: '#333',
          lineHeight: '1.4'
        }}>
          {complaints || "No complaints"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      key: "status",
      width: 100,
      render: renderVisitStatus,
    },
    {
      title: "Payment",
      dataIndex: "paid",
      align: "center",
      key: "paid",
      width: 100,
      render: (paid) => (
        <Tag
          style={{
            backgroundColor: paid ? '#E8F5E8' : '#FFEBEE',
            color: paid ? '#2E7D32' : '#C62828',
            border: `1px solid ${paid ? '#4CAF50' : '#F44336'}`,
            borderRadius: '6px',
            padding: '4px 8px',
            fontWeight: '500',
            fontSize: '12px'
          }}
        >
          {paid ? 'Paid' : 'Unpaid'}
        </Tag>
      ),
    },
  ];

  // Enhanced Branches table columns
  const branchesColumns = [
    {
      title: "S.No",
      align: "center",
      key: "index",
      width: 70,
      render: (_, __, index) => (
        <span style={{ fontWeight: '500', color: '#666' }}>
          {index + 1}
        </span>
      ),
    },
    {
      title: "Branch Code",
      dataIndex: "branchCode",
      align: "center",
      key: "branchCode",
      width: 130,
      render: (branchCode) => (
        <span style={{ 
          fontWeight: '600', 
          color: '#7C3AED',
          backgroundColor: '#F3E8FF',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          {branchCode}
        </span>
      ),
    },
    {
      title: "Branch Name",
      dataIndex: "branchName",
      align: "center",
      key: "branchName",
      width: 150,
      render: (branchName) => (
        <span style={{ 
          fontWeight: '500', 
          color: '#333',
          fontSize: '12px'
        }}>
          {branchName}
        </span>
      ),
    },
    {
      title: "Location",
      key: "location",
      align: "center",
      width: 150,
      render: (_, record) => (
        <div style={{ fontSize: '12px', color: '#555' }}>
          <div style={{ fontWeight: '500' }}>
            {record.city}
          </div>
          <div style={{ color: '#888', fontSize: '11px' }}>
            {record.state}, {record.country}
          </div>
        </div>
      ),
    },
    {
      title: "Registration",
      dataIndex: "registrationNumber",
      align: "center",
      key: "registrationNumber",
      width: 120,
      render: (registrationNumber) => (
        <span style={{ 
          fontWeight: '500', 
          color: '#059669',
          backgroundColor: '#ECFDF5',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          {registrationNumber}
        </span>
      ),
    },
    {
      title: "Beds",
      dataIndex: "noOfBeds",
      align: "center",
      key: "noOfBeds",
      width: 80,
      render: (noOfBeds) => (
        <span style={{ 
          fontSize: '12px',
          color: '#555',
          fontWeight: '500'
        }}>
          {noOfBeds}
        </span>
      ),
    },
    {
      title: "Rooms",
      dataIndex: "noOfRooms",
      align: "center",
      key: "noOfRooms",
      width: 80,
      render: (noOfRooms) => (
        <span style={{ 
          fontSize: '12px',
          color: '#555',
          fontWeight: '500'
        }}>
          {noOfRooms}
        </span>
      ),
    },
    {
      title: "Doctors",
      dataIndex: "doctors",
      align: "center",
      key: "doctors",
      width: 80,
      render: (doctors) => (
        <span style={{ 
          fontWeight: '600', 
          color: '#DC2626',
          backgroundColor: '#FEF2F2',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          {doctors?.length || 0}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      key: "status",
      width: 100,
      render: renderBranchStatus,
    },
  ];

  // Dashboard stats cards
  const statsCards = [
    {
      title: "Total Branches",
      count: dashboardData.totalBranches,
      color: "#0071FF",
      icon: FaBuilding
    },
    {
      title: "Total Doctors",
      count: dashboardData.totalDoctors,
      color: "#04D5C7",
      icon: FaUserDoctor
    },
    {
      title: "Total Patients",
      count: dashboardData.totalPatients,
      color: "#9385F7",
      icon: FaUsers
    },
    {
      title: "Hospital Profile",
      count: dashboardData.hospitalDetails?.name ? 1 : 0,
      color: "#FF986E",
      icon: FaHospital
    }
  ];

  // Custom table styles
  const tableStyles = {
    '.ant-table': {
      backgroundColor: '#fff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    '.ant-table-thead > tr > th': {
      backgroundColor: '#F8FAFC !important',
      borderBottom: '2px solid #E2E8F0 !important',
      color: '#374151 !important',
      fontWeight: '600 !important',
      fontSize: '13px !important',
      padding: '16px 12px !important',
      textAlign: 'center !important'
    },
    '.ant-table-tbody > tr': {
      transition: 'all 0.2s ease'
    },
    '.ant-table-tbody > tr:hover': {
      backgroundColor: '#F8FAFC !important',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    '.ant-table-tbody > tr > td': {
      padding: '12px !important',
      borderBottom: '1px solid #F1F5F9 !important',
      fontSize: '12px !important'
    },
    '.ant-table-tbody > tr:last-child > td': {
      borderBottom: 'none !important'
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <style>
        {Object.entries(tableStyles).map(([selector, styles]) => 
          `${selector} { ${Object.entries(styles).map(([prop, value]) => 
            `${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`
          ).join('; ')} }`
        ).join('\n')}
      </style>
      
      <div className="w-[98%] mx-auto flex flex-col gap-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-5">
          {statsCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                className="p-3 py-4 rounded-lg flex justify-between items-center cursor-pointer transform transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: card.color,
                  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)"
                }}
              >
                <div>
                  <h4 className="text-2xl font-bold text-white">{card.count}</h4>
                  <h5 className="text-white font-medium text-lg">{card.title}</h5>
                </div>
                <div className="flex justify-center p-3 bg-white rounded-full">
                  <IconComponent size={30} color={card.color} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Search Bar */}
        <div className="flex items-center justify-start">
          <TextField
            id="search-dashboard"
            label="Search Visits & Branches"
            variant="outlined"
            size="small"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="search"
            style={{
              minWidth: '300px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: '#FAFAFA'
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchOutlined style={{ color: '#666' }} />
                </InputAdornment>
              ),
            }}
          />
        </div>

        {/* Enhanced Recent Visits Section */}
        <div className="bg-white p-2 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-800">
              Recent Visits
            </h3>
          </div>
          <div className="rounded-lg overflow-hidden">
            <Table
              columns={visitsColumns}
              dataSource={filteredVisits}
              loading={loading}
              locale={{ emptyText: "No visits available" }}
              pagination={false}
              rowKey={(record) => record._id}
              scroll={{ x: "max-content" }}
              size="small"
            />
          </div>
        </div>

        {/* Enhanced Recent Branches Section */}
        <div className="bg-white p-2 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-800">
              Hospital Branches
            </h3>
          </div>
          <div className="rounded-lg overflow-hidden">
            <Table
              columns={branchesColumns}
              dataSource={filteredBranches}
              loading={loading}
              locale={{ emptyText: "No branches available" }}
              pagination={false}
              rowKey={(record) => record._id}
              scroll={{ x: "max-content" }}
              size="small"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HospitalDashboard;