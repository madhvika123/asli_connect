// import React, { useState } from "react";
// import { Form, Input, Button, message, Modal, Spin } from "antd";
// import { LockOutlined } from "@ant-design/icons";

// import { postData } from "../../api/apiService";
// import useLogout from "../../utils/authUtils";

// const Changepassword = ({ email, onSuccess ,closeModal }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const logout = useLogout();

//   const primaryColor = "#3D8926";
//   const primaryHover = "#2F6C1D";

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       const values = form.getFieldsValue();
//       const payload = {
//         oldPassword: values.oldPassword,
//         newPassword: values.newPassword,
//         confirmPassword: values.confirmPassword,
//       };

//       const response = await postData(`/api/admin/change-password`, payload);

//       if (response?.responseCode === 200) {
//         message.success(response?.message);
        
//         form.resetFields();
        
//         if (closeModal) {
//           closeModal();
//         }
        
//         if (onSuccess) {
//           onSuccess();
//         }
//       } else if (response?.data?.responseCode === 400) {
//         message.error(response?.data?.message);
//       } else if (response?.data?.responseCode === 401) {
//         message.error(response?.data?.message);
//         logout();
//       } else {
//         message.error(response.data.message);
//       }
//     } catch (error) {
//       console.error("Error changing password:", error);
//       message.error("Failed to change password. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOk = () => {
//     setIsModalVisible(false);
//     logout();
//   };

//   return (
//     <>
//       <Spin spinning={loading}>
//         <Form
//           form={form}
//           layout='vertical'
//           onFinish={handleSubmit}
//           className='p-2'
//         >
//           <Form.Item
//             name='oldPassword'
//             label='Old Password'
//             rules={[
//               { required: true, message: "Please enter your old password" },
//             ]}
//           >
//             <Input.Password
//               placeholder='Enter old password'
//               prefix={<LockOutlined />}
//             />
//           </Form.Item>

//           <Form.Item
//             name='newPassword'
//             label='New Password'
//             rules={[
//               { required: true, message: "Please enter a new password" },
//             ]}
//           >
//             <Input.Password
//               placeholder='Enter new password'
//               prefix={<LockOutlined />}
//             />
//           </Form.Item>

//           <Form.Item
//             name='confirmPassword'
//             label='Confirm Password'
//             dependencies={["newPassword"]}
//             rules={[
//               { required: true, message: "Please confirm your password" },
//               ({ getFieldValue }) => ({
//                 validator(_, value) {
//                   if (!value || getFieldValue("newPassword") === value) {
//                     return Promise.resolve();
//                   }
//                   return Promise.reject(new Error("Password did not match!"));
//                 },
//               }),
//             ]}
//           >
//             <Input.Password
//               placeholder='Confirm new password'
//               prefix={<LockOutlined />}
//             />
//           </Form.Item>

//           <Form.Item className="mt-6 flex justify-end gap-3 mb-0">
//             <Button onClick={closeModal} disabled={loading} style={{ marginRight: 8 }}>
//               Cancel
//             </Button>
//             <Button
//               type="primary"
//               htmlType="submit"
//               loading={loading}
//               style={{ 
//                 backgroundColor: primaryColor, 
//                 borderColor: primaryColor,
//                 color: '#ffffff',
//               }}
//               onMouseEnter={(e) => {
//                 if (!loading) {
//                   e.currentTarget.style.backgroundColor = primaryHover;
//                   e.currentTarget.style.borderColor = primaryHover;
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 if (!loading) {
//                   e.currentTarget.style.backgroundColor = primaryColor;
//                   e.currentTarget.style.borderColor = primaryColor;
//                 }
//               }}
//             >
//               Change Password
//             </Button>
//           </Form.Item>
//         </Form>

//         <Modal
//           visible={isModalVisible}
//           centered
//           onCancel={handleOk}
//           footer={null}
//           className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto"
//         >
//         </Modal>
//       </Spin>
//     </>
//   );
// };

// export default Changepassword;