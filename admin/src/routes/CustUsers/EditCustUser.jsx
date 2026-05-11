import { Drawer, Form, Input, Button, Space, message, Select } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { putData } from "../../api/apiService";
import { useEffect, useState } from "react";

const { Option } = Select;

const EditCustUser = ({ userDrawer, setUserDrawer, editUser, fetchUsers }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editUser) {
      form.setFieldsValue({
        name: editUser.name,
        userName: editUser.userName,
        email: editUser.email,
        phoneNo: editUser.phoneNo,
        profileVisibility: editUser.profileVisibility,
      });
    }
  }, [editUser, form]);

  const onFinish = async (values) => {
    if (!editUser || loading) return;

    try {
      setLoading(true);

      await putData(`/api/customers/update/${editUser._id}`, values);
      message.success("User updated successfully");

      setUserDrawer(false);
      fetchUsers();
    } catch (err) {
      message.error(err?.response?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUserDrawer(false);
    // form.resetFields();
  };

  return (
    <Drawer
      open={userDrawer}
      title={`Edit User - ${editUser?.name || ""}`}
      width={450}
      closable={false}
      onClose={handleClose}
      extra={
        <Button type="text" onClick={handleClose}>
          <CloseOutlined />
        </Button>
      }
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
      
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

        <Form.Item
          name="userName"
          label="Username"
          rules={[{ required: true, message: "Username is required" }]}
        >
          <Input placeholder="Enter username" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

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

        <Form.Item
          name="profileVisibility"
          label="Profile Visibility"
          rules={[
            { required: true, message: "Profile visibility is required" },
          ]}
        >
          <Select placeholder="Select visibility">
            <Option value="public">Public</Option>
            <Option value="private">Private</Option>
            <Option value="friends">Friends</Option>
          </Select>
        </Form.Item>

        <Space className="flex justify-end mt-4">
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update
          </Button>
        </Space>
      </Form>
    </Drawer>
  );
};

export default EditCustUser;
