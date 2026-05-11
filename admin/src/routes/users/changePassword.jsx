import { Modal, Form, Input, message } from "antd";
import { postData, patchData } from "../../api/apiService";

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
      title="Reset Password"
      onCancel={() => setOpen(false)}
      onOk={() => form.submit()}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="password"
          label="New Password"
          rules={[{ required: true, min: 8 }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePassword;
