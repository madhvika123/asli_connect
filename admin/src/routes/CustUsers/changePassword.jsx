import { Modal, Form, Input, message } from "antd";
import { patchData } from "../../api/apiService";

const ChangePassword = ({ open, setOpen, user }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await patchData("/api/admin-user/update-password", {
        userId: user._id,
        newPassword: values.password,
      });
      message.success("Password changed");
      setOpen(false);
      form.resetFields();
    } catch {
      message.error("Failed to change password");
    }
  };

  return (
    <Modal
      open={open}
      title={
        <>
          Reset Password
          <div style={{ fontSize: 13, color: "#666" }}>
            {user?.name} | {user?.email} | {user?.phoneNo}
          </div>
        </>
      }
      onCancel={() => setOpen(false)}
      onOk={() => form.submit()}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="password"
          label="New Password"
          rules={[
            { required: true, message: "Password is required" },
            { min: 8, message: "Minimum 8 characters" },
          ]}
        >
          <Input.Password placeholder="Enter new password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePassword;