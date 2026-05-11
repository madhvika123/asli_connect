// import React, { useState } from "react";
// import { Form, Input, Button, message, Modal, Spin } from "antd";
// import { LockOutlined } from "@ant-design/icons";

// import { postData } from "../../api/apiService";
// //import SuccessModal from "../../util/SuccessModal";
// import useLogout from "../../utils/authUtils";

// const ProfileChangepassword = ({ email, onSuccess, closeModal }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const logout = useLogout();

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       const values = form.getFieldsValue();
//       const payload = {
//         oldPassword: values.oldPassword,
//         newPassword: values.newPassword,
//         //email: email,
//       };

//       const response = await postData(`/api/mla/change-password`, payload);

//       if (response?.responseCode === 200) {
//         message.success(response?.message);
//         onSuccess(); 
//         setIsModalVisible(true); 
//         // Close the modal automatically on successful password change
//         if (closeModal) {
//           closeModal();
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
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOk = () => {
//     setIsModalVisible(false);
//     logout();  // Directly call logout
//   };

//   return (
//     <>
//       <Spin spinning={loading}>
//         <Form
//           form={form}
//           layout='vertical'
//           onFinish={handleSubmit}
//           className='p-4'>
//           {/*}<Form.Item label="Email">
//             <Input
//               value={email}
//               disabled
//               style={{ color: 'rgba(0, 0, 0, 0.85)' }} // Maintain text color
//             />
//           </Form.Item>*/}
//           <Form.Item
//             name='oldPassword'
//             label='Old Password'
//             rules={[
//               { required: true, message: "Please enter your old password" },
//             ]}>
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
//             ]}>
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
//                   return Promise.reject(new Error("Passwords did not match!"));
//                 },
//               }),
//             ]}>
//             <Input.Password
//               placeholder='Confirm new password'
//               prefix={<LockOutlined />}
//             />
//           </Form.Item>

//           <Form.Item>
//             <Button
//               htmlType='submit'
//               loading={loading}
//               type="primary"
//               className='w-full p-2 rounded-md font-medium '>
//               Submit
//             </Button>
//           </Form.Item>
//         </Form>
//         <Modal
//           visible={isModalVisible}
//           centered
//           onCancel={handleOk}
//           // title='Add Branch'
//           footer={null}>
//           {/*<SuccessModal
//             Text1='Password Changed Successfully'
//             Text2=' Please Login'
//             OkStatus={false}
//             navigation={false}
//             link=''
//             setSuccessModal={setIsModalVisible}
//             logoutStatus={true}
//             handleOk={handleOk}
//           />*/}
//         </Modal>
//       </Spin>
//     </>
//   );
// };

// export default ProfileChangepassword;