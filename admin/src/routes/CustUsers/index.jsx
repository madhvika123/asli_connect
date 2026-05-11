import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Switch,
  Modal,
  message,
  Spin,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  KeyOutlined, LockOutlined
} from "@ant-design/icons";
import EditCustUser from "./EditCustUser";
import ChangePassword from "./changePassword";
import { postData, fetchData, patchData, deleteData } from "../../api/apiService";

const CustUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [userDrawer, setUserDrawer] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [passwordModal, setPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  /* ===================== FETCH USERS ===================== */
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await fetchData(
        `/api/customers/lists?page=${page}&limit=${pageSize}`
      );
      if (res?.status === 200) {
        const onlyUsers = (res.data || []).filter((user) => user.role === 'user');
        setUsers(onlyUsers);
        setTotal(onlyUsers.length);
      } else {
        message.error(res?.message || "Failed to fetch users");
      }
    } catch (err) {
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize]);

  /* ===================== STATUS TOGGLE ===================== */
  const toggleStatus = async (record) => {
    const newStatus = record.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      await patchData(
        `/api/customers/status-update/${record._id}`,
        { status: newStatus }
      );

      message.success("Status updated successfully");
      fetchUsers();
    } catch (error) {
      message.error("Failed to update status");
    }
  };


  /* ===================== DELETE USER ===================== */
  const deleteUser = (record) => {
    Modal.confirm({
      title: "Delete User",
      content: <>Are you sure you want to delete <b>{record.name}</b>?</>,
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteData(`/api/customers/delete/${record._id}`);
          message.success("User deleted successfully");
          fetchUsers();
        } catch {
          message.error("Failed to delete user");
        }
      },
    });
  };

  /* ===================== TABLE COLUMNS ===================== */
  const columns = [
  {
    title: "S.No",
    key: "sno",
    width: 70,
    align: "center",
    render: (_, __, index) => index + 1,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 140,
    align: "center",
  },
  {
    title: "Username",
    dataIndex: "userName",
    key: "userName",
    width: 150,
    align: "center",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 220,
    align: "center",
  },
  {
    title: "Phone No",
    dataIndex: "phoneNo",
    key: "phoneNo",
    width: 140,
    align: "center",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    width: 120,
    align: "center",
    render: (role) => role?.replace("-", " ").toUpperCase(),
  },
  {
    title: "Email Verified",
    dataIndex: "isEmailVerified",
    key: "isEmailVerified",
    width: 140,
    align: "center",
    render: (val) => (val ? "Yes" : "No"),
  },
  {
    title: "2FA Enabled",
    dataIndex: "twoFactorEnabled",
    key: "twoFactorEnabled",
    width: 130,
    align: "center",
    render: (val) => (val ? "Yes" : "No"),
  },
  {
    title: "Profile Visibility",
    dataIndex: "profileVisibility",
    key: "profileVisibility",
    width: 160,
    align: "center",
  },
  {
    title: "Followers",
    key: "followers",
    width: 120,
    align: "center",
    render: () => 0, // replace later with real data
  },
  {
    title: "Following",
    key: "following",
    width: 120,
    align: "center",
    render: () => 0,
  },
  {
    title: "Wallet Balance",
    key: "wallet",
    width: 150,
    align: "center",
    render: () => "₹0",
  },
  {
    title: "Location",
    key: "location",
    width: 140,
    align: "center",
    render: (_, record) =>
      record?.location?.coordinates ? "Available" : "N/A",
  },
  {
    title: "Joined On",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 160,
    align: "center",
    render: (date) =>
      date ? new Date(date).toLocaleDateString() : "-",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 110,
    align: "center",
    render: (status, record) => (
      <Switch
        checked={status === "ACTIVE"}
        onChange={() => toggleStatus(record)}
      />
    ),
  },
  {
    title: "Actions",
    key: "actions",
    width: 150,
    align: "center",
    fixed: "right",
    render: (_, record) => (
      <Space>
        <Tooltip title="Edit">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditUser(record);
              setUserDrawer(true);
            }}
          />
        </Tooltip>

        <Tooltip title="Reset Password">
          <Button
            icon={<LockOutlined />}
            onClick={() => {
              setSelectedUser(record);
              setPasswordModal(true);
            }}
          />
        </Tooltip>

        <Tooltip title="Delete">
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteUser(record)}
          />
        </Tooltip>
      </Space>
    ),
  },
];


  return (
    <Spin spinning={loading}>
      <div className="bg-white p-4 rounded-md">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Users List</h2>
          {/* <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditUser(null);
              setUserDrawer(true);
            }}
          >
            Add Admin User
          </Button> */}
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          scroll={{ x: 2000, y: 450 }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              setPageSize(newPageSize);
            },
          }}
        />

        <EditCustUser 
          userDrawer={userDrawer}
          setUserDrawer={setUserDrawer}
          editUser={editUser}
          fetchUsers={fetchUsers}
        />

        <ChangePassword
          open={passwordModal}
          setOpen={setPasswordModal}
          user={selectedUser}
        />
      </div>
    </Spin>
  );
};

export default CustUsers;
