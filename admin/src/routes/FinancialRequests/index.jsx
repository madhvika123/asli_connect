import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, message, Modal, Spin, Switch, Table, Tag } from "antd";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { fetchData, postData } from "../../api/apiService";
import { MdEdit } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
// import AddDoctor from "./AddDoctor";
import { PiGitBranchFill } from "react-icons/pi";

const FinancialHelp = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("0");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);

  const financialHelpColumns = [
    {
      title: "S.No",
      align: "center",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: ["user", "name"],
      key: "name",
      align: "center",
      render: (name) => <span className="capitalize">{name || "N/A"}</span>,
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
      align: "center",
      render: (email) => <span>{email || "N/A"}</span>,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      align: "center",
      render: (reason) => <span>{reason || "N/A"}</span>,
    },
    {
      title: "Amount Requested",
      dataIndex: "amountRequested",
      key: "amountRequested",
      align: "center",
      render: (amount) => <span>₹ {amount?.toLocaleString() || 0}</span>,
    },
    {
      title: "Additional Details",
      dataIndex: "additionalDetails",
      key: "additionalDetails",
      align: "center",
      render: (details) => (
        <span
          title={details || "N/A"}
          style={{
            display: "inline-block",
            maxWidth: 150, // limit width
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            verticalAlign: "middle",
          }}
        >
          {details || "N/A"}
        </span>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        let color = "default";
        if (status === "pending") color = "orange";
        if (status === "approved") color = "green";
        if (status === "rejected") color = "red";
        return <Tag color={color}>{status || "N/A"}</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt) =>
        createdAt ? moment(createdAt).format("DD/MM/YYYY") : "N/A",
    },
  ];

  const fetchUserList = async () => {
    const payload = {
      page: currentPage,
      pageSize: pageSize,
      isPartyMember: false,
      search: searchQuery,
      sortBy: selectedFilter, /// 1 --- old or 0 -- latest
    };
    try {
      setLoading(true);
      const response = await postData(
        "/api/admin/list-of-financial-help-requests",
        payload
      );
      if (response?.responseCode == 200) {
        setUsers(response?.data || []);
        setTotal(response?.data?.length || 1);
      } else if (response?.responseCode == 400) {
        message.error(response?.message || "Something went wrong");
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to fetch doctors List");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, [selectedFilter, currentPage, pageSize, searchQuery]);

  console.log("users", users);

  return (
    <Spin spinning={loading}>
      <div className="mt-2 flex flex-col gap-2">
        <div className="flex items-center justify-between client-details-form">
          <div className="flex items-center justify-start gap-1 w-full">
            <TextField
              id="outlined-basic"
              label="Search"
              variant="outlined"
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              type="search"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchOutlined className="search-icon" />
                  </InputAdornment>
                ),
              }}
            />
            {/* <TextField
              select
              fullWidth
              size="small"
              label="Select Branch"
              placeholder="Select one branch"
              className="max-w-[30%]"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <MenuItem value={""}>All</MenuItem>
              {(Array.isArray(branchData) ? branchData : []).map((item) => (
                <MenuItem value={item?._id} key={item?._id}>
                  {item?.branchName}
                </MenuItem>
              ))}
            </TextField> */}
          </div>
          <div className="flex items-center justify-end gap-1 w-full">
            <TextField
              select
              fullWidth
              size="small"
              label="Sort by Date"
              placeholder="Select sorting order"
              className="max-w-[25%]"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <MenuItem value="0">Newest First</MenuItem>
              <MenuItem value="1">Oldest First</MenuItem>
            </TextField>

            {/* <Button
              type="button"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditId(null);
                setDoctorDrawer(true);
              }}
              className="bg-primary text-white h-[36px]"
            >
              Add New
            </Button> */}
          </div>
        </div>
        <div className="max-h-[80dvh] overflow-y-auto pr-1">
          <Table
            columns={financialHelpColumns}
            dataSource={users}
            locale={{ emptyText: "No Requests available" }}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              },
            }}
            rowKey={(record) => record._id}
            scroll={{ x: "max-content" }}
          />
        </div>
        {/* <Modal visible={warningModal} footer={null} centered closeIcon={false}>
          <Spin spinning={modalLoad}>
            <div className="dashboard m-2">
              <h4 className="text-xl font-semibold text-center py-2">
                Are you sure you want to{" "}
                {doctorRecord?.status === "active" ? "Deactivate" : "Activate"}{" "}
                <br /> this doctor status
              </h4>
              <footer className="flex justify-center items-center pt-2 space-x-4">
                <Button
                  type="default"
                  onClick={() => {
                    setDoctorRecord(null);
                    setWarningModal(false);
                  }}
                  className="min-w-[100px]"
                >
                  No
                </Button>
                <Button
                  type="primary"
                  className="min-w-[100px]"
                  onClick={() => doctorChangeStatus()}
                >
                  Yes
                </Button>
              </footer>
            </div>
          </Spin>
        </Modal> */}
        {/* <AddDoctor
          doctorDrawer={doctorDrawer}
          setDoctorDrawer={setDoctorDrawer}
          fetchDoctorsList={fetchDoctorsList}
          editId={editId}
          setEditId={setEditId}
          branchData={branchData}
          setBranchData={setBranchData}
          departmentData={departmentData}
        /> */}
      </div>
    </Spin>
  );
};

export default FinancialHelp;
