import { Drawer, Form, Input, Button, Space, message, Select } from "antd";
import {
  CloseOutlined
} from "@ant-design/icons";
import { postData, putData } from "../../api/apiService";
import { useEffect, useState } from "react";

const { Option } = Select;

/* ===================== ROLE OPTIONS ===================== */
const ROLE_OPTIONS = [
  { label: "Admin", value: "admin" },
  { label: "Content Admin", value: "content-admin" },
  { label: "Finance Admin", value: "finance-admin" },
  { label: "Market Admin", value: "market-admin" },
  { label: "Job Admin", value: "job-admin" },
  { label: "Support Admin", value: "support-admin" },
  { label: "User", value: "user" },
];

const AddUser = ({ userDrawer, setUserDrawer, editUser, fetchUsers }) => {
  console.log("=====editUser======", editUser)
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  /* ===================== PREFILL FOR EDIT ===================== */
  useEffect(() => {
    if (editUser) {
      form.setFieldsValue({
        name: editUser.name,
        email: editUser.email,
        phoneNo: editUser.phoneNo,
        role: editUser.role,
      });
    } else {
      form.resetFields();
    }
  }, [editUser, form]);

 const onFinish = async (values) => {
  if (loading) return;

  try {
    setLoading(true);

    if (editUser) {
      await putData(`/api/admin-user/update/${editUser._id}`, values);
      message.success("User updated successfully");
    } else {
      await postData("/api/admin-user/create", values);
      message.success("User created successfully");
    }

    setUserDrawer(false);
    form.resetFields();
    fetchUsers();
  } catch (err) {
    message.error(
      err?.response?.data?.message || err?.message || "Failed to save user"
    );
  } finally {
    setLoading(false);
  }
};

  const handleClose = () => {
    setUserDrawer(false);
    if (!editUser) {
      form.resetFields();
    }
  };

  return (
    <Drawer
      open={userDrawer}
      title={editUser ? "Edit Admin" : "Create Admin"}
      width={450}
      closable={false}
      extra={
        <Button type="text" onClick={handleClose}>
          <CloseOutlined />
        </Button>
      }
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        {/* NAME */}
        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: "Name is required" },
            { pattern: /^[A-Za-z ]+$/, message: "Only alphabets allowed" },
          ]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        {/* EMAIL */}
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter valid email" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        {/* PHONE */}
        <Form.Item
          name="phoneNo"
          label="Phone Number"
          rules={[
            { required: true, message: "Phone number is required" },
            { pattern: /^\d{10}$/, message: "Enter 10 digit number" },
          ]}
        >
          <Input maxLength={10} placeholder="Enter phone number" />
        </Form.Item>

        {/* ROLE */}
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select placeholder="Select role">
            {ROLE_OPTIONS.map((role) => (
              <Option key={role.value} value={role.value}>
                {role.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* PASSWORD (CREATE ONLY) */}
        {!editUser && (
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 6, message: "Minimum 6 characters" },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
        )}

        {/* ACTIONS */}
        <Space className="flex justify-end mt-4">
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            {editUser ? "Update" : "Create"}
          </Button>
        </Space>
      </Form>
    </Drawer>
  );
};

export default AddUser;
