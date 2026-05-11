import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, message, Modal, Spin, Switch, Table } from "antd";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { fetchData, postData } from "../../api/apiService";
import { MdEdit } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
// import AddDoctor from "./AddDoctor";
import { PiGitBranchFill } from "react-icons/pi";
import AddUser from "./addUser";

const Articles = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("0");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [userModelFlag, setUserModelFlag] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [newStatus, setNewStatus] = useState(false);
  const [modalLoad, setModalLoad] = useState(false);

  // const toggleUser

  const userChangeStatus = async () => {
    console.log(selectedRecord);
    setModalLoad(true);

    const payload = {
      userId: selectedRecord._id,
    };
    try {
      setLoading(true);
      const response = await postData("/api/admin/toggle-user", payload);
      if (response?.responseCode == 200) {
        setWarningModal(false);
        setSelectedRecord(null);
      } else if (response?.responseCode == 400) {
        message.error(response?.message || "Something went wrong");
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      s;
      message.error(error?.message || "Failed to fetch doctors List");
    } finally {
      setModalLoad(false);
      fetchUserList();
    }
  };

  const handleStatusChange = (record, status) => {
    try {
      const payload = {
        financialRequestId: record._id,
        status: status,
      };
      setLoading(true);
      const response = postData(
        "/api/mla/approve-or-reject-financial-help-request",
        payload
      );
      if (response?.responseCode === 200) {
        message.success("Status updated successfully");
        fetchUserList();
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "S.No",
      align: "center",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (name) => <span className="capitalize">{name || "N/A"}</span>,
    },
    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
      align: "center",
      render: (purpose) => <span>{purpose || "N/A"}</span>,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      align: "center",
      render: (reason) => {
        const displayText = reason ? reason.slice(0, 30) : "N/A";
        return (
          <span title={reason}>
            {displayText}
            {reason && reason.length > 30 ? "..." : ""}
          </span>
        );
      },
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      key: "dateAndTime",
      align: "center",
      render: (date, record) =>
        date && record.timeSlot
          ? moment(`${date} ${record.timeSlot}`).format("DD/MM/YYYY hh:mm A")
          : "N/A",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      align: "center",
      render: (phone) => <span>{phone || "N/A"}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => <span>{status || "N/A"}</span>,
    },
    {
      title: "Actions",
      dataIndex: "status",
      key: "actions",
      align: "center",
      render: (status, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          {/* <span className="capitalize">{status || "pending"}</span> */}
          {status === "pending" && (
            <>
              <button
                onClick={() => handleStatusChange(record, "approved")}
                style={{
                  padding: "4px 8px",
                  backgroundColor: "green",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Accept
              </button>
              <button
                onClick={() => handleStatusChange(record, "rejected")}
                style={{
                  padding: "4px 8px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Reject
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const fetchUserList = async () => {
    const payload = {
      page: currentPage,
      pageSize: pageSize,
      search: searchQuery,
      sort: selectedFilter, // 1 = old, 0 = latest
      filter: "",
    };

    try {
      setLoading(true);
      const response = await postData("/api/mla/list-of-media", payload);
      if (response?.responseCode === 200) {
        setUsers(response?.data?.media || []); // 👈 update to events
        setTotal(response?.data?.totalMedia || 0); // 👈 update to totalEvents
      } else {
        message.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      message.error(error?.message || "Failed to fetch events");
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

            <Button
              type="button"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditId(null);
                setUserModelFlag(true);
              }}
              className="bg-primary text-white h-[36px]"
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="max-h-[80dvh] overflow-y-auto pr-1">
          <Table
            columns={columns}
            dataSource={users}
            locale={{ emptyText: "No Users available" }}
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
        <AddUser
          patientDrawer={userModelFlag}
          setPatientDrawer={setUserModelFlag}
          fetchPatientsList={fetchUserList}
          editId={editId}
          setEditId={setEditId}
        />
      </div>

      <Modal visible={warningModal} footer={null} centered closeIcon={false}>
        <Spin spinning={modalLoad}>
          <div className="dashboard m-2">
            <h4 className="text-xl font-semibold text-center py-2">
              Are you sure you want to{" "}
              {selectedRecord?.isActive ? "Deactivate" : "Activate"} <br /> this
              user status
            </h4>
            <footer className="flex justify-center items-center pt-2 space-x-4">
              <Button
                type="default"
                onClick={() => {
                  setSelectedRecord(null);
                  setWarningModal(false);
                }}
                className="min-w-[100px]"
              >
                No
              </Button>
              <Button
                type="primary"
                className="min-w-[100px]"
                onClick={() => userChangeStatus()}
              >
                Yes
              </Button>
            </footer>
          </div>
        </Spin>
      </Modal>
    </Spin>
  );
};

export default Articles;
