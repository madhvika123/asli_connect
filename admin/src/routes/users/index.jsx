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
import AddUser from "./AddUser";
import ChangePassword from "./changePassword";
import { postData, fetchData, patchData, deleteData } from "../../api/apiService";

const Users = () => {
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
        `/api/admin-user/lists?page=${page}&limit=${pageSize}`
      );
      console.log("USERS RESPONSE:", res);

      if (res?.status === 200) {
        setUsers(res.data || []);
        setTotal(res.pagination?.total || 0);
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
        `/api/admin-user/status-update/${record._id}`,
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
          await deleteData(`/api/admin-user/delete/${record._id}`);
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
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
    },
    {
      title: "Phone No",
      dataIndex: "phoneNo",
      align: "center",
    },
    {
      title: "Role",
      dataIndex: "role",
      align: "center",
      render: (role) => role?.replace("-", " ").toUpperCase(),
    },
    {
      title: "Status",
      dataIndex: "status",
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
      align: "center",
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
          <h2 className="text-lg font-semibold">Admin Users List</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditUser(null);
              setUserDrawer(true);
            }}
          >
            Add Admin User
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
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

        {/* ADD / EDIT USER */}
        <AddUser
          userDrawer={userDrawer}
          setUserDrawer={setUserDrawer}
          editUser={editUser}
          fetchUsers={fetchUsers}
        />

        {/* CHANGE PASSWORD */}
        <ChangePassword
          open={passwordModal}
          setOpen={setPasswordModal}
          user={selectedUser}
        />
      </div>
    </Spin>
  );
};

export default Users;
